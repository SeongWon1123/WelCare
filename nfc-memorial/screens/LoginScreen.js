import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../Colors';

export default function LoginScreen({ onNext, onHome, onSignup }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* 상단 네비게이션 */}
      <View style={styles.topNav}>
        <TouchableOpacity onPress={onHome}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>로그인</Text>
        <TouchableOpacity>
          <Text style={styles.navIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      {/* 카드 */}
      <View style={styles.card}>
        {/* 탭 */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, styles.tabActive]}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, styles.tabTextActive]}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={onSignup}
            activeOpacity={0.8}
          >
            <Text style={styles.tabText}>회원가입</Text>
          </TouchableOpacity>
        </View>

        {/* 폼 */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>아이디</Text>
            <TextInput
              style={styles.input}
              placeholder="아이디"
              placeholderTextColor="#B0B0B0"
              autoCapitalize="none"
              value={userId}
              onChangeText={setUserId}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              placeholderTextColor="#B0B0B0"
              secureTextEntry
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={onNext}
            activeOpacity={0.85}
          >
            <Text style={styles.loginButtonText}>로그인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  navIcon: {
    fontSize: 24,
    color: Colors.darkGreen,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.darkGreen,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.inputBg,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: Colors.darkGreen,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.darkGreen,
  },
  tabTextActive: {
    color: Colors.white,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: Colors.darkGreen,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.inputBg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: Colors.darkGreen,
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: Colors.darkGreen,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.darkGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});