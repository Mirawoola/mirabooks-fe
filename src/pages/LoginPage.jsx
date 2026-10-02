/**
 * LoginPage — Handles Google OAuth sign in.
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential);
      // navigation happens automatically via useEffect above when isAuthenticated becomes true
    } catch (error) {
      console.error('Login failed:', error);
      alert('Failed to sign in. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Google Sign In was unsuccessful');
    alert('Failed to connect to Google. Please try again.');
  };

  return (
    <main className="login-page">
      <div className="login-container card">
        <div className="login-header">
          <Link to="/" className="login-logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">Mirabooks</span>
          </Link>
          <h1 className="login-title">Welcome Back</h1>
          <p className="login-subtitle">Sign in to your account to continue</p>
        </div>

        <div className="login-body">
          <div className="google-auth-wrapper">
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              theme="filled_blue"
              shape="rectangular"
              size="large"
            />
          </div>

          <div className="login-divider">
            <span>Secure Access</span>
          </div>

          <p className="login-info">
            We use Google for authentication to ensure your account is safe and secure.
            We will never post on your behalf.
          </p>
        </div>
      </div>
    </main>
  );
}
