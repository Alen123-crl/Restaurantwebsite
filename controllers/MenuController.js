const Menu=require('../models/Menu')

exports.addMenu = async (req, res) => {

    console.log("inside add menu function")

    const { name, description, price, category} = req.body
 const image = req.file ? req.file.filename : null
    try {

        const existingMenu = await Menu.findOne({ name })

        if (existingMenu) {
            res.status(402).json("menu item already exists")
        }
        else {

            const newMenu = new Menu({
                name,
                description,
                price,
                category,
                image
            })

            await newMenu.save()

            res.status(200).json({
                message: "menu added successfully",
                newMenu
            })
        }

    } catch (err) {

        res.status(500).json(err)

    }

}

exports.getMenu = async (req, res) => {
    console.log("inside get menu")

    try {

        const menu = await Menu.find()

        res.status(200).json(menu)

    } catch (err) {

        res.status(500).json(err)

    }
}

exports.updateMenu = async (req,res)=>{

 const {id} = req.params

 const {name,description,price,category} = req.body

 const image = req.file ? req.file.filename : null

 try{

   const updateData = {
     name,
     description,
     price,
     category
   }

   if(image){
     updateData.image = image
   }

   const updatedMenu = await Menu.findByIdAndUpdate(
     id,
     updateData,
     {new:true}
   )

   res.status(200).json({message:"updated successfully",updatedMenu})

 }catch(err){

   res.status(500).json(err)

 }
}
exports.deleteMenu = async (req,res)=>{

 const {id} = req.params

 try{

   await Menu.findByIdAndDelete(id)

   res.status(200).json("Menu deleted")

 }catch(err){

   res.status(500).json(err)

 }

}