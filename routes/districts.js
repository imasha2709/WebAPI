const express=require("express");

const router=express.Router();

const basicAuth=require("../middleware/basicAuth");


module.exports=(data)=>{


router.get("/",basicAuth,(req,res)=>{


res.json(data.districts);


});


router.get("/:id",basicAuth,(req,res)=>{


const d=data.districts.find(
x=>x.id==req.params.id
);


if(!d){

return res.status(404).json({
error:"District not found"
});

}


res.json(d);


});


return router;

};