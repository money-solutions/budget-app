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
import { InputLabel, FormHelperText, FormControl, OutlinedInput, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import { Stack, Alert, Snackbar } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";
import BudgetTable from "./BudgetTable";
import { Router } from "next/router";
import Paper from "@mui/material/Paper";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

function Budgets() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();

    const [selectedBudgetYear, setSelectedBudgetYear] = React.useState("None");
    const [budgetYears, setBudgetYears] = React.useState([]);
    const [newBudgetYear, setNewBudgetYear] = React.useState("");
    const [allMonthsBudgetData, setAllMonthsBudgetData] = React.useState(null);
    const [selectedMonth, setSelectedMonth] = React.useState(currentMonth);

    const [open, setOpen] = React.useState(false);
    const [openCategoryModal, setOpenCategoryModal] = React.useState(false);
    const [newCategoryName, setNewCategoryName] = React.useState(null);
    const [newCategoryAmount, setNewCategoryAmount] = React.useState(null);
    const [newCategoryType, setNewCategoryType] = React.useState(null);
    const [allMonths, setAllMonths] = React.useState(false);
    const [openModal, setOpenModal] = React.useState(false);
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

    const handleAllMonthsChange = () => {
        setAllMonths(!allMonths);
    };

    const handleBudgetYearChange = (e) => {
        const selectedYear = e.target.value;
        setSelectedBudgetYear(selectedYear);
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
                budgetYear: selectedBudgetYear,
                budgetMonths: allMonths ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] : [selectedMonth + 1],
                categoryName: newCategoryName,
                budgetAmount: newCategoryType === "Expense" ? -Number(newCategoryAmount): Number(newCategoryAmount),
                categoryType: newCategoryType,
            });
            console.log("POST request successful: ", response.data);
            getBudget(selectedBudgetYear);
            handleCloseCategoryModal();
            setNewCategoryName(null);
            setNewCategoryAmount(null);
            setAllMonths(false);
        } catch (error) {
            console.error("Error: ", error);
            const message = error.response.data.message + " Please try again.";
            setMessage(message);
            setOpen(true);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCategoryTypeChange = (e) => {
        setNewCategoryType(e.target.value);
    };

    const handleMonthChange = (event, newValue) => {
        setSelectedMonth(newValue);
    };

    const handleDeleteBudget = async () => {
        try {
            const response = await axiosInstance.delete("/budget", { data: { budgetYear: selectedBudgetYear } });
            console.log("DELETE request successful: ", response.data);
            await getBudgetYears();
            setSelectedBudgetYear("None");
        } catch (error) {
            console.error("Error: ", error);
            const message = error?.response?.data?.message + " Please try again.";
            setMessage(message);
            setOpen(true);
        }
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
                        value={selectedBudgetYear}
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

            {allMonthsBudgetData && selectedBudgetYear != "None" ? (
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
                    {allMonthsBudgetData[selectedMonth].expenseCategories.length > 0 ? (
                        <>
                            <Typography
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: 1,
                                    marginTop: 1,
                                }}
                                variant="h6"
                            >
                                Expense Categories Table
                            </Typography>
                            <BudgetTable
                                rows={allMonthsBudgetData[selectedMonth].expenseCategories}
                                message={message}
                                setMessage={setMessage}
                                openError={open}
                                setOpenError={setOpen}
                                getBudget={getBudget}
                                selectedBudgetYear={selectedBudgetYear}
                            />
                        </>
                    ) : (
                        <>
                            <Typography
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: 1,
                                    marginTop: 1,
                                }}
                                variant="h6"
                            >
                                No Expense Categories Created
                            </Typography>
                        </>
                    )}
                    {allMonthsBudgetData[selectedMonth].incomeCategories.length > 0 ? (
                        <>
                            <Typography
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: 1,
                                    marginTop: 3,
                                }}
                                variant="h6"
                            >
                                Income Categories Table
                            </Typography>
                            <BudgetTable
                                rows={allMonthsBudgetData[selectedMonth].incomeCategories}
                                message={message}
                                setMessage={setMessage}
                                openError={open}
                                setOpenError={setOpen}
                                getBudget={getBudget}
                                selectedBudgetYear={selectedBudgetYear}
                            />
                        </>
                    ) : (
                        <>
                            <Typography
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: 1,
                                    marginTop: 3,
                                }}
                                variant="h6"
                            >
                                No Income Categories Created
                            </Typography>
                        </>
                    )}
                    <Box textAlign="center">
                        <Button variant="contained" onClick={handleOpenCategoryModal} sx={{ bgcolor: "green", color: "white", marginTop: 2 }}>
                            Add New Category to Budget
                        </Button>
                    </Box>
                    <Box textAlign="center">
                        <Button variant="contained" onClick={handleDeleteBudget} sx={{ bgcolor: "red", color: "white", marginTop: 2 }}>
                            Delete Your {selectedBudgetYear} Budget
                        </Button>
                    </Box>
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

                    <FormControl fullWidth>
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
                    <FormControl fullWidth sx={{ marginTop: 2 }}>
                        <InputLabel>Category Type</InputLabel>
                        <Select label="Category Type" labelId="typeID" value={newCategoryType} fullWidth onChange={handleCategoryTypeChange}>
                            <MenuItem value="Expense">Expense</MenuItem>
                            <MenuItem value="Income">Income</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        sx={{ display: "flex", justifyContent: "center" }}
                        fullWidth
                        control={<Checkbox />}
                        label="Apply to Entire Year"
                        onChange={handleAllMonthsChange}
                    />
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
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
        </Box>
    );
}

export default Budgets;
