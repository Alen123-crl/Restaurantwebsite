const OpeningHours=require('../models/OpeningHours')
const Reservation=require('../models/Reservations')
const RestaurantConfig=require('../models/RestaurantConfiguration')
const SpecialHours=require('../models/SpecialHours')
exports.getAvailableSlots = async (req, res) => {
 try{
  const { date, guests } = req.query

  if(!date || !guests){
   return res.status(400).json({message:"Date and guests required"})
  }

  const today = new Date()
  today.setHours(0,0,0,0)
  const selectedDate = new Date(date)
  selectedDate.setHours(0,0,0,0)

  // ❌ Past date check
  if(selectedDate < today){
   return res.status(400).json({message:"Cannot book past dates"})
  }

  // 1️⃣ Check for special day (ignore time portion)
  const special = await SpecialHours.findOne({
    date: {
      $gte: selectedDate,
      $lt: new Date(selectedDate.getTime() + 24*60*60*1000) // next day
    }
  })

  let openTime, closeTime

  if(special){
   if(special.isClosed){
    return res.status(200).json({message:"No slots available"})
   }
   openTime = special.open
   closeTime = special.close
  } else {
   // fallback to normal opening hours
   const day = selectedDate.toLocaleString("en-US",{weekday:"long"})
   const hours = await OpeningHours.findOne({ day })
   if(!hours || !hours.isOpen){
    return res.status(200).json({message:"No slots available"})
   }
   openTime = hours.open
   closeTime = hours.close
  }

  // 2️⃣ Generate slots
  const config = await RestaurantConfig.findOne()
  const startHour = parseInt(openTime.split(":")[0])
  const endHour = parseInt(closeTime.split(":")[0])
  let slots = []

  for(let i=startHour;i<endHour;i++){
   const now = new Date()
   // ❌ Remove past time slots if today
   if(selectedDate.getTime() === today.getTime() && i <= now.getHours()){
    continue
   }
   slots.push(`${i}:00`)
  }

  // 3️⃣ Filter slots by remaining seats
 // Convert the query date to a Date object
const selectedDateObj = new Date(date);
selectedDateObj.setHours(0,0,0,0);

// Fetch all reservations for that date
const reservations = await Reservation.find({
  date: {
    $gte: selectedDateObj,
    $lt: new Date(selectedDateObj.getTime() + 24*60*60*1000)
  }
});
  const availableSlots = slots.filter(slot => {
   const bookedSeats = reservations
    .filter(r=>r.slot===slot)
    .reduce((sum,r)=>sum+r.guests,0)
   return bookedSeats + Number(guests) <= config.totalSeats
  })

  if(availableSlots.length === 0){
   return res.status(200).json({message:"No slots available"})
  }

  res.status(200).json({slots:availableSlots})

 }catch(err){
  console.error(err)
  res.status(500).json(err)
 }
}

//create reservation 

exports.createReservation = async (req, res) => {
 try {
  const { date, slot, guests } = req.body
  if(!date || !slot || !guests){
   return res.status(400).json({message:"Date, slot and guests are required"})
  }

  const today = new Date()
  today.setHours(0,0,0,0)
  const selectedDate = new Date(date)
  selectedDate.setHours(0,0,0,0)

  // ❌ Past date check
  if(selectedDate < today){
   return res.status(400).json({message:"Cannot book past dates"})
  }

  const now = new Date()
  // ❌ Block past time if today
  if(selectedDate.getTime() === today.getTime()){
   const slotHour = parseInt(slot.split(":")[0])
   if(slotHour <= now.getHours()){
    return res.status(400).json({message:"Cannot book past time slots"})
   }
  }

  // 1️⃣ Check if special day exists
  const special = await SpecialHours.findOne({ date: selectedDate })
  let isSlotValid = false
  let openTime, closeTime

  if(special){
   if(special.isClosed){
    return res.status(400).json({message:"Restaurant is closed on this special day"})
   }
   openTime = special.open
   closeTime = special.close
  } else {
   // fallback to normal opening hours
   const day = selectedDate.toLocaleString("en-US",{weekday:"long"})
   const hours = await OpeningHours.findOne({ day })
   if(!hours || !hours.isOpen){
    return res.status(400).json({message:"Restaurant is closed on this day"})
   }
   openTime = hours.open
   closeTime = hours.close
  }

  // ❌ Check if slot falls within open-close
  const slotHour = parseInt(slot.split(":")[0])
  const openHour = parseInt(openTime.split(":")[0])
  const closeHour = parseInt(closeTime.split(":")[0])

  if(slotHour < openHour || slotHour >= closeHour){
   return res.status(400).json({message:"Selected slot is outside working hours"})
  }

  // 2️⃣ Seat availability
  const config = await RestaurantConfig.findOne()
  const reservations = await Reservation.find({ date, slot })
  const bookedSeats = reservations.reduce((sum,r)=>sum+r.guests,0)

  if(bookedSeats + guests > config.totalSeats){
   return res.status(400).json({message:"Not enough seats available"})
  }

// 3️⃣ Create reservation (with proper Date type)
const reservation = new Reservation({
  ...req.body,
  date: new Date(req.body.date) // ✅ convert string to Date
})

const saved = await reservation.save()
res.status(201).json(saved)

 } catch(err){
  res.status(500).json(err)
 }
}

exports.getReservations = async (req, res) => {
  try {
    const { date, slot } = req.query; // optional filters
    let filter = {};

    // 1️⃣ Filter by date if provided
    if (date) {
      const selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      filter.date = {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24*60*60*1000),
      };
    }

    // 2️⃣ Filter by slot if provided
    if (slot) {
      filter.slot = slot;
    }

    // 3️⃣ Fetch reservations
    const reservations = await Reservation.find(filter).sort({ date: 1, slot: 1 });

    // 4️⃣ Fetch total seats from config
    const config = await RestaurantConfig.findOne();

    // 5️⃣ Group reservations by date + slot
    const grouped = {};
    reservations.forEach(r => {
      const key = `${r.date.toISOString().split("T")[0]}-${r.slot}`;
      if (!grouped[key]) grouped[key] = { slot: r.slot, date: r.date, booked: 0, reservations: [] };
      grouped[key].booked += r.guests;
      grouped[key].reservations.push(r);
    });

    // 6️⃣ Calculate remaining seats
    const result = Object.values(grouped).map(g => ({
      ...g,
      remainingSeats: config.totalSeats - g.booked,
    }));

    // 7️⃣ Send response
    res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err });
  }
};