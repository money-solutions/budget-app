"use client";

import React, { useState, useEffect, use } from "react";
import axiosInstance from "../config/axiosConfig";
import TextField from "@mui/material/TextField";
import { Stack, Alert, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/navigation";

export default function SignupForm() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    useEffect(() => {
        handleInputChange();
    }, [username, password]);

    const handLogin = async () => {
        try {
            const response = await axiosInstance.post("/user/login", {
                username,
                password,
            });

            console.log("POST request successful:", response.data);
            router.push("/dashboard");
            router.forward();
        } catch (error) {
            console.error("Error:", error);
            const message = error.response?.data?.message + " Please try again.";
            setMessage(message);
            setOpen(true);
        }
    };

    const handleInputChange = () => {
        // Check if all fields are filled
        const fields = [username, password];
        console.log(fields);
        const allFilled = fields.every((val) => val.trim() !== "");
        setAllFieldsFilled(allFilled);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Stack spacing={2}>
                <Snackbar
                    open={open}
                    autoHideDuration={5000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                >
                    <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                        {message}
                    </Alert>
                </Snackbar>
                <Typography variant="h6" gutterBottom>
                    Please Login:
                </Typography>
                <TextField required id="outlined-required" label="Username" onChange={handleUsernameChange} />
                <TextField
                    required
                    id="outlined-required"
                    label="Password"
                    type="password"
                    onChange={handlePasswordChange}
                />
                <Button variant="contained" color="primary" disabled={!allFieldsFilled} onClick={handLogin}>
                    Login
                </Button>
            </Stack>
        </div>
    );
}
