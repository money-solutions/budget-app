import React from "react";
import { Typography, Box, TextField, Button, Stack, Snackbar, Alert } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";

function UserProfile() {
    const [user, setUser] = React.useState({});
    const [firstName, setFirstName] = React.useState("");
    const [lastName, setLastName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [successUpdate, setSuccessUpdate] = React.useState(false);
    const [isChanged, setIsChanged] = React.useState(false);

    React.useEffect(() => {
        getUserProfile();
    }, []);

    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get("/user");

            let userObject = response.data.userInfo;
            userObject.firstname = userObject.firstname ?? "";
            userObject.lastname = userObject.lastname ?? "";
            userObject.email = userObject.email ?? "";
            userObject.phone = userObject.phone ?? "";

            setUser(userObject);
            setFirstName(userObject.firstname);
            setLastName(userObject.lastname);
            setEmail(userObject.email);
            setPhone(userObject.phone);
        } catch (error) {
            console.error("Error getting user profile: ", error);
        }
    };

    const handleFirstNameChange = (e) => {
        const newFirstName = e.target.value;
        setFirstName(newFirstName);
        setIsChanged(newFirstName !== user.firstname || lastName !== user.lastname || email !== user.email || phone !== user.phone);
    };

    const handleLastNameChange = (e) => {
        const newLastName = e.target.value;
        setLastName(newLastName);
        setIsChanged(firstName !== user.firstname || newLastName !== user.lastname || email !== user.email || phone !== user.phone);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsChanged(firstName !== user.firstname || lastName !== user.lastname || newEmail !== user.email || phone !== user.phone);
    };

    const handlePhoneChange = (e) => {
        const newPhone = e.target.value;
        setPhone(newPhone);
        setIsChanged(firstName !== user.firstname || lastName !== user.lastname || email !== user.email || newPhone !== user.phone);
    };

    const handleUpdateProfile = async () => {
        try {
            const response = await axiosInstance.put("/user", {
                firstname: firstName,
                lastname: lastName,
                email: email,
                phone: phone,
            });
            console.log("PUT request successful: ", response.data);
            setMessage("Profile updated successfully");
            setSuccessUpdate(() => true);
            setIsChanged(false);
            setOpen(true);
            await getUserProfile(); // Consider if you really need to fetch the user profile again here
            // Yes, because shoudld reinitialize the state variables
        } catch (error) {
            console.error("Error updating profile: ", error);
            const errorMessage = error?.response?.data?.message || "An error occurred. Please try again.";
            setSuccessUpdate(() => false);
            setMessage(errorMessage);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ width: "50%" }}>
            <Stack spacing={3}>
                <Typography variant="h5" gutterBottom>
                    User Profile:
                </Typography>
                <TextField label="First Name" variant="outlined" value={firstName} onChange={handleFirstNameChange} fullWidth sx={{ marginBottom: 1 }} />
                <TextField label="Last Name" variant="outlined" value={lastName} onChange={handleLastNameChange} fullWidth sx={{ marginBottom: 1 }} />
                <TextField label="Email" variant="outlined" value={email} onChange={handleEmailChange} fullWidth sx={{ marginBottom: 1 }} />
                <TextField label="Phone" variant="outlined" type="phone" value={phone} onChange={handlePhoneChange} fullWidth sx={{ marginBottom: 2 }} />
                <Button disabled={!isChanged} onClick={handleUpdateProfile} variant="contained" color="primary">
                    Update
                </Button>
            </Stack>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={handleClose} severity={setSuccessUpdate ? "success" : "error"} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default UserProfile;
