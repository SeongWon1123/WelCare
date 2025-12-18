import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import Colors from '../Colors';

export default function WelcomeScreen({ onStart }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonFadeAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 중앙 컨텐츠 */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* 장식 별들 */}
        <View style={styles.starsTop}>
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={[styles.starEmoji, styles.starSmall]}>✨</Text>
        </View>

        {/* 메인 원 */}
        <View style={styles.circle}>
          <Text style={styles.mainStar}>✦</Text>
        </View>

        {/* 텍스트 */}
        <Text style={styles.title}>환영합니다,{'\n'}최성원님!</Text>
        <Text style={styles.subtitle}>회원가입이 완료되었습니다</Text>

        <Text style={styles.description}>
          이제 하늘의 별들과{'\n'}대화를 시작하세요
        </Text>
      </Animated.View>

      {/* 버튼 */}
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
        <TouchableOpacity
          style={styles.startButton}
          onPress={onStart}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>대화 시작하기</Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  starsTop: {
    position: 'absolute',
    top: -100,
    right: 20,
    flexDirection: 'row',
    gap: 15,
  },
  starEmoji: {
    fontSize: 28,
  },
  starSmall: {
    fontSize: 20,
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.darkGreen,
    marginBottom: 30,
    textAlign: 'center',
  },
  description: {
    fontSize: 18,
    color: Colors.darkGreen,
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 20,
  },
  startButton: {
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
  startButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});