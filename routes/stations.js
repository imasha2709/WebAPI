const express=require("express");

const router=express.Router();

const basicAuth=require("../middleware/basicAuth");


module.exports=(data)=>{


router.get("/",basicAuth,(req,res)=>{

res.json(data.stations);

});


router.get("/:id",basicAuth,(req,res)=>{


const s=data.stations.find(
x=>x.id==req.params.id
);


if(!s){

return res.status(404).json({
error:"Station not found"
});

}


res.json(s);


});


return router;

};