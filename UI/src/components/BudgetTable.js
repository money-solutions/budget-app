import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import { InputLabel, FormHelperText, FormControl, OutlinedInput, InputAdornment, FormControlLabel, Checkbox } from "@mui/material";
import axiosInstance from "@/config/axiosConfig";

function Row(props) {
    const { row, message, setMessage, openError, setOpenError } = props;

    const [open, setOpen] = React.useState(false);

    const [editCategoryModal, setEditCategoryModal] = React.useState(false);
    const[editCategoryName, setEditCategoryName] = React.useState("");
    const [editCategoryAmount, setEditCategoryAmount] = React.useState("");
    const [editCategoryFieldChanged, setEditCategoryFieldChanged] = React.useState(false);
    const [editCategoryID, setEditCategoryID] = React.useState(null);

    const handleCloseEditCategoryModal = () => {
        setEditCategoryName("");
        setEditCategoryAmount("");
        setEditCategoryFieldChanged(false);
        setEditCategoryModal(false);
        setEditCategoryID(null);
    };

    const handleOpenEditCategoryModal = (row) => {
        setEditCategoryName(row.categoryname);
        setEditCategoryAmount(row.budgetamount);
        setEditCategoryID(row.categoryid);
        setEditCategoryModal(true);
    };

    const handleDeleteCategory = async (categoryid) => {
        try {
            const response = await axiosInstance.delete("/category", { data: { categoryid } });
            console.log("Category deleted successfully");
        } catch (error) {
            console.error("Error deleting Category: ", error);
            const message = "There was an error. Please try again.";
            setMessage(message);
            setOpenError(true);
        }
    };

    const handleEditCategoryNameChange = (e) => {
        setEditCategoryFieldChanged(true);
        setEditCategoryName(e.target.value);
    };

    const handleEditCategoryAmountChange = (e) => {
        setEditCategoryFieldChanged(true);
        setEditCategoryAmount(e.target.value);
    };

    const handleEditCategory = async () => {
        try {
            const response = await axiosInstance.put("/category", { categoryid: editCategoryID, categoryname: editCategoryName, amount: editCategoryAmount });
            console.log("PUT request successful: ", response.data);
            // await getTransactions();
            handleCloseEditCategoryModal();
        } catch (error) {
            console.error("Error: ", error);
            const message = "There was an error. Please try again.";
            setMessage(message);
            setOpenError(true);
        }
    };

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    {row.categoryname}
                </TableCell>
                <TableCell>$ {Number(row.budgetamount).toFixed(2)}</TableCell>
                <TableCell>$ {row.actualamount ? Number(row.actualamount).toFixed(2) : (0).toFixed(2)}</TableCell>
                <TableCell>$ {(Number(row.budgetamount) - Number(row.actualamount)).toFixed(2)}</TableCell>
                <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleOpenEditCategoryModal(row)}>
                        Edit
                    </Button>
                </TableCell>
                <TableCell>
                    <Button variant="contained" style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDeleteCategory(row.categoryid)}>
                        Delete
                    </Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Category Transactions
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>Date</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }}>Account</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }}>Description</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.transactions.map((transactionRow) => (
                                        <TableRow key={transactionRow.transactionid}>
                                            <TableCell component="th" scope="row">
                                                {new Date(transactionRow.datetransacted).toLocaleDateString(undefined, { year: "numeric", month: "numeric", day: "numeric" })}
                                            </TableCell>
                                            <TableCell>{transactionRow.nickname}</TableCell>
                                            <TableCell>{transactionRow.description}</TableCell>
                                            <TableCell>$ {Number(transactionRow.amount).toFixed(2)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <Modal open={editCategoryModal} onClose={handleCloseEditCategoryModal}>
                <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 4, width: "35%" }}>
                    <Typography variant="h6" gutterBottom>
                        Edit Category:
                    </Typography>
                    <TextField required label="Category Name" fullWidth value={editCategoryName} onChange={handleEditCategoryNameChange} sx={{ mb: 2, marginTop: 1 }} />

                    <FormControl fullWidth>
                        <InputLabel>Category Amount</InputLabel>
                        <OutlinedInput
                            fullWidth
                            value={editCategoryAmount}
                            onChange={handleEditCategoryAmountChange}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                            required
                            label="Category Amount"
                        />
                    </FormControl>
                    
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2}}>
                        <Button
                            disabled={!(editCategoryFieldChanged)}
                            variant="contained"
                            onClick={handleEditCategory}
                            sx={{ bgcolor: "green", color: "white" }}
                        >
                            Update Category
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.shape({
        actualamount: PropTypes.string.isRequired,
        budgetamount: PropTypes.string.isRequired,
        budgetid: PropTypes.number.isRequired,
        categoryid: PropTypes.number.isRequired,
        categoryname: PropTypes.string.isRequired,
        categorytype: PropTypes.string.isRequired,
        transactions: PropTypes.arrayOf(
            PropTypes.shape({
                amount: PropTypes.string.isRequired,
                categoryid: PropTypes.number.isRequired,
                currency: PropTypes.string.isRequired,
                dateposted: PropTypes.string.isRequired,
                datetransacted: PropTypes.string.isRequired,
                description: PropTypes.string.isRequired,
                nickname: PropTypes.string.isRequired,
                transactionid: PropTypes.number.isRequired,
            })
        ),
    }).isRequired,
};

export default function BudgetTable(props) {
    const {rows, message, setMessage, openError, setOpenError} = props;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell style={{ fontWeight: "bold" }}>Category Name</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Budget Amount</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Spent Amount</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Amount Difference</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Edit</TableCell>
                        <TableCell style={{ fontWeight: "bold" }}>Delete</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.categoryname} row={row} message={message} setMessage={setMessage} setOpenError={setOpenError} openError={openError}/>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
