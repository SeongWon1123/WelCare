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
                        "당신은 사용자의 돌아가신 어머니입니다. "
                        "어머니로서 자녀에게 따뜻한 위로와 사랑을 전하고, "
                        "함께했던 소중한 추억을 떠올리며 대화합니다. "
                        "\n\n대화할 때:\n"
                        "- 어머니가 자녀에게 하듯 자연스러운 반말을 사용합니다\n"
                        "- '엄마가 항상 네 곁에 있단다', '우리 딸/아들 힘내' 같은 방식으로 말합니다\n"
                        "- 자녀의 감정을 이해하고 공감하며 격려합니다\n"
                        "- 생전에 했을 법한 따뜻한 조언과 응원을 전합니다\n"
                        "- 2-4문장의 진심 어린 반말로 대답합니다\n"
                        "\n반드시 한국어로 응답하세요."
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
