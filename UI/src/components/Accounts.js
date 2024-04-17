import * as React from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { InputLabel, FormHelperText, FormControl } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";
import { Router } from "next/router";
import axios from "axios";

function Accounts() {
    const [accountsData, setAccountsData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [currentAccount, setCurrentAccount] = React.useState(null);
    const [accountid, setId] = React.useState("");
    const [name, setName] = React.useState("");
    const [bank, setBank] = React.useState("");
    const [type, setType] = React.useState("");
    const [message, setMessage] = React.useState("");

    const handleOpenModal = () => {
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleOpenEditModal = (account) => {
        setCurrentAccount(account);
        setId(account.accountid);
        setName(account.nickname);
        setBank(account.bank);
        setType(account.accounttype);
        setEditOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditOpen(false);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleBankChange = (e) => {
        setBank(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const getAccounts = async () => {
        try {
            const response = await axiosInstance.get("/account");
            console.log(response.data.accounts);
            setAccountsData(response.data.accounts);
            console.log(accountsData);
        } catch (error) {
            console.error("Error getting accounts associated with user: ", error);
        }
    };

    React.useEffect(() => {
        getAccounts();
    }, []);

    const handleAddAccount = async () => {
        try {
            const response = await axiosInstance.post("/account", { accountid, name, bank, type });
            console.log("POST request successful: ", response.data);
            await getAccounts();
            handleCloseModal();
        } catch (error) {
            console.error("Error: ", error);
            const message = error.response.data.message + " Please try again.";
            setMessage(message);
            setOpen(true);
        }
    };

    const handleEditAccount = async () => {
        try {
            const response = await axiosInstance.put("/account", { accountid, name, bank, type });
            console.log("PUT request successful: ", response.data);
            await getAccounts();
            handleCloseEditModal();
        } catch (error) {
            console.error("Error: ", error);
            const message = error.response.data.message + " Please try again.";
            setMessage(message);
            setEditOpen(true);
        }
    };

    const handleDelete = async (accountid) => {
        console.log(accountid);
        try {
            const response = await axiosInstance.delete("/account", { data: { accountid } });
            console.log("Account deleted successfully");
            await getAccounts();
        } catch (error) {
            console.error("Error deleting account: ", error);
        }
    };

    const mapTypeToString = (type) => {
        return type === 1 ? "Checkings" : "Savings";
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box display="flex" gap={45} marginBottom={3}>
                <Typography variant="h5">My Accounts:</Typography>
                <Button variant="contained" onClick={handleOpenModal} sx={{ bgcolor: "green", color: "white" }}>
                    Add Account
                </Button>
            </Box>

            {accountsData.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Bank</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Edit</TableCell>
                                <TableCell>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accountsData.map((account) => (
                                <TableRow key={account.accountid}>
                                    <TableCell>{account.nickname}</TableCell>
                                    <TableCell>{account.bank}</TableCell>
                                    <TableCell>{mapTypeToString(account.accounttype)}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenEditModal(account)}>Edit</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" style={{ backgroundColor: 'red', color: 'white' }} onClick={() => handleDelete(account.accountid)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No Accounts Found</Typography>
            )}

            <Modal open={open} onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Add An Account:
                    </Typography>
                    <TextField required label="Name" fullWidth onChange={handleNameChange} sx={{ mb: 2 }} />
                    <TextField label="Bank" fullWidth onChange={handleBankChange} sx={{ mb: 2 }} />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="typeID">Type of Account</InputLabel>
                        <Select label="Type of Account" labelId="typeID" value={type} fullWidth onChange={handleTypeChange}>
                            <MenuItem value={1}>Checkings</MenuItem>
                            <MenuItem value={2}>Savings</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={handleAddAccount} sx={{ bgcolor: "green", color: "white" }}>
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={editOpen} onClose={handleCloseEditModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Edit Account:
                    </Typography>
                    <TextField required label="Name" fullWidth value={name} onChange={handleNameChange} sx={{ mb: 2 }} />
                    <TextField label="Bank" fullWidth value={bank} onChange={handleBankChange} sx={{ mb: 2 }} />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="editTypeID">Type of Account</InputLabel>
                        <Select label="Type of Account" labelId="editTypeID" value={type} fullWidth onChange={handleTypeChange}>
                            <MenuItem value={1}>Checkings</MenuItem>
                            <MenuItem value={2}>Savings</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={handleEditAccount} sx={{ bgcolor: "blue", color: "white" }}>
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default Accounts;
