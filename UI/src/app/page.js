'use client'

import React, { useState, useEffect, use } from 'react';
import axiosInstance from '../config/axiosConfig';
import styles from "./page.module.css";
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import Signup from '@/components/Signup';
import Link from '@mui/material';


export default function Home() {
  return (
    <div>

      <Typography variant="h5" gutterBottom>
        Welcome To Our Budget App!
      </Typography>

      
      <Signup></Signup>
      <Button variant="text" className={styles.blackButton}>Already Have an Account? Click Here to Login</Button>
      
    </div>
    
    
  );
}
