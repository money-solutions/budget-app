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
import { InputLabel, FormHelperText, FormControl, OutlinedInput, InputAdornment } from "@mui/material";
import { Stack, Alert, Snackbar } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";
import BudgetTable from "./BudgetTable";
import { Router } from "next/router";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function Budgets() {
    const [budgetYear, setBudgetYear] = React.useState("None");
    const [budgetYears, setBudgetYears] = React.useState([]);
    const [newBudgetYear, setNewBudgetYear] = React.useState("");
    const [allMonthsBudgetData, setAllMonthsBudgetData] = React.useState(null);
    const [selectedMonth, setSelectedMonth] = React.useState(0);

    const [open, setOpen] = React.useState(false);
    const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState(null);
    const [newCategoryAmount, setNewCategoryAmount] = React.useState(null);

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

    const handleCloseCategoryModal = () => {
        setOpenCategoryModal(false);
    };

    const handleOpenCategoryModal = () => {
        setOpenCategoryModal(true);
    };

    const handleNewCategoryNameChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleNewCategoryAmountChange = (e) => {
        setNewCategoryAmount(e.target.value);
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

    const handleCreateCategory = async () => {
        try {
            const response = await axiosInstance.post("/category", {
                budgetYear: budgetYear,
                budgetMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                categoryName: newCategoryName,
                budgetAmount: Number(newCategoryAmount),
                categoryType: "Expense",
            });
            console.log("POST request successful: ", response.data);
            getBudget(budgetYear);
            handleCloseCategoryModal();
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

    const handleMonthChange = (event, newValue) => {
        setSelectedMonth(newValue);
    };

    const getBudget = async (selectedYear) => {
        try {
            const response = await axiosInstance.get("/budget", { params: { budgetYear: selectedYear } });
            console.log(response);
            const budgetObject = response.data.budgetObject;
            if (budgetObject) {
                setAllMonthsBudgetData(budgetObject.budgets);
                console.dir(allMonthsBudgetData);
            }
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

            {allMonthsBudgetData && budgetYear != "None" ? (
                <>
                    <Box sx={{ bgcolor: "background.paper" }} marginBottom={2} component={Paper}>
                        <Tabs
                            value={selectedMonth}
                            onChange={handleMonthChange}
                            variant="scrollable"
                            scrollButtons
                            allowScrollButtonsMobile
                            aria-label="scrollable force tabs example"
                        >
                            <Tab value={0} label="January" />
                            <Tab value={1} label="February" />
                            <Tab value={2} label="March" />
                            <Tab value={3} label="April" />
                            <Tab value={4} label="May" />
                            <Tab value={5} label="June" />
                            <Tab value={6} label="July" />
                            <Tab value={7} label="August" />
                            <Tab value={8} label="September" />
                            <Tab value={9} label="October" />
                            <Tab value={10} label="November" />
                            <Tab value={11} label="December" />
                        </Tabs>
                    </Box>
                    <BudgetTable rows={allMonthsBudgetData[selectedMonth]} />
                    <Button variant="contained" onClick={handleOpenCategoryModal} sx={{ bgcolor: "green", color: "white", marginTop: 2 }}>
                        Add New Category to Budget
                    </Button>
                </>
            ) : null}

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

            <Modal open={openCategoryModal} onClose={handleCloseCategoryModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Add A New Category:
                    </Typography>
                    <TextField required label="Category Name" fullWidth value={newCategoryName} onChange={handleNewCategoryNameChange} sx={{ mb: 2 }} />

                    <FormControl fullWidth sx={{ m: 1 }}>
                        <InputLabel>Category Amount</InputLabel>
                        <OutlinedInput
                            fullWidth
                            value={newCategoryAmount}
                            onChange={handleNewCategoryAmountChange}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            required
                            label="Category Amount"
                        />
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button
                            disabled={!(newCategoryName && newCategoryAmount)}
                            variant="contained"
                            onClick={handleCreateCategory}
                            sx={{ bgcolor: "green", color: "white" }}
                        >
                            Add New Category
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
