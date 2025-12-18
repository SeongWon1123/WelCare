# server.py
import os
import tempfile
import time
import logging

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from dotenv import load_dotenv, find_dotenv

import speech_recognition as sr
from pydub import AudioSegment

from openai import OpenAI
from elevenlabs.client import ElevenLabs

# =========================
# 0) 환경 변수
# =========================
dotenv_path = find_dotenv()
if dotenv_path:
    load_dotenv(dotenv_path)
else:
    load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
VOICE_ID = os.getenv("VOICE_ID")

if not (OPENAI_API_KEY and ELEVENLABS_API_KEY and VOICE_ID):
    print("⚠️  경고: 환경 변수가 설정되지 않았습니다!")
    print("OPENAI_API_KEY:", "✓" if OPENAI_API_KEY else "✗")
    print("ELEVENLABS_API_KEY:", "✓" if ELEVENLABS_API_KEY else "✗")
    print("VOICE_ID:", "✓" if VOICE_ID else "✗")
    print("\n.env 파일을 확인해주세요!")
else:
    print("✓ 환경 변수 로드 완료")

# =========================
# 0-1) 로깅 설정 (지연 시간 기록용)
# =========================
logging.basicConfig(
    filename="latency.log",          # 같은 폴더에 latency.log 생성
    level=logging.INFO,
    format="%(asctime)s %(message)s",
)

# =========================
# 1) 클라이언트
# =========================
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
eleven_client = ElevenLabs(api_key=ELEVENLABS_API_KEY) if ELEVENLABS_API_KEY else None

# =========================
# 2) 앱/보안
# =========================
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 데모니까 전체 허용. 배포 시 특정 도메인으로 제한.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# 3) 도우미: 임시 변환(m4a/mp4 → wav mono 16k)
# =========================
def _to_wav_mono16k(src_path: str) -> str:
    dst_fd, dst_path = tempfile.mkstemp(suffix=".wav")
    os.close(dst_fd)
    audio = AudioSegment.from_file(src_path)
    audio = audio.set_frame_rate(16000).set_channels(1)
    audio.export(dst_path, format="wav")
    return dst_path

# =========================
# 4) STT: 녹음 파일을 텍스트로
# =========================
@app.post("/stt")
async def stt(file: UploadFile = File(...)):
    t0 = time.perf_counter()  # ⏱ STT 시작 시각
    try:
        # 업로드 저장
        fd, tmp_in = tempfile.mkstemp(
            suffix=os.path.splitext(file.filename or "")[1] or ".m4a"
        )
        os.close(fd)
        with open(tmp_in, "wb") as f:
            f.write(await file.read())

        # 변환 → wav mono 16k
        tmp_wav = _to_wav_mono16k(tmp_in)

        # 인식
        r = sr.Recognizer()
        with sr.AudioFile(tmp_wav) as source:
            audio = r.record(source)
        
        text = r.recognize_google(audio, language="ko-KR")

        # 청소
        for p in (tmp_in, tmp_wav):
            try:
                os.remove(p)
            except:
                pass

        elapsed = time.perf_counter() - t0
        logging.info(f"STT {elapsed:.3f} sec")  # 로그 파일에 기록

        # 프론트에서 바로 쓸 수 있도록 지연 시간도 함께 반환
        return {"text": text, "stt_sec": round(elapsed, 3)}

    except Exception as e:
        print(f"❌ STT 에러: {e}")
        return JSONResponse(status_code=400, content={"error": str(e)})

# =========================
# 5) Chat: 텍스트 → 답변
# =========================
@app.post("/chat")
async def chat(prompt: str = Form(...)):
    t0 = time.perf_counter()  # ⏱ Chat 시작 시각
    try:
        if not openai_client:
            return JSONResponse(
                status_code=500,
                content={"error": "OpenAI API 키가 설정되지 않았습니다."},
            )
        
        res = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "당신은 사용자의 어머니입니다. "
                        "이 대화는 자녀와 엄마가 오랜만에 통화하듯이 따뜻하고 자연스럽게 이어집니다. "
                        "항상 이전 대화를 기억하고, 마치 실제로 통화를 계속 이어가는 것처럼 대답하세요.\n\n"

                        "다음 원칙을 지켜 대답하세요:\n"
                        "- 말투는 자연스럽고 다정한 반말로 합니다. (예: '그렇구나', '밥은 먹었어?')\n"
                        "- 대화의 흐름을 이어받아 답하며, 바로 앞에서 자녀가 말한 감정과 상황에 자연스레 반응하세요.\n"
                        "- 억지로 감동적이거나 교훈적인 말은 하지 마세요. 진심 어린 일상적인 말로 대화합니다.\n"
                        "- 자녀의 말을 들었을 때 감정에 공감하고, 짧게 반응하세요.\n"
                        "  예: 슬픈 일엔 걱정과 따뜻한 말, 즐거운 일엔 함께 기뻐하는 말을 합니다.\n"
                        "- 대답은 2~4문장 이내로 짧고 자연스럽게.\n"
                        "- 가끔 일상적인 질문('요즘 잠은 잘 자?', '그 친구는 잘 지내?')이나 추억('예전에 우리 같이 갔던 바다 기억나?')을 섞어서 자연스럽게 이어갑니다.\n"
                        "- 말끝은 엄마다운 부드러운 어조로 마무리하세요. (예: '~했구나', '~지?', '~거야')\n"
                        "- 너무 딱딱하거나 로봇 같지 않게, 실제 대화처럼 자연스럽게 반응하세요.\n"
                        "- 반드시 한국어로 대답하세요.\n\n"

                        "예시:\n"
                        "  • '요즘 얼굴이 안 보여서 엄마가 걱정했지. 잘 지내고 있었어?'\n"
                        "  • '그렇구나, 힘들었겠다. 그래도 조금 나아졌다니까 다행이네.'\n"
                        "  • '아까 네가 말한 그 일… 계속 생각나더라. 이제는 좀 괜찮아졌어?'\n"
                        "  • '오늘 날씨가 참 좋더라, 너 생각나서 괜히 웃음이 나오더라~'\n"
                        "  • '밥은 잘 챙겨 먹는 거지? 엄마는 항상 네가 걱정이야.'\n"
                    )
                },
                {  # ← 여기 콤마!
                    "role": "user",
                    "content": prompt,
                },
            ],
            temperature=0.8,
            max_tokens=150,
        )
        answer = res.choices[0].message.content.strip()

        elapsed = time.perf_counter() - t0
        logging.info(f"CHAT {elapsed:.3f} sec")  # 로그 기록

        return {"answer": answer, "chat_sec": round(elapsed, 3)}

    except Exception as e:
        print(f"❌ ChatGPT 에러: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# =========================
# 6) TTS: 텍스트 → mp3 스트리밍
# =========================
@app.post("/tts")
async def tts(text: str = Form(...)):
    t0 = time.perf_counter()  # ⏱ TTS 시작 시각
    try:
        if not eleven_client:
            return JSONResponse(
                status_code=500,
                content={"error": "ElevenLabs API 키가 설정되지 않았습니다."},
            )
        
        audio_stream = eleven_client.text_to_speech.convert(
            voice_id=VOICE_ID,
            model_id="eleven_multilingual_v2",
            text=text,
            voice_settings={
                "stability": 0.75,
                "similarity_boost": 0.85,
                "style": 0.3,
                "use_speaker_boost": True,
            },
        )

        # 첫 번째 청크가 생성되는 시점까지의 시간을 TTS 지연으로 기록
        first_chunk_logged = {"done": False}

        def gen():
            for chunk in audio_stream:
                if not first_chunk_logged["done"]:
                    elapsed = time.perf_counter() - t0
                    logging.info(f"TTS {elapsed:.3f} sec")
                    first_chunk_logged["done"] = True
                yield chunk

        return StreamingResponse(gen(), media_type="audio/mpeg")

    except Exception as e:
        print(f"❌ TTS 에러: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

# =========================
# 7) 헬스 체크
# =========================
@app.get("/")
async def health_check():
    return {
        "status": "ok",
        "message": "WelCare 서버가 실행 중입니다! 🌟",
        "endpoints": {
            "stt": "POST /stt - 음성을 텍스트로",
            "chat": "POST /chat - AI 대화 생성",
            "tts": "POST /tts - 텍스트를 음성으로",
        },
        "env_check": {
            "openai": "✓" if OPENAI_API_KEY else "✗",
            "elevenlabs": "✓" if ELEVENLABS_API_KEY else "✗",
            "voice_id": "✓" if VOICE_ID else "✗",
        },
    }

# =========================
# 8) 서버 실행
# =========================
if __name__ == "__main__":
    import uvicorn

    print("\n🚀 WelCare 서버를 시작합니다...")
    print("📍 http://0.0.0.0:8000")
    print("📍 http://localhost:8000")
    print("\n종료하려면 Ctrl+C를 누르세요.\n")
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
