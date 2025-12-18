// AppNavigator.js
import React, { useState } from 'react';
import SplashScreen from './screens/SplashScreen';
import FeaturesScreen from './screens/Featuresscreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import Consent1Screen from './screens/Consent1Screen';
import Consent2Screen from './screens/Consent2Screen';
import Consent3Screen from './screens/Consent3Screen';
import WelcomeScreen from './screens/WelcomeScreen';
import WarningScreen from './screens/WarningScreen';
import SetupScreen from './screens/SetupScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import ChatEndScreen from './screens/Chatendscreen';

export default function AppNavigator() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [userBots, setUserBots] = useState([]);
  const [currentBot, setCurrentBot] = useState(null);
  const [chatStats, setChatStats] = useState({ messageCount: 0, duration: '0분 0초' });

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  // 챗봇 생성
  const createBot = (botData) => {
    const newBot = {
      id: Date.now(),
      name: botData.name || '소중한 분',
      relation: botData.relation || '가족',
      birthDate: botData.birthDate || '',
      personality: botData.personality || '',
      emoji: '😊',
      lastChat: '방금 전',
      createdAt: new Date(),
    };
    setUserBots([...userBots, newBot]);
    setCurrentBot(newBot);
    console.log('챗봇 생성됨:', newBot);
  };

  // 데모 챗봇 생성
  const createDemoBot = () => {
    const demoBot = {
      id: 'demo',
      name: '엄마',
      relation: '어머니',
      emoji: '😊',
      lastChat: '방금 전',
    };
    setCurrentBot(demoBot);
  };

  // 화면 렌더링
  switch (currentScreen) {
    case 'splash':
      return (
        <SplashScreen
          onLogin={() => navigateTo('login')}
          onFeatures={() => navigateTo('features')}
        />
      );

    case 'features':
      return (
        <FeaturesScreen
          onBack={() => navigateTo('splash')}
        />
      );

    case 'login':
      return (
        <LoginScreen
          onNext={() => navigateTo('home')}
          onHome={() => navigateTo('splash')}
          onSignup={() => navigateTo('signup')}
        />
      );

    case 'signup':
      return (
        <SignupScreen
          onNext={() => navigateTo('consent1')}
          onHome={() => navigateTo('splash')}
          onLogin={() => navigateTo('login')}
        />
      );

    case 'consent1':
      return (
        <Consent1Screen
          onNext={() => navigateTo('consent2')}
          onBack={() => navigateTo('signup')}
          onHome={() => navigateTo('splash')}
        />
      );

    case 'consent2':
      return (
        <Consent2Screen
          onNext={() => navigateTo('consent3')}
          onBack={() => navigateTo('consent1')}
          onHome={() => navigateTo('splash')}
        />
      );

    case 'consent3':
      return (
        <Consent3Screen
          onComplete={() => navigateTo('welcome')}
          onBack={() => navigateTo('consent2')}
          onHome={() => navigateTo('splash')}
        />
      );

    case 'welcome':
      return (
        <WelcomeScreen
          onStart={() => navigateTo('warning')}
        />
      );

    case 'warning':
      return (
        <WarningScreen
          onNext={() => navigateTo('setup')}
          onBack={() => navigateTo('welcome')}
          onHome={() => navigateTo('splash')}
        />
      );

    case 'setup':
      return (
        <SetupScreen
          onCreate={(botData) => {
            createBot(botData);
            navigateTo('home');
          }}
          onBack={() => navigateTo('warning')}
          onHome={() => navigateTo('splash')}
        />
      );

    case 'home':
      return (
        <HomeScreen
          bots={userBots}
          onChatStart={(bot) => {
            setCurrentBot(bot);
            navigateTo('chat');
          }}
          onCreateBot={() => navigateTo('setup')}
        />
      );

    case 'chat':
      return (
        <ChatScreen
          bot={currentBot}
          onBack={() => {
            if (currentBot?.id === 'demo') {
              navigateTo('splash');
            } else {
              navigateTo('home');
            }
          }}
          onShowEndModal={(messageCount, duration) => {
            setChatStats({ messageCount, duration });
            navigateTo('chatEnd');
          }}
        />
      );

    case 'chatEnd':
      return (
        <ChatEndScreen
          bot={currentBot}
          messageCount={chatStats.messageCount}
          duration={chatStats.duration}
          onEnd={() => {
            if (currentBot?.id === 'demo') {
              navigateTo('splash');
            } else {
              navigateTo('home');
            }
          }}
          onBack={() => navigateTo('chat')}
        />
      );

    default:
      return (
        <SplashScreen 
          onLogin={() => navigateTo('login')} 
          onFeatures={() => navigateTo('features')}
        />
      );
  }
}