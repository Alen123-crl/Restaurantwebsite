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
const PORT = 3000 || process.env.PORT

restaurantserver.get('/',(req,res)=>{
    res.send("Welcome to restaurantserver")
})

restaurantserver.listen(3000,()=>{
    console.log(`restaurantserver running on the port ${PORT}`);
    
})