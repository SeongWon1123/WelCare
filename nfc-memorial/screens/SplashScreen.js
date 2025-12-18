// screens/SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Colors from '../Colors';

export default function SplashScreen({ onLogin, onFeatures }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 800,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* 상단 장식 별들 (PDF 상단 여백 + 아이콘 느낌) */}
      <View style={styles.starsContainer}>
        <Animated.Text
          style={[
            styles.starTop,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: '15deg' },
              ],
            },
          ]}
        >
          ⭐
        </Animated.Text>
        <Animated.Text
          style={[
            styles.starSmall,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          ✨
        </Animated.Text>
      </View>

      {/* 중앙 로고 영역 */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.circle}>
          <Text style={styles.mainStar}>✦</Text>
        </View>

        <View className={styles.starBottomLeft}>
          <Text style={styles.starEmoji}>⭐</Text>
        </View>

        <View style={styles.starTopRight}>
          <Text style={styles.starEmoji}>⭐</Text>
        </View>
      </Animated.View>

      {/* 메인 텍스트 (PDF 텍스트 그대로) */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.title}>어서오십시오,</Text>
        <Text style={styles.subtitle}>
          사랑하는 사람과의{'\n'}대화를 다시 시작하세요
        </Text>
        <Text style={styles.description}>
          소중한 분의 목소리와 추억을 담은{'\n'}
          AI 챗봇으로 정서적 위안을 받으세요
        </Text>
      </Animated.View>

      {/* 버튼들 – 텍스트와 순서 PDF랑 동일 */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonFadeAnim,
            transform: [
              {
                translateY: buttonFadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        {/* "로그인 및 회원가입" → 로그인 화면으로 */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={onLogin}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>로그인 및 회원가입</Text>
        </TouchableOpacity>

        {/* "주요 기능 안내" → 일단 채팅 화면으로 연결 */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={onFeatures}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>주요 기능 안내</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 30,
    paddingVertical: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsContainer: {
    width: '100%',
    height: 60,
    position: 'relative',
  },
  starTop: {
    position: 'absolute',
    top: 0,
    right: 80,
    fontSize: 24,
  },
  starSmall: {
    position: 'absolute',
    top: 20,
    right: 50,
    fontSize: 16,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    position: 'relative',
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  mainStar: {
    fontSize: 64,
    color: Colors.white,
  },
  starBottomLeft: {
    position: 'absolute',
    bottom: -5,
    left: -10,
  },
  starTopRight: {
    position: 'absolute',
    top: -5,
    right: -10,
  },
  starEmoji: {
    fontSize: 28,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.darkGreen,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 20,
  },
  primaryButton: {
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
  primaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
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
  secondaryButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
