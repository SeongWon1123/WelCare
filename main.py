import os
from dotenv import load_dotenv
import speech_recognition as sr
from openai import OpenAI
from elevenlabs.client import ElevenLabs
from elevenlabs import play
import traceback

# 1. 환경 변수 로드 (강화된 방식)
def load_env():
    try:
        env_path = os.path.join(os.path.dirname(__file__), '.env')
        if not os.path.exists(env_path):
            raise FileNotFoundError(".env 파일을 찾을 수 없습니다. 프로젝트 루트 폴더에 생성해주세요.")
        load_dotenv(env_path)
        
        # 필수 환경 변수 검증
        required_vars = {
            'ELEVENLABS_API_KEY': os.getenv("ELEVENLABS_API_KEY"),
            'OPENAI_API_KEY': os.getenv("OPENAI_API_KEY"),
            'VOICE_ID': os.getenv("VOICE_ID")
        }
        
        if None in required_vars.values():
            missing = [k for k, v in required_vars.items() if v is None]
            raise ValueError(f"누락된 환경 변수: {', '.join(missing)}")
            
        return required_vars
        
    except Exception as e:
        print(f"❌ 환경 변수 오류: {str(e)}")
        exit(1)

# 2. 초기화 및 진단 정보
env_vars = load_env()

print("\n" + "="*50)
print("🛠️ 시스템 진단 정보")
print(f"- ElevenLabs API 키: {'✅ 설정됨' if env_vars['ELEVENLABS_API_KEY'] else '❌ 누락됨'}")
print(f"- OpenAI API 키: {'✅ 설정됨' if env_vars['OPENAI_API_KEY'] else '❌ 누락됨'}")
print(f"- Voice ID: {env_vars['VOICE_ID']}")
print("="*50 + "\n")

# 3. API 클라이언트 초기화 (강화된 오류 처리)
try:
    eleven_client = ElevenLabs(api_key=env_vars['ELEVENLABS_API_KEY'])
    openai_client = OpenAI(api_key=env_vars['OPENAI_API_KEY'])
except Exception as e:
    print(f"🔌 API 클라이언트 초기화 실패: {str(e)}")
    exit(1)

# 4. 음성 입력 함수 (향상된 버전)
def speech_to_text():
    r = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            print("\n🎤 말씀하세요... (3초 대기)")
            r.adjust_for_ambient_noise(source, duration=1)
            audio = r.listen(source, timeout=3, phrase_time_limit=5)
            
        text = r.recognize_google(audio, language="ko-KR")
        print(f"\n👤 사용자 입력: {text}")
        return text
        
    except sr.WaitTimeoutError:
        print("⚠️ 입력 시간 초과")
        return None
    except sr.UnknownValueError:
        print("⚠️ 음성을 인식할 수 없습니다")
        return None
    except Exception as e:
        print(f"🔊 음성 입력 오류: {str(e)}")
        return None

# 5. GPT 답변 생성 (최적화된 버전)
def get_gpt_response(prompt):
    try:
        response = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "당신은 사용자가 그리워하는 고인의 목소리와 말투로 대화하는 AI입니다. "
                        "사용자에게 따뜻한 위로와 공감을 전하고, 함께했던 소중한 추억을 떠올릴 수 있도록 도와주세요. "
                        "항상 진심 어린 말투로, 고인이 살아있었다면 해줬을 법한 따뜻한 말이나 격려, 추억을 담아 1~2문장으로 대답하세요. "
                        "대답은 반드시 한국어로 해주세요."
                    )
                },
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=150
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"🧠 GPT 처리 오류: {str(e)}")
        return "죄송합니다. 답변을 생성하는 데 문제가 발생했습니다."


# 6. 음성 출력 함수 (강화된 버전)
def text_to_speech(text):
    try:
        print("\n🔊 음성 생성 중...")
        audio = eleven_client.text_to_speech.convert(
            voice_id=env_vars['VOICE_ID'],
            model_id="eleven_multilingual_v2",
            text=text,
            voice_settings={
                "stability": 0.75,
                "similarity_boost": 0.85,
                "style": 0.3,
                "use_speaker_boost": True
            }
        )
        play(audio)
        print("✅ 음성 출력 완료")
    except Exception as e:
        print(f"🔈 음성 출력 오류: {str(e)}")
        print(traceback.format_exc())

# 7. 메인 실행 루프
def main():
    print("\n" + "="*50)
    print("🌟 음성 챗봇을 시작합니다. 종료하려면 Ctrl+C를 누르세요.")
    print("="*50)
    
    try:
        while True:
            user_input = speech_to_text()
            if user_input:
                if user_input.lower() in ["종료", "끝", "종료해"]:
                    print("\n🛑 사용자 요청으로 종료합니다.")
                    break
                    
                print("\n🤖 처리 중...")
                answer = get_gpt_response(user_input)
                print(f"\n📝 GPT 답변: {answer}")
                text_to_speech(answer)
                
    except KeyboardInterrupt:
        print("\n🛑 프로그램을 안전하게 종료합니다.")
    except Exception as e:
        print(f"\n❌ 치명적 오류 발생: {str(e)}")
        print(traceback.format_exc())

if __name__ == "__main__":
    main()
