require('dotenv').config();
const express = require('express');
const session = require('express-session');
const addAccountRouter = require('./src/routes/addaccount');
const getAccountsRouter = require('./src/routes/getaccounts');
const userRouter = require('./src/routes/user');
const budgetRouter = require('./src/routes/budget');
const categoryRouter = require('./src/routes/category');
const cors = require('cors');

const app = express();
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

// Middleware function to log ALL incoming requests
function logRequests(req, res, next) {
    console.log(`Incoming Request: ${new Date().toISOString()} - ${req.method} ${req.url}`);
    next(); // Call the next middleware function
}
// Attach the middleware to your server
app.use(logRequests);

// Use express.json() as global middleware
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 } // 1 week in milliseconds
  }));

// API Endpoints
app.use('/api/addAccount', addAccountRouter);
app.use('/api/getAccounts', getAccountsRouter);
app.use('/api/user', userRouter);
app.use('/api/budget', budgetRouter);
app.use('/api/category', categoryRouter);


app.get('/status', async (req, res) => {
    const status = {
        "Status": "Running"
    };
    res.send(status);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app; // For running tests