# 🎙️ Welcare - Voice Memory AI

> 그리운 사람의 목소리로 다시 대화하는 AI 서비스

고인의 목소리를 AI로 복제하여 유족이 대화할 수 있는 모바일 애플리케이션입니다.

---

## 📋 목차
- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시작하기](#-시작하기)
- [사용 방법](#-사용-방법)
- [문제 해결](#-문제-해결)

---

## 🎯 프로젝트 소개

Welcare는 ElevenLabs의 음성 복제 기술과 OpenAI의 GPT를 활용하여 고인의 목소리로 대화할 수 있는 애플리케이션입니다. 

### 개발 배경
- 사랑하는 사람을 잃은 유족의 애도 과정 지원
- 자연스러운 대화를 통한 정서적 위로 제공
- AI 기술을 활용한 의미 있는 서비스 구현

---

## ✨ 주요 기능

### 1. 음성 녹음 (자동 중지)
- 녹음 버튼을 누르고 말하면 2초 침묵 후 자동 중지
- 수동 중지도 가능

### 2. STT (Speech-to-Text)
- Google Speech Recognition으로 한국어 음성 인식
- 실시간 텍스트 변환

### 3. AI 대화 생성
- OpenAI GPT-4o-mini 모델 사용
- 자연스럽고 따뜻한 대화 생성
- 고인의 말투와 톤을 반영한 프롬프트 설계

### 4. TTS (Text-to-Speech)
- ElevenLabs 음성 합성 API
- 복제된 목소리로 AI 응답 재생

---

## 🛠 기술 스택

### Backend
- **FastAPI** - Python 웹 프레임워크
- **OpenAI GPT-4o-mini** - 대화 생성
- **ElevenLabs** - 음성 합성 (TTS)
- **Google Speech Recognition** - 음성 인식 (STT)
- **pydub** - 오디오 파일 처리

### Frontend
- **Android (Kotlin)** - 네이티브 앱
- **OkHttp3** - HTTP 통신
- **MediaRecorder** - 음성 녹음
- **MediaPlayer** - 음성 재생
- **Material Design** - UI/UX

### Infrastructure
- **Uvicorn** - ASGI 서버
- **USB 테더링 / WiFi** - 로컬 네트워크 연결

---

## 🚀 시작하기

### 필요 사항
- Python 3.9 이상
- Android Studio (최신 버전)
- OpenAI API 키
- ElevenLabs API 키
- ElevenLabs Voice ID (음성 복제 필요)

### 1. 저장소 클론
```bash
git clone https://github.com/SeongWon1123/WelCare.git
cd WelCare
```

### 2. Python 서버 설정

#### 가상환경 생성 및 활성화
```bash
cd server
python -m venv .venv

# Windows
.\venv\Scripts\Activate.ps1

# Mac/Linux
source .venv/bin/activate
```

#### 패키지 설치
```bash
pip install fastapi uvicorn python-dotenv speechrecognition pydub openai elevenlabs
```

#### 환경 변수 설정
`server/.env` 파일 생성:
```
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
VOICE_ID=your_voice_id
```

**API 키 발급 방법:**
- OpenAI: https://platform.openai.com/api-keys
- ElevenLabs: https://elevenlabs.io/app/settings
- Voice ID: ElevenLabs에서 음성 복제 후 발급

#### 서버 실행
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

### 3. Android 앱 설정

#### Android Studio에서 프로젝트 열기
1. Android Studio 실행
2. `Open` → `welcare` 폴더 선택
3. Gradle Sync 대기

#### 서버 IP 설정
`app/src/main/java/com/example/welcare/MainActivity.kt` 파일에서:
```kotlin
private val SERVER_URL = "http://YOUR_COMPUTER_IP:8000"
```

**IP 확인 방법:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

#### USB 테더링 또는 WiFi 연결
- **USB 테더링**: 핸드폰 설정 → USB 테더링 켜기
- **WiFi**: 핸드폰과 컴퓨터를 같은 WiFi에 연결

#### 앱 실행
1. USB로 핸드폰 연결
2. USB 디버깅 허용
3. Android Studio에서 초록색 ▶️ 버튼 클릭

---

## 📱 사용 방법

### 1. 앱 실행
- 마이크 권한 허용

### 2. 대화 시작
1. **녹음 버튼(FAB)** 탭
2. 말하기
3. 2초 침묵 후 자동 중지 (또는 버튼 다시 눌러 수동 중지)

### 3. AI 응답
- 음성이 텍스트로 변환됨
- AI가 응답 생성
- 복제된 목소리로 재생

---

## 🔧 문제 해결

### 서버 연결 실패
**증상:** "서버 연결 실패" 토스트 메시지

**해결:**
1. 서버가 실행 중인지 확인
2. 방화벽 설정:
```bash
# Windows PowerShell (관리자 권한)
netsh advfirewall firewall add rule name="Python Server" dir=in action=allow protocol=TCP localport=8000
```
3. IP 주소가 올바른지 확인
4. 핸드폰과 컴퓨터가 같은 네트워크인지 확인

### 음성 인식 실패
**증상:** "음성 인식 실패" 메시지

**해결:**
1. 마이크 권한 확인
2. 주변 소음 줄이기
3. 명확하게 발음하기

### 답변 생성 실패
**증상:** "답변 생성 실패" 메시지

**해결:**
1. OpenAI API 키 확인
2. API 크레딧 잔액 확인
3. 서버 로그 확인:
```bash
# server 폴더에서 실행 중인 터미널 확인
```

### 음성 생성 실패
**증상:** "음성 생성 실패" 메시지

**해결:**
1. ElevenLabs API 키 확인
2. Voice ID 확인
3. ElevenLabs 할당량 확인

---

## 📂 프로젝트 구조
```
WelCare/
├── server/                 # Python 백엔드
│   ├── server.py          # FastAPI 서버
│   ├── .env               # 환경 변수 (gitignore)
│   └── requirements.txt   # Python 패키지
│
├── app/                    # Android 앱
│   ├── src/main/
│   │   ├── java/com/example/welcare/
│   │   │   └── MainActivity.kt
│   │   ├── res/layout/
│   │   │   └── activity_main.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
│
├── .gitignore
└── README.md
```

---

## ⚠️ 윤리적 고려사항

이 프로젝트는 매우 민감한 주제를 다루고 있습니다:

1. **명확한 안내**: 사용자에게 이것이 AI임을 명확히 알림
2. **전문가 연계**: 필요시 정신건강 전문가 상담 정보 제공
3. **건강한 애도**: 병적인 집착이 아닌 건강한 애도 과정 지원
4. **개인정보 보호**: 음성 데이터 보안 유지

---

## 📝 라이선스

이 프로젝트는 교육 목적으로 개발되었습니다.

---

## 👥 개발자

- **SeongWon** - [GitHub](https://github.com/SeongWon1123)

---

## 🙏 감사의 말

이 프로젝트는 순천향대학교 캡스톤 디자인 과제로 진행되었습니다.

---

## 📞 문의

프로젝트 관련 문의사항은 GitHub Issues를 이용해주세요.
