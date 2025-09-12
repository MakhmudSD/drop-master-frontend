'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';
import OAuthButtons from '@/components/OAuthButtons';
import styles from './register.module.scss';

export default function RegisterPage() {
  const { register, user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      router.push('/');
    } catch (err: any) {
      // Check if it's a duplicate email error
      if (err.message && err.message.includes('already exists')) {
        setError('이 이메일로 이미 가입된 계정이 있습니다. 로그인을 시도해보세요.');
      } else {
        setError(err.message || '회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>
              <UserPlus />
            </div>
          </div>
          <h2 className={styles.title}>
            회원가입
          </h2>
          <p className={styles.subtitle}>
            또는{' '}
            <Link
              href="/login"
              className={styles.subtitleLink}
            >
              기존 계정으로 로그인
            </Link>
          </p>
        </div>

        <div className={styles.formContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div className={styles.errorMessage}>
                {error}
                {error.includes('이미 가입된 계정이 있습니다') && (
                  <div className="mt-2">
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 underline">
                      로그인 페이지로 이동
                    </Link>
                  </div>
                )}
              </div>
            )}

            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                이름
              </label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <User />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.inputLabel}>
                이메일 주소
              </label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Mail />
                </div>
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
              <label htmlFor="password" className={styles.inputLabel}>
                비밀번호
              </label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Lock />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className={styles.passwordToggleIcon} />
                  ) : (
                    <Eye className={styles.passwordToggleIcon} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.inputLabel}>
                비밀번호 확인
              </label>
              <div className={styles.inputContainer}>
                <div className={styles.inputIcon}>
                  <Lock />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`${styles.input} ${styles.passwordInput}`}
                  placeholder="비밀번호를 다시 입력하세요"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className={styles.passwordToggleIcon} />
                  ) : (
                    <Eye className={styles.passwordToggleIcon} />
                  )}
                </button>
              </div>
            </div>

            <div className={styles.termsContainer}>
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                required
                className={styles.termsCheckbox}
              />
              <label htmlFor="agree-terms" className={styles.termsLabel}>
                <Link href="/terms" className={styles.termsLink}>
                  이용약관
                </Link>
                과{' '}
                <Link href="/privacy" className={styles.termsLink}>
                  개인정보처리방침
                </Link>
                에 동의합니다.
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={styles.submitButton}
              >
                {isLoading ? (
                  <div className={styles.loadingSpinner}></div>
                ) : (
                  '회원가입'
                )}
              </button>
            </div>

            {/* OAuth Login Buttons */}
            <OAuthButtons mode="register" onError={setError} />
          </form>
        </div>
      </div>
    </div>
  );
}

