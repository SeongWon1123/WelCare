import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system/legacy';
import { Buffer } from 'buffer';
import Colors from '../Colors';

const SERVER_URL = "http://10.242.255.182:8000";

export default function ChatScreen({ bot, onBack, onShowEndModal }) {
  const [status, setStatus] = useState('대화를 시작해 보세요');
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [chatStartTime] = useState(Date.now()); // 대화 시작 시간
  const [messages, setMessages] = useState([]);

  // 대화 시간 계산
  const calculateDuration = () => {
    const durationMs = Date.now() - chatStartTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}분 ${seconds}초`;
  };

  // 녹음 시작
  const startRecording = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('권한 필요', '마이크 권한을 허용해주세요.');
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
      setStatus('🎤 말씀하세요...');
    } catch (e) {
      console.error('startRecording error:', e);
      Alert.alert('오류', '녹음을 시작할 수 없습니다.');
    }
  };

  // 녹음 중지
  const stopRecording = async () => {
    try {
      if (!recording) return;
      setIsRecording(false);
      setStatus('처리 중...');

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      await processAudio(uri);
    } catch (e) {
      console.error('stopRecording error:', e);
      Alert.alert('오류', '녹음을 종료할 수 없습니다.');
      setStatus('오류 발생. 다시 시도하세요.');
    }
  };

  // 오디오 검증
  const ensureAudioArrayBuffer = (buf) => {
    if (!buf || buf.byteLength < 1024) {
      try {
        const tinyText = new TextDecoder().decode(buf || new ArrayBuffer(0));
        console.log('TTS tiny body:', tinyText.slice(0, 400));
        if (tinyText.trim().startsWith('{')) {
          throw new Error('TTS API 에러: ' + tinyText);
        }
      } catch {}
      throw new Error('TTS 파일이 비정상(너무 작음)');
    }
  };

  // STT → CHAT → TTS
  const processAudio = async (uri) => {
    try {
      // 1) STT
      const form = new FormData();
      form.append('file', {
        uri,
        name: `recording_${Date.now()}.m4a`,
        type: 'audio/m4a',
      });

      console.log('POST /stt …');
      const sttRes = await fetch(`${SERVER_URL}/stt`, {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: form,
      });
      if (!sttRes.ok) {
        const t = await sttRes.text();
        throw new Error(`/stt ${sttRes.status}: ${t}`);
      }
      const sttJson = await sttRes.json();
      const userText = sttJson?.text || '';
      console.log('STT text:', userText);
      if (!userText) throw new Error('STT 결과가 비어 있습니다.');

      // 사용자 메시지 추가
      setMessages((prev) => [
        ...prev,
        { type: 'user', text: userText },
      ]);
      setStatus(`${bot?.name || '엄마'}가 생각 중...`);

      // 2) CHAT
      const chatBody = new URLSearchParams({ prompt: userText }).toString();
      console.log('POST /chat …');
      const chatRes = await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: chatBody,
      });
      if (!chatRes.ok) {
        const t = await chatRes.text();
        throw new Error(`/chat ${chatRes.status}: ${t}`);
      }
      const chatJson = await chatRes.json();
      const motherResponse = chatJson?.answer || '';
      console.log('CHAT resp:', motherResponse);
      if (!motherResponse) throw new Error('/chat 응답이 비어 있습니다.');

      // AI 메시지 추가
      setMessages((prev) => [
        ...prev,
        { type: 'ai', text: motherResponse, emoji: bot?.emoji || '😊' },
      ]);
      setStatus('음성 변환 중...');

      // 3) TTS
      const ttsBody = new URLSearchParams({ text: motherResponse }).toString();
      console.log('POST /tts …');

      const ttsRes = await fetch(`${SERVER_URL}/tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'audio/mpeg',
        },
        body: ttsBody,
      });
      if (!ttsRes.ok) {
        const t = await ttsRes.text();
        throw new Error(`/tts ${ttsRes.status}: ${t}`);
      }

      const arrayBuf = await ttsRes.arrayBuffer();
      ensureAudioArrayBuffer(arrayBuf);

      const base64 = Buffer.from(new Uint8Array(arrayBuf)).toString('base64');
      const mp3Path = FileSystem.cacheDirectory + `resp_${Date.now()}.mp3`;
      await FileSystem.writeAsStringAsync(mp3Path, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const { sound } = await Audio.Sound.createAsync({ uri: mp3Path });
      await sound.playAsync();
      setStatus('재생 중...');

      sound.setOnPlaybackStatusUpdate((s) => {
        if (s.didJustFinish) {
          sound.unloadAsync().catch(() => {});
          setStatus('대화를 시작해 보세요');
        }
      });
    } catch (error) {
      console.error('processAudio error:', error);
      Alert.alert('오류', String(error?.message || error));
      setStatus('오류 발생. 다시 시도하세요.');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.darkGreen} />

      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Text style={styles.menuButton}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 드롭다운 */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMenu(false);
              if (onShowEndModal) {
                // 실제 메시지 수와 대화 시간 전달
                const userMessages = messages.filter(m => m.type === 'user').length;
                const duration = calculateDuration();
                onShowEndModal(userMessages, duration);
              }
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.menuItemText}>대화 종료</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 상태 표시 */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>{status}</Text>
      </View>

      {/* 대화 영역 */}
      <ScrollView style={styles.messagesArea}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageRow}>
            {msg.type === 'ai' && (
              <>
                <View style={styles.avatar}>
                  <Text style={styles.avatarEmoji}>{msg.emoji || '😊'}</Text>
                </View>
                <View style={styles.bubble}>
                  <Text style={styles.bubbleText}>{msg.text}</Text>
                </View>
              </>
            )}

            {msg.type === 'user' && (
              <View style={styles.userBubble}>
                <Text style={styles.userBubbleText}>{msg.text}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* 입력 영역 */}
      <View style={styles.inputArea}>
        <TouchableOpacity
          style={[styles.micButton, isRecording && styles.micButtonActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Text style={styles.micIcon}>{isRecording ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor={Colors.gray}
        />

        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.helpText}>
        음성으로 말하거나 텍스트로 입력할 수 있습니다
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.darkGreen,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  backButton: {
    fontSize: 30,
    color: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
  },
  menuButton: {
    fontSize: 30,
    color: Colors.white,
  },
  menuDropdown: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: Colors.white,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  menuItemText: {
    fontSize: 16,
    color: Colors.red,
    fontWeight: '600',
  },
  statusBar: {
    backgroundColor: Colors.inputBg,
    paddingVertical: 10,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: Colors.darkGreen,
    fontWeight: '500',
  },
  messagesArea: {
    flex: 1,
    padding: 20,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarEmoji: {
    fontSize: 30,
  },
  bubble: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 15,
    borderRadius: 15,
    borderTopLeftRadius: 0,
  },
  bubbleText: {
    fontSize: 16,
    color: Colors.darkGreen,
    lineHeight: 24,
  },
  userBubble: {
    flex: 1,
    backgroundColor: Colors.darkGreen,
    padding: 15,
    borderRadius: 15,
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
  },
  userBubbleText: {
    fontSize: 16,
    color: Colors.white,
    lineHeight: 24,
  },
  inputArea: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  micButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  micButtonActive: {
    backgroundColor: Colors.red,
  },
  micIcon: {
    fontSize: 24,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.inputBg,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    fontSize: 16,
    color: Colors.darkGreen,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendIcon: {
    fontSize: 24,
    color: Colors.white,
  },
  helpText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.gray,
    paddingBottom: 10,
  },
});