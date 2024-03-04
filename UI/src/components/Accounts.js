import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { InputLabel } from '@mui/material';
import axiosInstance from '@/config/axiosConfig';
import { Router } from 'next/router';
import axios from 'axios';

function Accounts() {
  const [accountsData, setAccountsData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('');
  const [bank, setBank] = React.useState('');
  const [type, setType] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
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
    try
    {
      const response = await axiosInstance.get('/getAccounts');
      console.log(response.data.accounts);
      setAccountsData(response.data.accounts);
      console.log(accountsData);
    } catch(error) {
      console.error("Error getting accounts associated with user: ", error);
    }
  }

  React.useEffect(() => {
    getAccounts();
  }, []);

  const handleAddAccount = async () => {
    try 
    {
      const response = await axiosInstance.post('/addaccount', {name, bank, type});
      console.log('POST request successful: ', response.data);
      getAccounts();
      handleCloseModal();
    } catch(error) {
      console.error("Error: ", error);
      const message = error.response.data.message + " Please try again."
      setMessage(message);
      setOpen(true);
    }
  };

  const mapTypeToString = (type) => {
    return type === 1 ? 'Checkings' : 'Savings';
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        My Accounts
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button variant="contained" onClick={handleOpenModal} sx={{ bgcolor: 'green', color: 'white' }}>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {accountsData.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.nickname}</TableCell>
                  <TableCell>{account.bank}</TableCell>
                  <TableCell>{mapTypeToString(account.accounttype)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Loading...</Typography>
      )}

      <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, minWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            Add Account
          </Typography>
          <TextField
            required
            label="Name"
            fullWidth
            onChange={handleNameChange}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Bank"
            fullWidth
            onChange={handleBankChange}
            sx={{ mb: 4 }}
          />
          <InputLabel id="type">Type of Account</InputLabel>
          <Select
            label="Type of Account"
            labelId="type"
            fullWidth
            onChange={handleTypeChange}
            sx={{ mb: 2 }}
          >
            <MenuItem value={1}>Checkings</MenuItem>
            <MenuItem value={2}>Savings</MenuItem>
          </Select>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="contained" onClick={handleAddAccount} sx={{ bgcolor: 'green', color: 'white' }}>
              Add
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default Accounts;