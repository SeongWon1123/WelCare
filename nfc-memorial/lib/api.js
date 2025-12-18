// lib/api.js
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";

// ✅ 환경에 맞게 하나만 주석 해제하세요!
// iOS 시뮬레이터
// export const BASE_URL = "http://127.0.0.1:8000";
// Android 에뮬레이터
export const BASE_URL = "http://10.0.2.2:8000";
// 실기기 (같은 Wi-Fi or USB 테더링)
// export const BASE_URL = "http://192.168.x.x:8000"; // ← 노트북 IP로 바꾸기

/** 🎙️ /stt : 녹음 파일을 서버에 보내서 텍스트로 변환 */
export async function sttFromUri(uri) {
  const form = new FormData();
  form.append("file", {
    uri,
    name: `rec_${Date.now()}.m4a`,
    type: "audio/m4a",
  });

  const res = await fetch(`${BASE_URL}/stt`, {
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
    body: form,
  });

  if (!res.ok) throw new Error(`/stt ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.text;
}

/** 💬 /chat : 텍스트를 서버에 보내서 대화 답변을 받기 */
export async function chat(prompt) {
  const body = new URLSearchParams({ prompt }).toString();
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!res.ok) throw new Error(`/chat ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.answer;
}

/** 🔊 /tts : 텍스트를 음성으로 변환하고 재생 */
export async function tts(text) {
  const body = new URLSearchParams({ text }).toString();

  const download = FileSystem.createDownloadResumable(
    `${BASE_URL}/tts`,
    FileSystem.cacheDirectory + `tts_${Date.now()}.mp3`,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body,
    }
  );

  const { uri } = await download.downloadAsync();
  if (!uri) throw new Error("TTS 다운로드 실패");

  const { sound } = await Audio.Sound.createAsync({ uri });
  await sound.playAsync();
  return { uri, sound };
}
