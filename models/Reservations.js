const mongoose = require("mongoose")

const reservationSchema = new mongoose.Schema({

 name:String,
 phone:String,
date: { type: Date, required: true },
 slot:String,
 guests:Number

})

module.exports = mongoose.model("Reservation",reservationSchema)