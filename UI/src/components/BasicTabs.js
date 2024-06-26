'use client'

import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Accounts from './Accounts';
import Transactions from './Transactions';
import Budgets from './Budgets';
import UserInfo from './UserInfo';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
      <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                  <Tab label="Budgets" {...a11yProps(0)} />
                  <Tab label="Transactions" {...a11yProps(1)} />
                  <Tab label="Accounts" {...a11yProps(2)} />
                  <Tab label="My Profile" {...a11yProps(3)} />
              </Tabs>
          </Box>
          {value === 0 && (
              <Box sx={{ p: 3 }}>
                  <Budgets />
              </Box>
          )}
          {value === 1 && (
              <Box sx={{ p: 3 }}>
                  <Transactions />
              </Box>
          )}
          {value === 2 && (
              <Box sx={{ p: 3 }}>
                  <Accounts />
              </Box>
          )}
          {value === 3 && (
              <Box sx={{ p: 3 }}>
                  <UserInfo />
              </Box>
          )}
      </Box>
  );

}