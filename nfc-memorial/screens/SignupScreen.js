import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Colors from '../Colors';

export default function SignupScreen({ onNext, onHome, onLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    idNumber: '',
    address: '',
    userId: '',
    password: '',
  });

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
        <Text style={styles.headerTitle}>회원가입</Text>
        <TouchableOpacity>
          <Text style={styles.navIcon}>➜</Text>
        </TouchableOpacity>
      </View>

      {/* 카드 - 스크롤 가능 */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* 탭 - 카드 안에 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={onLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.tabText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, styles.tabActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, styles.tabTextActive]}>회원가입</Text>
            </TouchableOpacity>
          </View>

          {/* 폼 */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름"
                placeholderTextColor="#B0B0B0"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>연락처</Text>
              <TextInput
                style={styles.input}
                placeholder="핸드폰 번호"
                placeholderTextColor="#B0B0B0"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData({...formData, phone: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>주민등록번호</Text>
              <TextInput
                style={styles.input}
                placeholder="주민등록번호"
                placeholderTextColor="#B0B0B0"
                keyboardType="number-pad"
                secureTextEntry
                value={formData.idNumber}
                onChangeText={(text) => setFormData({...formData, idNumber: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>집주소</Text>
              <TextInput
                style={styles.input}
                placeholder="집주소"
                placeholderTextColor="#B0B0B0"
                value={formData.address}
                onChangeText={(text) => setFormData({...formData, address: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>아이디</Text>
              <TextInput
                style={styles.input}
                placeholder="아이디"
                placeholderTextColor="#B0B0B0"
                autoCapitalize="none"
                value={formData.userId}
                onChangeText={(text) => setFormData({...formData, userId: text})}
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
                value={formData.password}
                onChangeText={(text) => setFormData({...formData, password: text})}
              />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={onNext}
              activeOpacity={0.85}
            >
              <Text style={styles.signupButtonText}>계정 생성</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
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
  signupButton: {
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
  signupButtonText: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: 'bold',
  },
});