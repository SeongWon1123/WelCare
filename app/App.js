import React, { useState } from "react";
import { View, Button, Text, Platform } from "react-native";
import { Audio } from "expo-av";

const SERVER = "http://10.0.2.2:8000"; // 에뮬레이터에서 PC 서버 접속

export default function App() {
  const [recording, setRecording] = useState(null);
  const [recognized, setRecognized] = useState("");
  const [answer, setAnswer] = useState("");

  async function startRecording() {
    await Audio.requestPermissionsAsync();
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    setRecording(recording);
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    // 1) STT 호출
    const form = new FormData();
    form.append("file", {
      uri,
      type: Platform.OS === "android" ? "audio/mp4" : "audio/m4a",
      name: "voice.m4a",
    });
    const sttRes = await fetch(`${SERVER}/stt`, { method: "POST", body: form });
    const sttData = await sttRes.json();
    setRecognized(sttData.text);

    // 2) Chat 호출
    const chatForm = new FormData();
    chatForm.append("prompt", sttData.text);
    const chatRes = await fetch(`${SERVER}/chat`, { method: "POST", body: chatForm });
    const chatData = await chatRes.json();
    setAnswer(chatData.answer);

    // 3) TTS 호출 (더미 서버라 소리 안 나옴)
    const ttsForm = new FormData();
    ttsForm.append("text", chatData.answer);
    await fetch(`${SERVER}/tts`, { method: "POST", body: ttsForm });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title={recording ? "녹음 끝내기" : "녹음 시작"}
        onPress={recording ? stopRecording : startRecording}
      />
      <Text style={{ marginTop: 20 }}>STT 결과: {recognized}</Text>
      <Text>GPT 답변: {answer}</Text>
    </View>
  );
}
