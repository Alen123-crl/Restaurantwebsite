const express=require('express')
const route=express.Router()
const admincontroller=require('../controllers/AdminController')
const menucontroller=require('../controllers/MenuController')
const authMiddleware=require('../Middleware/AuthMiddleware')
const upload=require("../Middleware/UploadMiddleware")
const Openinghourscontrollers=require("../controllers/OpeninghoursControllers")
const SpecialHoursController=require('../controllers/SpecialHoursController')

//admin

route.post('/api/login',admincontroller.loginAdmin)
//admin -- add menu
route.post("/api/addmenu", authMiddleware, upload.single("image"), menucontroller.addMenu)
//get menu
route.get("/api/getmenu", menucontroller.getMenu)
//admin--edit menu
route.put("/api/editmenu/:id", authMiddleware, upload.single("image"), menucontroller.updateMenu)
//admin--delete menu
route.delete("/api/deletemenu/:id", authMiddleware, menucontroller.deleteMenu)

//opening hours

route.post("/api/createopening-hours", authMiddleware,Openinghourscontrollers.createOpeningHours)

route.get("/api/getopening-hours", Openinghourscontrollers.getOpeningHours)

route.put("/api/opening-hours/:id", authMiddleware,Openinghourscontrollers.updateOpeningHours)

//special hrs


route.post("/api/special-hours",authMiddleware,SpecialHoursController.createSpecialHours)

route.get("/api/getspecial-hours",SpecialHoursController.getSpecialHours)

module.exports=route