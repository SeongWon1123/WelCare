import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import Colors from '../Colors';

export default function Consent1Screen({ onNext, onBack, onHome }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onHome}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>개인정보 수집 및 이용 동의</Text>
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
        {/* 안내 문구 (PDF 상단 텍스트 그대로) */}
        <Text style={styles.introText}>
          앱 사용을 위해 개인정보 수집 및 이용에{'\n'}
          동의해 주세요.
        </Text>

        {/* 동의서 박스 */}
        <View style={styles.consentBox}>
          <View style={styles.bulletSection}>
            <Text style={styles.bulletText}>
              • 본 동의서는 고인의 음성과 대화 기록을 활용하여 인공지능 기반  이용자 맞춤형 애플리케이션 서비스를 제공하는과정에서 발생할 수 있는 개인정보의 수집과 이용, 제3자 제공과 위탁 및 보호 절차를 안내, 이에 대한 동의를 얻기 위한 동의서입니다.
            </Text>
          </View>

          <View style={styles.bulletSection}>
            <Text style={styles.bulletText}>
              • 개인정보 보호법 제15조, 제22조에 따라 다음과 같이 개인정보를 수집ㆍ이용하고자 합니다. 내용을 자세히 읽으신 후 동의 여부를 결정하여 주십시오.
            </Text>
          </View>

          <View style={styles.bulletSection}>
            <Text style={styles.bulletText}>
              ※ 개인정보 및 상담 내용의 비밀은 엄격히 보장(대상자의 동의 없이 타인이나 외부로 정보나 기록이 공개되지 않습니다). 다만 연구 및 성과 관리 목적으로 익명화된 정보는 활용·공개될 수 있습니다.
            </Text>
          </View>
        </View>

        {/* "개인정보 동의서 자세히 보기" 버튼 – 텍스트를 PDF와 동일하게 */}
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>개인정보 동의서 자세히 보기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* 하단 버튼 – "이전 / 다음" */}
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
          onPress={onNext}
          activeOpacity={0.85}
        >
          <Text style={styles.nextButtonText}>다음</Text>
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
  bulletSection: {
    marginBottom: 16,
  },
  bulletText: {
    fontSize: 13,
    color: Colors.darkGreen,
    lineHeight: 22,
  },
  detailButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 10,
  },
  detailButtonText: {
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
