'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import OAuthButtons from '@/components/OAuthButtons';
import styles from './login.module.scss';

export default function LoginPage() {
  const { login, user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Assuming the login function throws an error on failure
      // If it doesn't, you may need to modify the login function to return a success indicator
    } catch {
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}><User /></div>
          </div>
          <h2 className={styles.title}>로그인</h2>
          <p className={styles.subtitle}>
            또는 <Link href="/register" className={styles.subtitleLink}>새 계정 만들기</Link>
          </p>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>이메일 주소</label>
              <div className={styles.inputContainer}>
                <Mail className={styles.inputIcon} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="이메일을 입력하세요"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.inputLabel}>비밀번호</label>
              <div className={styles.inputContainer}>
                <Lock className={styles.inputIcon} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="비밀번호를 입력하세요"
                />
                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className={styles.passwordToggleIcon} /> : <Eye className={styles.passwordToggleIcon} />}
                </button>
              </div>
            </div>

            <div className={styles.optionsContainer}>
              <div className={styles.rememberContainer}>
                <input id="remember-me" name="remember-me" type="checkbox" className={styles.rememberCheckbox} />
                <label htmlFor="remember-me" className={styles.rememberLabel}>로그인 상태 유지</label>
              </div>
              <Link href="/forgot-password" className={styles.forgotPasswordLink}>비밀번호를 잊으셨나요?</Link>
            </div>

            <button type="submit" disabled={isLoading} className={styles.submitButton}>
              {isLoading ? <div className={styles.loadingSpinner}></div> : '로그인'}
            </button>

            {/* OAuth Buttons */}
            <OAuthButtons mode="login" onError={setError} />
          </form>
        </div>
      </div>
    </div>
  );
}
