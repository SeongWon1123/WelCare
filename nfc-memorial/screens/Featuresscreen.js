import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import Colors from '../Colors';

export default function FeaturesScreen({ onBack }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>주요 기능 안내</Text>
        <TouchableOpacity>
          <Text style={styles.navIcon}>➜</Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 기능 1: 목소리 재현 */}
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.iconEmoji}>〰️</Text>
          </View>
          <Text style={styles.featureTitle}>목소리 재현</Text>
          <Text style={styles.featureDesc}>
            재현된 고인의 목소리를 담은{'\n'}챗봇과 대화 가능
          </Text>
        </View>

        {/* 기능 2: 개인화 */}
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.iconEmoji}>♥</Text>
          </View>
          <Text style={styles.featureTitle}>개인화</Text>
          <Text style={styles.featureDesc}>맞춤형 대화 가능</Text>
        </View>

        {/* 기능 3: 기념일 */}
        <View style={styles.featureCard}>
          <View style={styles.featureIcon}>
            <Text style={styles.iconEmoji}>🕐</Text>
          </View>
          <Text style={styles.featureTitle}>기념일</Text>
          <Text style={styles.featureDesc}>특별한 날 알림 기능</Text>
        </View>

        {/* 돌아가기 버튼 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  featureCard: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  featureIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.darkGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconEmoji: {
    fontSize: 28,
    color: Colors.white,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  featureDesc: {
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});