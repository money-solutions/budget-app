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
import Paper from "@mui/material/Paper";

function Transactions() {
    const [transactionsData, setTransactionsData] = React.useState([]);
    const [accountsData, setAccountsData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [editOpen, setEditOpen] = React.useState(false);
    const [currentTransaction, setCurrentTransaction] = React.useState(null);
    const [account, setAccount] = React.useState(null);
    const [accountid, setId] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [currency, setCurrency] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [type, setType] = React.useState("");
    const [transactionDate, setTransactionDate] = React.useState(new Date());
    const [message, setMessage] = React.useState("");
    const [allCategoriesMap, setAllCategoriesMap] = React.useState(null);

    const handleOpenModal = () => {
        getAccounts();
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
    };

    const handleOpenEditModal = (transaction) => {
        setCurrentTransaction(transaction.transactionid);
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setCurrency(transaction.currency);
        setTransactionDate(transaction.datetransacted);
        setCategory(transaction.categoryid);
        setAccount(transaction.accountid);
        setEditOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditOpen(false);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleCurrencyChange = (e) => {
        setCurrency(e.target.value);
    };

    const handleTransactionDateChange = (date) => {
        setTransactionDate(date);
    };

    const handleAccountChange = (e) => {
        setAccount(e.target.value);
        setId(e.target.value.accountid);
    };

    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
    };

    const getTransactions = async () => {
        try {
            const response = await axiosInstance.get("/transaction");
            setTransactionsData(response.data.transactions);
            console.log(response.data.transactions);
        } catch (error) {
            console.error("Error getting transactions associated with user: ", error);
        }
    };

    const getAccounts = async () => {
        try {
            const response = await axiosInstance.get("/account");
            setAccountsData(response.data.accounts);
            console.log(response.data.accounts);
        } catch (error) {
            console.error("Error getting accounts associated with user: ", error);
        }
    };

    const getCategories = async () => {
        try {
            const response = await axiosInstance.get("/category");
            console.log(response);
            const categoriesMap = response.data.categoriesMap;
            setAllCategoriesMap(categoriesMap);
        } catch (error) {
            console.error("Error getting categories associated with user: ", error);
        }
    };

    React.useEffect(() => {
        getTransactions();
        getCategories();
    }, []);

    const [, forceUpdate] = React.useState();

    const forceReRender = () => {
        forceUpdate((s) => !s); // Toggle state to force re-render
    };

    React.useEffect(() => {
        if (allCategoriesMap) {
            forceReRender(); // Force re-render when allCategoriesMap is updated
            console.log(allCategoriesMap);
        }
    }, [allCategoriesMap]);

    const handleAddTransaction = async () => {
        try {
            const response = await axiosInstance.post("/transaction", { description, amount, currency, transactionDate, category, accountid });
            console.log("POST request successful: ", response.data);
            await getTransactions();
            handleCloseModal();
        } catch (error) {
            console.error("Error: ", error);
            const message = " Please try again.";
            setMessage(message);
            setOpen(true);
        }
    };

    const handleEditTransaction = async () => {
        try {
            const response = await axiosInstance.put("/transaction", { currentTransaction, description, amount, currency });
            console.log("PUT request successful: ", response.data);
            await getTransactions();
            handleCloseEditModal();
        } catch (error) {
            console.error("Error: ", error);
            const message = " Please try again.";
            setMessage(message);
            setEditOpen(true);
        }
    };

    const handleDelete = async (transactionid) => {
        try {
            const response = await axiosInstance.delete("/transaction", { data: { transactionid } });
            console.log("Transaction deleted successfully");
            await getTransactions();
        } catch (error) {
            console.error("Error deleting transaction: ", error);
        }
    };

    const handleCategorySelectedChange = async (transactionid, e) => {
        const categoryid = e.target.value != "None" ? e.target.value : null;
        console.log(categoryid);

        try {
            const response = await axiosInstance.put("/transaction/category", { transactionid, categoryid });
            console.log("PUT request successful: ", response.data);
            await getTransactions();
        } catch (error) {
            console.error("Error: ", error);
            const message = " Please try again.";
            setMessage(message);
            setEditOpen(true);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ display: "flex", flexDirection: "row", gap: 45, marginBottom: 3 }}>
                <Typography variant="h5">My Transactions:</Typography>
                <Button variant="contained" onClick={handleOpenModal} sx={{ bgcolor: "green", color: "white", marginLeft: "auto" }}>
                    Add Transaction
                </Button>
            </Box>

            {transactionsData.length > 0 && allCategoriesMap ? (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Currency</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Transaction Date</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Category</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Account</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Edit</TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactionsData.map((transaction) => (
                                <TableRow key={transaction.transactionid}>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell sx={Number(transaction.amount) < 0 ? { color: "red" } : { color: "green" }}>{`$ ${Math.abs(Number(transaction.amount)).toFixed(
                                        2
                                    )}`}</TableCell>
                                    <TableCell>{transaction.currency}</TableCell>
                                    <TableCell>
                                        {new Date(transaction.datetransacted).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" })}
                                    </TableCell>
                                    <TableCell align="left">
                                        <FormControl variant="standard" sx={{ minWidth: 125 }}>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={transaction.categoryid || "None"}
                                                onChange={(e) => handleCategorySelectedChange(transaction.transactionid, e)}
                                            >
                                                <MenuItem value="None">
                                                    <em>None</em>
                                                </MenuItem>
                                                {allCategoriesMap
                                                    ? allCategoriesMap[new Date(transaction.datetransacted).toISOString().substring(0, 7)]?.map((category) => (
                                                          <MenuItem key={category.categoryid} value={category.categoryid}>
                                                              {category.categoryname}
                                                          </MenuItem>
                                                      ))
                                                    : null}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>{transaction.nickname}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary" onClick={() => handleOpenEditModal(transaction)}>
                                            Edit
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="contained" style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDelete(transaction.transactionid)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography>No Transactions Found</Typography>
            )}

            <Modal open={open} onClose={handleCloseModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Add A Transaction:
                    </Typography>
                    <TextField required label="Description" fullWidth onChange={handleDescriptionChange} sx={{ mb: 2 }} />
                    <TextField label="Amount" fullWidth onChange={handleAmountChange} sx={{ mb: 2 }} />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Currency</InputLabel>
                        <Select label="Currency" labelId="typeID" value={currency} fullWidth onChange={handleCurrencyChange}>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="YEN">YEN</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        id="transaction-date"
                        label="Transaction Date"
                        type="date"
                        fullWidth
                        defaultValue={transactionDate}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => handleTransactionDateChange(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Account</InputLabel>
                        <Select label="Account" labelId="accountID" value={account} fullWidth onChange={handleAccountChange}>
                            {accountsData.map((account) => (
                                <MenuItem value={account}>{account.nickname}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={handleAddTransaction} sx={{ bgcolor: "green", color: "white" }}>
                            Add
                        </Button>
                    </Box>
                </Box>
            </Modal>

            <Modal open={editOpen} onClose={handleCloseEditModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Edit Transaction:
                    </Typography>
                    <TextField required label="Description" fullWidth value={description} onChange={handleDescriptionChange} sx={{ mb: 2 }} />
                    <TextField label="Amount" fullWidth value={amount} onChange={handleAmountChange} sx={{ mb: 2 }} />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Currency</InputLabel>
                        <Select label="Currency" labelId="typeID" value={currency} fullWidth onChange={handleCurrencyChange}>
                            <MenuItem value="USD">USD</MenuItem>
                            <MenuItem value="EUR">EUR</MenuItem>
                            <MenuItem value="YEN">YEN</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button variant="contained" onClick={handleEditTransaction} sx={{ bgcolor: "blue", color: "white" }}>
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
}

export default Transactions;
