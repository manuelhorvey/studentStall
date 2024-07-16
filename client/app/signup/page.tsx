'use client'
import React, { useState } from 'react';
import styles from '@/app/ui/signup/signup.module.css';
import Link from 'next/link';
import axios from 'axios';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // State to manage password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State to manage confirmPassword visibility
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignUp = async () => {
    setError('');
    setSuccessMessage('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }
  
    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
      return;
    }
  
    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
/* 
    // Check if email is a student email (example: ends with .edu)
    if (!email.endsWith('.knust.edu.gh')) {
      setError('Please sign up with a valid student email ending in .edu');
      return;
    } */
  
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', { name, email, password });
      console.log(response.data); // Assuming your backend returns a response with a message upon successful signup
      
      // Clear form fields upon successful signup
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      // Show success message and redirect to login page
      alert('An email has been sent to your email address.');
      setTimeout(() => {
        window.location.href = '/signin'; // Redirect to login page
      }, 2000); // Redirect after 2 seconds
      
    } catch (err) {
      console.error('Error signing up:', err);
      setError('Error signing up. Please try again.'); 
    }
  };
  
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h3 className={styles.heading}>Create an Account</h3>
        <p className={styles.description}>Sign up to get started on our platform</p><br/>
        
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        
        <label htmlFor='name' className={styles.label}>Name</label>
        <input type='text' id='name' className={styles.input} placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />

        <label htmlFor='email' className={styles.label}>Email</label>
        <input type='email' id='email' className={styles.input} placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor='password' className={styles.label}>Password</label>
        <div className={styles.passwordInput}>
          <input type={passwordVisible ? 'text' : 'password'} id='password' className={styles.input} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="button" className={styles.toggleButton} onClick={togglePasswordVisibility}>
            {passwordVisible ? 'Hide' : 'Show'}
          </button>
        </div>
        
        <label htmlFor='confirmPassword' className={styles.label}>Confirm Password</label>
        <div className={styles.passwordInput}>
          <input type={confirmPasswordVisible ? 'text' : 'password'} id='confirmPassword' className={styles.input} placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button type="button" className={styles.toggleButton} onClick={toggleConfirmPasswordVisibility}>
            {confirmPasswordVisible ? 'Hide' : 'Show'}
          </button>
        </div>

        <button type='button' className={styles.button} onClick={handleSignUp}>Sign Up</button>
        
        <p className={styles.loginPrompt}>Already have an account? 
          <Link href='/signin'>
            <span className={styles.loginLink}>Log in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
