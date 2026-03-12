require('dotenv').config()

const express = require('express')
const cors = require('cors')
require('./config/db')
const route=require('./routes/route')

const restaurantserver = express()

restaurantserver.use(cors())
restaurantserver.use(express.json())

restaurantserver.use(route)
restaurantserver.use("/uploads", express.static("uploads"))
// prefer environment variable for port, fall back to 3000
const PORT = process.env.PORT || 3001;

restaurantserver.get('/', (req, res) => {
    res.send("Welcome to restaurantserver");
});

restaurantserver.listen(PORT, () => {
    console.log(`restaurantserver running on port ${PORT}`);
});