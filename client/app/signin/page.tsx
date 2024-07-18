'use client'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from '@/app/ui/signin/signin.module.css';
import Link from 'next/link';
import { loginFailure, loginSuccess } from '../slice/authSlice';
import { CircularProgress, Button } from '@mui/material';

const SignIn: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    return email.endsWith('.knust.edu.gh');
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Please login with a valid email that ends in .knust.edu.gh");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const { token, refreshToken, user } = response.data;

      // Dispatch login success action
      dispatch(loginSuccess({ token, user }));
      
      // Store token in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);

      router.push('/dashboard');
    } catch (err: any) {
      console.error('Error logging in:', err);
      if (err.response && err.response.status === 403) {
        setError('Please verify your email before logging in');
        dispatch(loginFailure({ error: 'Please verify your email before logging in' }));
      } else {
        setError('Invalid email or password');
        dispatch(loginFailure({ error: 'Invalid email or password' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.heading}>Welcome back</h3>
        <p className={styles.description}>Login into your existing account on this platform</p><br />

        {error && <p className={styles.error}>{error}</p>}

        <label htmlFor='email' className={styles.label}>Email</label>
        <input
          type='email'
          id='email'
          className={styles.input}
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor='password' className={styles.label}>Password</label>
        <input
          type='password'
          id='password'
          className={styles.input}
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className={styles.rememberMe}>
          <input
            type='checkbox'
            id='rememberMe'
            className={styles.checkbox}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor='rememberMe' className={styles.rememberMeLabel}>Remember me</label>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          disabled={isLoading}
          className={styles.button}
        >
          {isLoading ? <CircularProgress size={24} /> : 'Login'}
        </Button>

        <Link href='/signup'>
          <span className={styles.newaccount}><u>Create a new account</u></span>
        </Link>

        <Link href='#'>
          <span className={styles.forgotPassword}><u>Forgot password?</u></span>
        </Link>
      </div>
    </div>
  );
};

export default SignIn;
