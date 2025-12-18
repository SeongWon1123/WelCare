import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Colors from '../Colors';

export default function Consent3Screen({ onComplete, onBack, onHome }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onHome}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인정보 제3자 제공 및 위탁 동의</Text>
        <TouchableOpacity>
          <Text style={styles.navIcon}>➜</Text>
        </TouchableOpacity>
      </View>

      {/* 스크롤 영역 */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 안내 문구 */}
        <Text style={styles.introText}>
          개인정보 보호법 제17에 따라 개인정보를{'\n'}
          제3자에게 제공하고자 합니다.
        </Text>

        {/* 동의서 박스 */}
        <View style={styles.consentBox}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>• 제공받는 자</Text>
            <Text style={styles.sectionContent}>
              - 국립순천대학교 SW중심대학사업단, 디지털웰케어학과, ElevenLabs, Whisper
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>• 제공하는 항목</Text>
            <Text style={styles.sectionContent}>
              - (필수항목) 성명, 연락처, 음성 원본, 대화 내용{'\n'}
              - (선택항목) 고인의 성명 및 생년월일
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>• 제공 목적</Text>
            <Text style={styles.sectionContent}>
              - NFC 키링 제작 , 맞춤형 서비스 제공{'\n'}
              - 프로젝트 연구·평가 및 결과 관리{'\n'}
              - 기술 및 서비스 개선
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>• 보유ㆍ이용기간</Text>
            <Text style={styles.sectionContent}>
              -  서비스 이용 기간 동안 보유·이용, 앱 삭제ㆍ탈퇴시 모든 정보 파기
            </Text>
          </View>
        </View>

        {/* 체크박스 */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
            {agreed && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <Text style={styles.checkboxText}>개인정보의 수집 · 이용에 동의하십니까?</Text>
        </TouchableOpacity>

        {/* "정보 제3자 제공 및 위탁 동의서 자세히 보기" 버튼 */}
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>정보 제3자 제공 및 위탁 동의서</Text>
          <Text style={styles.detailArrow}>  자세히 보기  ︿</Text>
        </TouchableOpacity>
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
          onPress={onComplete}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>완료</Text>
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
  introText: {
    fontSize: 15,
    color: Colors.darkGreen,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: '500',
  },
  consentBox: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    color: Colors.darkGreen,
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionContent: {
    fontSize: 13,
    color: Colors.darkGreen,
    lineHeight: 22,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.darkGreen,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.darkGreen,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: Colors.darkGreen,
    flex: 1,
  },
  detailButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  detailButtonText: {
    fontSize: 14,
    color: Colors.darkGreen,
    fontWeight: '500',
  },
  detailArrow: {
    fontSize: 14,
    color: Colors.darkGreen,
    fontWeight: '500',
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