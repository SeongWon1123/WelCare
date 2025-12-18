import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
// ⚠️ expo-av는 곧 deprecated 예정이지만, 지금은 동작함 (추후 expo-audio로 마이그레이션 권장)
import { Audio } from "expo-av";
// 파일 저장은 legacy API로 사용 (경고 회피 및 호환성)
import * as FileSystem from "expo-file-system/legacy";
// arrayBuffer → base64 변환용
import { Buffer } from "buffer";
import Colors from './constants/Colors';

// ⚠️ 폰에서 접근 가능한 서버 주소로 바꾸세요.
//  - Android 에뮬레이터: http://10.0.2.2:8000
//  - iOS 시뮬레이터  : http://127.0.0.1:8000
//  - 실기기/테더링   : http://<PC IP>:8000  또는 ngrok 주소
const SERVER_URL = "http://10.54.32.7:8000";

export default function App() {
  const [status, setStatus] = useState("대화를 시작해 보세요");
  const [conversation, setConversation] = useState("");
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  // ─────────────────────────────────────────────
  // 녹음 시작
  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== "granted") {
        Alert.alert("권한 필요", "마이크 권한을 허용해주세요.");
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      setStatus("🎤 말씀하세요...");
    } catch (e) {
      console.error("startRecording error:", e);
      Alert.alert("오류", "녹음을 시작할 수 없습니다.");
    }
  };

  // 녹음 중지
  const stopRecording = async () => {
    try {
      if (!recording) return;
      setIsRecording(false);
      setStatus("처리 중...");

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      await processAudio(uri);
    } catch (e) {
      console.error("stopRecording error:", e);
      Alert.alert("오류", "녹음을 종료할 수 없습니다.");
      setStatus("오류 발생. 다시 시도하세요.");
    }
  };

  // ─────────────────────────────────────────────
  // 유틸: 작은/에러 응답 가드 (서버에서 JSON 에러 내려오는 경우 대비)
  const ensureAudioArrayBuffer = (buf) => {
    if (!buf || buf.byteLength < 1024) {
      try {
        const tinyText = new TextDecoder().decode(buf || new ArrayBuffer(0));
        console.log("TTS tiny body:", tinyText.slice(0, 400));
        if (tinyText.trim().startsWith("{")) {
          throw new Error("TTS API 에러: " + tinyText);
        }
      } catch {
        // 디코드 실패 시에도 작은 파일은 재생 불가 → 에러
      }
      throw new Error("TTS 파일이 비정상(너무 작음)");
    }
  };

  // ─────────────────────────────────────────────
  // STT → CHAT → TTS
  const processAudio = async (uri) => {
    try {
      // 1) STT (multipart/form-data)
      const form = new FormData();
      form.append("file", {
        uri,
        name: `recording_${Date.now()}.m4a`,
        type: "audio/m4a",
      });

      console.log("POST /stt …");
      const sttRes = await fetch(`${SERVER_URL}/stt`, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: form,
      });
      if (!sttRes.ok) {
        const t = await sttRes.text();
        throw new Error(`/stt ${sttRes.status}: ${t}`);
      }
      const sttJson = await sttRes.json();
      const userText = sttJson?.text || "";
      console.log("STT text:", userText);
      if (!userText) throw new Error("STT 결과가 비어 있습니다.");

      setConversation(`👤 나: ${userText}\n\n`);
      setStatus("엄마가 생각 중...");

      // 2) CHAT (x-www-form-urlencoded)
      const chatBody = new URLSearchParams({ prompt: userText }).toString();
      console.log("POST /chat …");
      const chatRes = await fetch(`${SERVER_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: chatBody,
      });
      if (!chatRes.ok) {
        const t = await chatRes.text();
        throw new Error(`/chat ${chatRes.status}: ${t}`);
      }
      const chatJson = await chatRes.json();
      const motherResponse = chatJson?.answer || "";
      console.log("CHAT resp:", motherResponse);
      if (!motherResponse) throw new Error("/chat 응답이 비어 있습니다.");

      setConversation((prev) => prev + `👩 어머니: ${motherResponse}\n\n`);
      setStatus("음성 변환 중...");

      // 3) TTS (fetch POST → arrayBuffer → base64 → 파일 저장 → 재생)
      const ttsBody = new URLSearchParams({ text: motherResponse }).toString();
      console.log("POST /tts …");

      const ttsRes = await fetch(`${SERVER_URL}/tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "audio/mpeg",
        },
        body: ttsBody,
      });
      if (!ttsRes.ok) {
        const t = await ttsRes.text();
        throw new Error(`/tts ${ttsRes.status}: ${t}`);
      }

      const arrayBuf = await ttsRes.arrayBuffer();
      ensureAudioArrayBuffer(arrayBuf);

      const base64 = Buffer.from(new Uint8Array(arrayBuf)).toString("base64");
      const mp3Path = FileSystem.cacheDirectory + `resp_${Date.now()}.mp3`;
      await FileSystem.writeAsStringAsync(mp3Path, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: mp3Path });
      await sound.playAsync();
      setStatus("대화를 시작해 보세요");

      sound.setOnPlaybackStatusUpdate((s) => {
        if (s.didJustFinish) sound.unloadAsync().catch(() => {});
      });
    } catch (error) {
      console.error("processAudio error:", error);
      Alert.alert("오류", String(error?.message || error));
      setStatus("오류 발생. 다시 시도하세요.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Status bar at the top */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* Large record button */}
      <TouchableOpacity
        style={[styles.recordButton, isRecording && styles.recordingButton]}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonEmoji}>
          {isRecording ? '⏹️' : '🎤'}
        </Text>
        <Text style={styles.buttonText}>
          {isRecording ? '녹음 중지' : '녹음 시작'}
        </Text>
      </TouchableOpacity>

      {/* Conversation box */}
      <View style={styles.conversationBox}>
        <Text style={styles.conversationText}>
          {conversation || '대화 내용이 여기에 표시됩니다.'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  // Meta and status are no longer used directly; replaced by statusBar and statusText
  statusBar: {
    width: '100%',
    backgroundColor: Colors.inputBg,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    color: Colors.darkGreen,
    fontWeight: '500',
  },
  recordButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.darkGreen,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 20,
  },
  recordingButton: {
    backgroundColor: Colors.red,
  },
  buttonEmoji: {
    fontSize: 48,
    marginBottom: 6,
    color: Colors.white,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  conversationBox: {
    width: '100%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 20,
    borderColor: Colors.inputBg,
    borderWidth: 1,
    minHeight: 160,
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  conversationText: {
    fontSize: 16,
    color: Colors.gray,
    lineHeight: 24,
  },
});
