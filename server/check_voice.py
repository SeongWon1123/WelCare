from dotenv import load_dotenv
load_dotenv()  # 현재 폴더의 .env를 읽음

import os
from elevenlabs import ElevenLabs

api_key = os.environ.get("ELEVENLABS_API_KEY")
print("ELEVENLABS_API_KEY starts with:", (api_key or "")[:7], "..." if api_key else "(MISSING)")

client = ElevenLabs(api_key=api_key)
voices = client.voices.get_all()

print("\n=== Voices visible to THIS API key ===")
for v in voices.voices:
    print(f"- {v.name:<20} | {v.voice_id}")
