const express = require("express");
const router = express.Router();

const basicAuth = require("../middleware/basicAuth");


module.exports = (data)=>{


router.get("/", basicAuth, (req,res)=>{

    res.json(data.vehicles);

});


router.get("/:id", basicAuth, (req,res)=>{


    const vehicle = data.vehicles.find(
        v => v.id == req.params.id
    );


    if(!vehicle){

        return res.status(404).json({
            error:"Vehicle not found"
        });

    }


    res.json(vehicle);


});


return router;

};