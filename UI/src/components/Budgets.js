import * as React from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
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
import { Stack, Alert, Snackbar } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";
import { Router } from "next/router";
import Paper from "@mui/material/Paper";

function Budgets() {
    const [budgetYear, setBudgetYear] = React.useState("None");
    const [budgetYears, setBudgetYears] = React.useState([]);
    const [newBudgetYear, setNewBudgetYear] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const [accountsData, setAccountsData] = React.useState([]);
    const [openModal, setOpenModal] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [name, setName] = React.useState("");
    const [bank, setBank] = React.useState("");
    const [type, setType] = React.useState("");
    const [message, setMessage] = React.useState("");

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - index);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleOpenEditModal = (account) => {
        setCurrentAccount(account);
        setId(account.accountid);
        setName(account.nickname);
        setBank(account.bank);
        setType(account.accounttype);
        setEditOpen(true);
    };

    const handleBudgetYearChange = (e) => {
        const selectedYear = e.target.value;
        setBudgetYear(selectedYear);
        if (selectedYear != "None") {
            getBudget(selectedYear);
        }
    };

    const handleNewBudgetYearChange = (e) => {
        setNewBudgetYear(e.target.value);
    };

    const handleCreateBudget = async () => {
        try {
            const response = await axiosInstance.post("/budget", { budgetYear: newBudgetYear });
            console.log("POST request successful: ", response.data);
            await getBudgetYears();
            handleCloseModal();
        } catch (error) {
            console.error("Error: ", error);
            const message = error.response.data.message + " Please try again.";
            setMessage(message);
            setOpen(true);
        }
    };

    const handleCloseEditModal = () => {
        setEditOpen(false);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const getBudget = async (selectedYear) => {
        try {
            const response = await axiosInstance.get("/budget", { params: { budgetYear: selectedYear } });
            console.log(response);
        } catch (error) {
            console.error("Error getting budget associated with a year: ", error);
        }
    };

    const getBudgetYears = async () => {
        try {
            const response = await axiosInstance.get("/budget/years/");
            console.log(response);
            setBudgetYears(response.data.allBudgetYears ? response.data.allBudgetYears : []);
        } catch (error) {
            console.error("Error getting budget years associated with user: ", error);
        }
    };

    React.useEffect(() => {
        getBudgetYears();
    }, []);

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 3, marginBottom: 3 }}>
                <Typography variant="h5">Select Budgeting Year:</Typography>
                <FormControl variant="standard" sx={{ minWidth: 175 }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={budgetYear}
                        disabled={budgetYears.length === 0 ? true : false}
                        onChange={handleBudgetYearChange}
                    >
                        <MenuItem value="None">Select One</MenuItem>
                        {budgetYears.length > 0 ? (
                            budgetYears.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem value="None">No Budgets Created Yet</MenuItem>
                        )}
                    </Select>
                </FormControl>

                <Button variant="contained" onClick={handleOpenModal} sx={{ bgcolor: "green", color: "white", marginLeft: "auto" }}>
                    Add New Budgeting Year
                </Button>
            </Box>

            {accountsData.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Name</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Bank</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Type</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Edit</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accountsData.map((account) => (
                                <TableRow key={account.accountid}>
                                    <TableCell>{account.nickname}</TableCell>
                                    <TableCell>{account.bank}</TableCell>
                                    <TableCell>{mapTypeToString(account.accounttype)}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenEditModal(account)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDelete(account.accountid)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No Accounts Found</Typography>
            )}
            
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>
            <Modal open={openModal} onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Add A New Budgeting Year:
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="typeID">Select A Year</InputLabel>
                        <Select label="Type of Account" labelId="typeID" value={newBudgetYear} fullWidth onChange={handleNewBudgetYearChange}>
                            {years.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={handleCreateBudget} sx={{ bgcolor: "green", color: "white" }}>
                            Add New Budget
                        </Button>
                    </Box>
                </Box>
            </Modal>

            {/* <Modal open={editOpen} onClose={handleCloseEditModal}>
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
            </Modal> */}
        </Box>
    );
}

export default Budgets;
