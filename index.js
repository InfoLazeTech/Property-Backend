const express = require('express');
const mongoose  = require('mongoose');
const cors = require("cors");
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors());
const properties= require('./routes/property.route')


const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.get('/', (req, res) => {
    res.send('Hello Backend')
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
})

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected....");
    }).catch((err) => {
        console.log('❌ MongoDB Connection Error: ', err);
    });
app.use('/api',properties)