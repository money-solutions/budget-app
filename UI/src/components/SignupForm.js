'use client'

import React, { useState, useEffect, use } from 'react';
import axiosInstance from '../config/axiosConfig';
import TextField from '@mui/material/TextField';
import { Stack, Snackbar, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'


export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [sessionID, setSessionID] = useState(Cookies.get('sessionID') || '');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    handleInputChange();
  }, [username, password, firstname, lastname])

  const handleSignUp = async () => {
    try {
      const response = await axiosInstance.post('/signup', {
        username: username,
        password: password,
        firstname: firstname,
        lastname: lastname,
      });

      const sessionID = response.headers['session-id'];
      Cookies.set('sessionID', sessionID, { expires: 7 }); // Expires in 7 days
      setSessionID(sessionID);

      console.log('POST request successful:', response.data);
      
      
      router.push('/dashboard');
      router.forward();
    } catch (error) {
      console.error('Error:', error);
      const message = error.response.data.message + " Please try again."
      setMessage(message);
      setOpen(true);
    }
  };

  const handleInputChange = () => {
    // Check if all fields are filled
    const fields = [username, password, firstname, lastname]
    console.log(fields)
    const allFilled = fields.every(val => val.trim() !== '');
    setAllFieldsFilled(allFilled);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
      <div>
        <Stack spacing={2}>
          <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              {message}
              </Alert>
          </Snackbar>
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
            type='password'
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
            disabled={!allFieldsFilled}
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
        </Stack>
      </div>
  );
}