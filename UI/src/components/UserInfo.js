import * as React from "react";
import { Typography, Box, TextField, Button, Modal } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";
import Paper from "@mui/material/Paper";

function UserProfile() {
    const [user, setUser] = React.useState(null);
    const [updatedFirstName, setUpdatedFirstName] = React.useState("");
    const [updatedLastName, setUpdatedLastName] = React.useState("");
    const [updatedEmail, setUpdatedEmail] = React.useState("");
    const [updatedPhone, setUpdatedPhone] = React.useState("");
    const [message, setMessage] = React.useState("");

    const getUserProfile = async () => {
        try {
            const response = await axiosInstance.get("/user");
            setUser(response.data.userInfo);
        } catch (error) {
            console.error("Error getting user profile: ", error);
        }
    };

    React.useEffect(() => {
        getUserProfile();
    }, []);

    const handleFirstNameChange = (e) => {
        setUpdatedFirstName(e.target.value);
    };
    
    const handleLastNameChange = (e) => {
        setUpdatedLastName(e.target.value);
    };

    const handleEmailChange = (e) => {
        setUpdatedEmail(e.target.value);
    };

    const handlePhoneChange = (e) => {
        setUpdatedPhone(e.target.value);
    };

    const handleUpdateProfile = async () => {
        try {
            const firstName = updatedFirstName.length > 0 ? updatedFirstName : user.firstname;
            const lastName = updatedLastName.length > 0 ? updatedLastName : user.lastname;
            const email = updatedEmail.length > 0 ? updatedEmail : user.email;
            const phone = updatedPhone.length > 0 ? updatedPhone : user.phone;

            const response = await axiosInstance.put("/user", {
                firstname: firstName,
                lastname: lastName,
                email: email,
                phone: phone
            });
            console.log("PUT request successful: ", response.data);
            setMessage("Profile updated successfully");
            getUserProfile();
        } catch (error) {
            console.error("Error updating profile: ", error);
            const message = error.response.data.message + " Please try again.";
            setMessage(message);
        }
    };

    return (
        <Box sx={{ width: "50%" }}>
            <Typography variant="h5">User Profile:</Typography>
            <TextField
                label="First Name"
                variant="outlined"
                value={updatedFirstName || (user && user.firstname)}
                onChange={handleFirstNameChange}
                fullWidth
                sx={{ marginBottom: 1 }}
            />
            <TextField
                label="Last Name"
                variant="outlined"
                value={updatedLastName || (user && user.lastname)}
                onChange={handleLastNameChange}
                fullWidth
                sx={{ marginBottom: 1 }}
            />
            <TextField
                label="Email"
                variant="outlined"
                value={updatedEmail || (user && user.email)}
                onChange={handleEmailChange}
                fullWidth
                sx={{ marginBottom: 1 }}
            />
            <TextField
                label="Phone"
                variant="outlined"
                type="phone"
                value={updatedPhone || (user && user.phone)}
                onChange={handlePhoneChange}
                fullWidth
                sx={{ marginBottom: 2 }}
            />
            <Button onClick={handleUpdateProfile} variant="contained" color="primary">
                Update
            </Button>
            {message && <Typography sx={{ marginTop: 1 }}>{message}</Typography>}
        </Box>
    );
}

export default UserProfile;
