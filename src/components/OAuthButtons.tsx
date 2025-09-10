'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import styles from './OAuthButtons.module.scss';

interface OAuthButtonsProps {
  mode: 'login' | 'register';
  onError?: (error: string) => void;
}

const OAuthButtons: React.FC<OAuthButtonsProps> = ({ mode, onError }) => {
  const authContext = useAuth();
  const router = useRouter();

  const handleGoogleLogin = () => {
    authContext.googleLogin();
  };

  const handleKakaoLogin = () => {
    authContext.kakaoLogin();
  };

  const handleNaverLogin = () => {
    authContext.naverLogin();
  };

  return (
    <div className={styles.oauthContainer}>
      <div className={styles.divider}>
        <span className={styles.dividerText}>또는</span>
      </div>

      <div className={styles.oauthButtons}>
        <button type="button" onClick={handleGoogleLogin} className={`${styles.oauthButton} ${styles.googleButton}`}>
          <span className={styles.buttonText}>{mode === 'login' ? 'Google로 로그인' : 'Google로 회원가입'}</span>
        </button>

        <button type="button" onClick={handleKakaoLogin} className={`${styles.oauthButton} ${styles.kakaoButton}`}>
          <span className={styles.buttonText}>{mode === 'login' ? '카카오로 로그인' : '카카오로 회원가입'}</span>
        </button>

        <button type="button" onClick={handleNaverLogin} className={`${styles.oauthButton} ${styles.naverButton}`}>
          <span className={styles.buttonText}>{mode === 'login' ? '네이버로 로그인' : '네이버로 회원가입'}</span>
        </button>
      </div>
    </div>
  );
};

export default OAuthButtons;
