import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Colors from '../Colors';

export default function ChatEndScreen({ bot, messageCount, duration, onEnd, onBack }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 중앙 컨텐츠 */}
      <View style={styles.content}>
        {/* 아이콘 */}
        <View style={styles.iconContainer}>
          <View style={styles.circle}>
            <Text style={styles.heartIcon}>♥</Text>
          </View>
        </View>

        {/* 메시지 */}
        <Text style={styles.title}>
          별들과의 대화를{'\n'}종료하시겠습니까?
        </Text>
        <Text style={styles.subtitle}>
          항상 같은 자리에서 기다리겠습니다
        </Text>

        {/* 대화 요약 */}
        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>대화 요약</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryIcon}>💬</Text>
            <Text style={styles.summaryLabel}>메시지 수</Text>
            <Text style={styles.summaryValue}>{messageCount || 0}개</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryIcon}>🕐</Text>
            <Text style={styles.summaryLabel}>대화 시간</Text>
            <Text style={styles.summaryValue}>{duration || '0분 0초'}</Text>
          </View>
        </View>
      </View>

      {/* 하단 버튼 */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.85}
        >
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.endButton}
          onPress={onEnd}
          activeOpacity={0.85}
        >
          <Text style={styles.endButtonText}>종료하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  heartIcon: {
    fontSize: 48,
    color: Colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 30,
  },
  summaryBox: {
    backgroundColor: Colors.lightGreen,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  summaryLabel: {
    flex: 1,
    fontSize: 14,
    color: Colors.white,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.white,
  },
  bottomButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  backButton: {
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
  backButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  endButton: {
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
  endButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});