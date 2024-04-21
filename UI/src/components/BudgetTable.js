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

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

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
                                        <TableCell>Date</TableCell>
                                        <TableCell>Account</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.transactions.map((transactionRow) => (
                                        <TableRow key={transactionRow.transactionid}>
                                            <TableCell component="th" scope="row">
                                                {transactionRow.datetransacted}
                                            </TableCell>
                                            <TableCell>{transactionRow.nickname}</TableCell>
                                            <TableCell align="right">{transactionRow.description}</TableCell>
                                            <TableCell align="right">{transactionRow.amount}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    // row: PropTypes.shape({
    //     calories: PropTypes.number.isRequired,
    //     carbs: PropTypes.number.isRequired,
    //     fat: PropTypes.number.isRequired,
    //     history: PropTypes.arrayOf(
    //         PropTypes.shape({
    //             amount: PropTypes.number.isRequired,
    //             customerId: PropTypes.string.isRequired,
    //             date: PropTypes.string.isRequired,
    //         })
    //     ).isRequired,
    //     name: PropTypes.string.isRequired,
    //     price: PropTypes.number.isRequired,
    //     protein: PropTypes.number.isRequired,
    // }).isRequired,
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
    const rows = props.rows.categories;
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <Row key={row.categoryname} row={row} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
