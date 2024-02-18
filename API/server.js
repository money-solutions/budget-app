require('dotenv').config();
const express = require('express');
const session = require('express-session');
const loginRouter = require('./src/routes/login');

const app = express();

// Use express.json() as global middleware
app.use(express.json());

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true
  }));

// API Endpoints
app.use('/login', loginRouter);

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

module.exports = app;