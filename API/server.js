require('dotenv/config'); 
const express = require('express');
const db = require('./db');
const userRouter = require('./routes/userRoutes');

const app = express();
app.use(express.json());

app.use('/user', userRouter);

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM Users');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('<h1>Internal Service Error</h1>');
    }
});

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