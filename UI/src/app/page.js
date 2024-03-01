'use client'

import React, { useState, useEffect, use } from 'react';
import styles from "./page.module.css";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SignupForm from '@/components/SignupForm';
import LoginForm from '@/components/LoginForm';


export default function Home() {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [buttonMessage, setButtonMessage] = useState("Don't Have an Account? Click Here to Sign Up");

  const toggleForm = () => {
    setShowLoginForm(!showLoginForm);
    setButtonMessage("Already Have an Account? Click Here to Login");
  };

  return (
    <div>

      <Typography variant="h5" gutterBottom>
        Welcome To Our Budget App!
      </Typography>

      { showLoginForm ? <LoginForm/> : <SignupForm/>}
      
      <Button variant="text" className={styles.blackButton} onClick={toggleForm}> {buttonMessage} </Button>
      
    </div>
    
    
  );
}
