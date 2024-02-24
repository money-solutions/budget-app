'use client'

import React, { useState } from 'react';
import axiosInstance from '../config/axiosConfig';
import styles from "./page.module.css";
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';


export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleFirstnameChange = (event) => {
    setFirstname(event.target.value);
  };

  const handleLastnameChange = (event) => {
    setLastname(event.target.value);
  };

  const handleSignUp = async () => {
    try {
      const response = await axiosInstance.post('/signup', {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
      });
      console.log('POST request successful:', response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className={styles.main}>
      <div>
        
        <Stack spacing={1}>
          <Typography variant="h5" gutterBottom>
            Welcome To Our Budget App!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Please Sign Up:
          </Typography>
          <TextField
            required
            id="outlined-required"
            label="Username"
            onChange={handleUsernameChange}
          />
          <TextField
            required
            id="outlined-required"
            label="Password"
            onChange={handlePasswordChange}
          />
          <TextField
            required
            id="outlined-required"
            label="First Name"
            onChange={handleFirstnameChange}
          />
          <TextField
            required
            id="outlined-required"
            label="Last Name"
            onChange={handleLastnameChange}
          />
          <Button 
            variant="contained"
            color="primary"
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Stack>
      </div>
    </main>
  );
}
