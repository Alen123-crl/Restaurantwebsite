const SpecialHours = require("../models/SpecialHours")

exports.createSpecialHours = async (req,res)=>{

 const {date,open,close,isClosed,note} = req.body

 try{

  const today = new Date()
  const selectedDate = new Date(date)

  // ❌ past date validation
  if(selectedDate < today){
   return res.status(400).json("Past date cannot be added")
  }

  // ❌ duplicate date validation
  const existing = await SpecialHours.findOne({date})

  if(existing){
   return res.status(400).json("Special hours already added for this date")
  }

  const newSpecial = new SpecialHours({
   date,
   open,
   close,
   isClosed,
   note
  })

  await newSpecial.save()

  res.status(201).json(newSpecial)

 }catch(err){

  res.status(500).json(err)

 }

}

exports.getSpecialHours = async (req,res)=>{

 try{

  const data = await SpecialHours.find()

 res.status(200).json(data)

 }catch(err){

  res.status(500).json(err)

 }

}


exports.updateSpecialHours = async (req,res)=>{

 const {id} = req.params
 const {open,close,isClosed,note} = req.body

 try{

  const updated = await SpecialHours.findByIdAndUpdate(
   id,
   {open,close,isClosed,note},
   {new:true}
  )

  res.status(200).json(updated)

 }catch(err){

  res.status(500).json(err)

 }

}