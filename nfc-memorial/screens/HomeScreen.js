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

export default function HomeScreen({ bots = [], onChatStart, onCreateBot }) {
  const hasBots = bots && bots.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.userName}>최성원님</Text>
      </View>

      {/* 컨텐츠 */}
      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {hasBots ? (
          // 챗봇이 있을 때
          <>
            {bots.map((bot, index) => (
              <TouchableOpacity 
                key={bot.id || index}
                style={styles.botCard}
                onPress={() => onChatStart(bot)}
                activeOpacity={0.8}
              >
                <View style={styles.botAvatar}>
                  <Text style={styles.botEmoji}>{bot.emoji || '😊'}</Text>
                </View>
                <View style={styles.botInfo}>
                  <Text style={styles.botName}>{bot.name || '소중한 분'}</Text>
                  <Text style={styles.botLastChat}>
                    마지막 대화: {bot.lastChat || '방금 전'}
                  </Text>
                </View>
                <Text style={styles.botArrow}>→</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={styles.createButton}
              onPress={onCreateBot}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>+ 챗봇 만들기</Text>
            </TouchableOpacity>
          </>
        ) : (
          // 챗봇이 없을 때
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💭</Text>
            <Text style={styles.emptyTitle}>챗봇이 없습니다</Text>
            <Text style={styles.emptySubtitle}>첫 챗봇을 만들어보세요</Text>

            <TouchableOpacity 
              style={styles.createButtonLarge}
              onPress={onCreateBot}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>+ 챗봇 만들기</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 이용 안내 */}
        <View style={styles.guideContainer}>
          <Text style={styles.guideTitle}>이용 안내</Text>
          
          <View style={styles.guideStep}>
            <View style={styles.guideNumber}>
              <Text style={styles.guideNumberText}>1</Text>
            </View>
            <Text style={styles.guideText}>챗봇 만들기를 누르세요</Text>
          </View>

          <View style={styles.guideArrow}>
            <Text style={styles.guideArrowText}>↓</Text>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.guideNumber}>
              <Text style={styles.guideNumberText}>2</Text>
            </View>
            <Text style={styles.guideText}>고인의 정보를 입력하세요</Text>
          </View>

          <View style={styles.guideArrow}>
            <Text style={styles.guideArrowText}>↓</Text>
          </View>

          <View style={styles.guideStep}>
            <View style={styles.guideNumber}>
              <Text style={styles.guideNumberText}>3</Text>
            </View>
            <Text style={styles.guideText}>생성된 챗봇과 대화하세요</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  userName: {
    fontSize: 24,
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
  botCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  botAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.inputBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  botEmoji: {
    fontSize: 32,
  },
  botInfo: {
    flex: 1,
  },
  botName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 4,
  },
  botLastChat: {
    fontSize: 13,
    color: Colors.gray,
  },
  botArrow: {
    fontSize: 24,
    color: Colors.gray,
  },
  createButton: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonLarge: {
    backgroundColor: Colors.darkGreen,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.gray,
  },
  guideContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginTop: 10,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkGreen,
    marginBottom: 20,
  },
  guideStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  guideNumberText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  guideText: {
    fontSize: 14,
    color: Colors.darkGreen,
    flex: 1,
  },
  guideArrow: {
    paddingLeft: 14,
    paddingVertical: 8,
  },
  guideArrowText: {
    fontSize: 20,
    color: Colors.lightGreen,
  },
});