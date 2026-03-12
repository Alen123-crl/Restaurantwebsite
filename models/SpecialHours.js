const mongoose = require("mongoose")

const specialHoursSchema = new mongoose.Schema({

 date:{
  type:Date,
  required:true,
  unique:true
 },

 open:{
  type:String
 },

 close:{
  type:String
 },

 isClosed:{
  type:Boolean,
  default:false
 },

 note:{
  type:String
 }

},{timestamps:true})

module.exports = mongoose.model("SpecialHours",specialHoursSchema)