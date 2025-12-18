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

export default function Consent2Screen({ onNext, onBack, onHome }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onHome}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>민감정보 수집 · 이용 동의</Text>
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
          개인정보 보호법 제230에 따라 민감정보를{'\n'}
          수집 및 이용하고자 합니다.
        </Text>

        {/* 동의서 박스 */}
        <View style={styles.consentBox}>
          <View style={styles.bulletSection}>
            <Text style={styles.bulletText}>
              • 본 동의서는 개인정보 보호법 제23조에 따라 민감정보를 수집,이용하고자 합니다. 내용을 자세히 읽으신 후 동의 여부를 결정하여 주십시오
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.bulletSection}>
            <Text style={styles.bulletText}>
              • 다음 민감정보 수집 · 이용에 대한 동의를 거부할 권리가 있습니다. 그러나 동의를 거부할 경우 고인과의 대화 애플리케이션 이용에 제한에 제한을 받을 수 있습니다.
            </Text>
          </View>
        </View>

        {/* "민감정보 동의서 자세히 보기" 버튼 */}
        <TouchableOpacity style={styles.detailButton}>
          <Text style={styles.detailButtonText}>민감정보 동의서</Text>
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
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
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