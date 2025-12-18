import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Colors from '../Colors';

export default function SetupScreen({ onCreate, onBack, onHome }) {
  const [showBasicInfo, setShowBasicInfo] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    birthDate: '',
    personality: '',
  });

  const handleCreate = () => {
    if (!formData.name || !formData.relation) {
      Alert.alert('알림', '이름과 관계는 필수 항목입니다.');
      return;
    }
    
    // 챗봇 생성
    onCreate(formData);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onHome}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>고인 설정</Text>
        <TouchableOpacity>
          <Text style={styles.navIcon}>➜</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, showBasicInfo && styles.tabActive]}
            onPress={() => setShowBasicInfo(true)}
          >
            <Text style={[styles.tabText, showBasicInfo && styles.tabTextActive]}>
              기본 정보
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, !showBasicInfo && styles.tabActive]}
            onPress={() => setShowBasicInfo(false)}
          >
            <Text style={[styles.tabText, !showBasicInfo && styles.tabTextActive]}>
              파일 등록
            </Text>
          </TouchableOpacity>
        </View>

        {showBasicInfo ? (
          // 기본 정보 입력
          <>
            <Text style={styles.sectionTitle}>이름 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="이름"
              placeholderTextColor="#B0B0B0"
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
            />

            <Text style={styles.sectionTitle}>관계 <Text style={styles.required}>*</Text></Text>
            <TextInput
              style={styles.input}
              placeholder="예: 할머니, 할아버지"
              placeholderTextColor="#B0B0B0"
              value={formData.relation}
              onChangeText={(text) => setFormData({...formData, relation: text})}
            />

            <Text style={styles.sectionTitle}>생년월일</Text>
            <TextInput
              style={styles.input}
              placeholder="YY.MM.DD"
              placeholderTextColor="#B0B0B0"
              value={formData.birthDate}
              onChangeText={(text) => setFormData({...formData, birthDate: text})}
            />

            <Text style={styles.sectionTitle}>성격 및 특징</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="고인의 성격, 말투, 특징 등을 자유롭게 적어주세요"
              placeholderTextColor="#B0B0B0"
              multiline
              numberOfLines={4}
              value={formData.personality}
              onChangeText={(text) => setFormData({...formData, personality: text})}
            />
          </>
        ) : (
          // 파일 등록
          <>
            <Text style={styles.sectionTitle}>음성등록</Text>
            <TouchableOpacity style={styles.uploadBox}>
              <Text style={styles.uploadIcon}>🎤</Text>
              <Text style={styles.uploadText}>음성 파일을 업로드하세요</Text>
              <Text style={styles.uploadHint}>MP3, WAV, M4A (최대 10MB)</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>사진등록</Text>
            <TouchableOpacity style={styles.uploadBox}>
              <Text style={styles.uploadIcon}>🖼️</Text>
              <Text style={styles.uploadText}>사진을 업로드하세요</Text>
              <Text style={styles.uploadHint}>JPG, PNG (최대 5MB, 여러 장 가능)</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>영상 등록</Text>
            <TouchableOpacity style={styles.uploadBox}>
              <Text style={styles.uploadIcon}>🎥</Text>
              <Text style={styles.uploadText}>영상을 업로드하세요</Text>
              <Text style={styles.uploadHint}>MP4, MOV (최대 50MB)</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.prevButton}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.prevButtonText}>이전</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleCreate}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>생성</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  navIcon: {
    fontSize: 28,
    color: Colors.darkGreen,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkGreen,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBg,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.lightGreen,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  tabTextActive: {
    color: Colors.white,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 12,
    marginTop: 10,
  },
  required: {
    color: Colors.red,
  },
  input: {
    backgroundColor: Colors.inputBg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.darkGreen,
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadBox: {
    backgroundColor: Colors.inputBg,
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
    opacity: 0.5,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 6,
  },
  uploadHint: {
    fontSize: 12,
    color: Colors.gray,
    opacity: 0.7,
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  prevButton: {
    flex: 1,
    backgroundColor: Colors.darkGreen,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  prevButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 1,
    backgroundColor: Colors.lightGreen,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: Colors.lightGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  nextButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});