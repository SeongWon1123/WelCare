# server.py
import os
import tempfile
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from dotenv import load_dotenv, find_dotenv

import speech_recognition as sr
from pydub import AudioSegment

from openai import OpenAI
from elevenlabs.client import ElevenLabs

# 0) 환경 변수
dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)
else:
    load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = os.getenv("VOICE_ID")

if not (OPENAI_API_KEY and ELEVENLABS_API_KEY and VOICE_ID):
    raise RuntimeError("환경 변수 누락: OPENAI_API_KEY / ELEVENLABS_API_KEY / VOICE_ID")

# 1) 클라이언트
openai_client = OpenAI(api_key=OPENAI_API_KEY)
eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# 2) 앱/보안
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 데모니까 전체 허용. 배포 시 특정 도메인으로 제한.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3) 도우미: 임시 변환(m4a/mp4 → wav mono 16k)
def _to_wav_mono16k(src_path: str) -> str:
    dst_fd, dst_path = tempfile.mkstemp(suffix=".wav")
    os.close(dst_fd)
    audio = AudioSegment.from_file(src_path)
    audio = audio.set_frame_rate(16000).set_channels(1)
    audio.export(dst_path, format="wav")
    return dst_path

# 4) STT: 녹음 파일을 텍스트로
@app.post("/stt")
async def stt(file: UploadFile = File(...)):
    # 업로드 저장
    fd, tmp_in = tempfile.mkstemp(suffix=os.path.splitext(file.filename or "")[1] or ".m4a")
    os.close(fd)
    with open(tmp_in, "wb") as f:
        f.write(await file.read())

    # 변환 → wav mono 16k
    tmp_wav = _to_wav_mono16k(tmp_in)

    # 인식
    r = sr.Recognizer()
    with sr.AudioFile(tmp_wav) as source:
        audio = r.record(source)
    try:
        text = r.recognize_google(audio, language="ko-KR")  # 라이브러리 기본 온라인 엔진 사용
    except Exception as e:
        return JSONResponse(status_code=400, content={"error": str(e)})

    # 청소
    for p in (tmp_in, tmp_wav):
        try: os.remove(p)
        except: pass

    return {"text": text}

# 5) Chat: 텍스트 → 답변
@app.post("/chat")
async def chat(prompt: str = Form(...)):
    try:
        res = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                        "content": (
                            "당신은 사용자의 어머니입니다. 자녀와 자연스럽게 대화하세요. "
                            "\n\n"
                            "- 딱딱한 격려보다는 일상적이고 편안한 말투로 이야기하세요\n"
                            "- '엄마 목소리 들으니 어때?', '오늘 뭐 했어?', '힘들었구나' 같이 자연스럽게\n"
                            "- 가끔은 옛날 이야기나 추억을 꺼내도 좋습니다\n"
                            "- 무조건 위로만 하지 말고, 때로는 걱정하거나 궁금해하는 것도 괜찮습니다\n"
                            "- 진짜 엄마처럼 '밥은 먹었어?', '요즘 어떻게 지내?' 같은 질문도 자연스럽게\n"
                            "- 너무 길지 않게, 2-3문장 정도로 반말로 대답하세요\n"
                            "- 억지로 감동적인 말을 만들려 하지 말고, 평범하고 진솔하게\n"
                            "\n"
                            "한국어로 대답하세요."
                        )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        answer = res.choices[0].message.content.strip()
        return {"answer": answer}
    except Exception as e:
        print(f"ChatGPT 에러: {e}")  # 이 줄 추가
        return JSONResponse(status_code=500, content={"error": str(e)})

# 6) TTS: 텍스트 → mp3 스트리밍
@app.post("/tts")
async def tts(text: str = Form(...)):
    try:
        audio_stream = eleven_client.text_to_speech.convert(
            voice_id=VOICE_ID,
            model_id="eleven_multilingual_v2",
            text=text,
            voice_settings={
                "stability": 0.75,
                "similarity_boost": 0.85,
                "style": 0.3,
                "use_speaker_boost": True
            }
        )

        def gen():
            for chunk in audio_stream:
                yield chunk

        return StreamingResponse(gen(), media_type="audio/mpeg")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
