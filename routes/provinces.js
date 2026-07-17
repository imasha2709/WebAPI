const express=require("express");

const router=express.Router();

const basicAuth=require("../middleware/basicAuth");


module.exports=(data)=>{


router.get("/",basicAuth,(req,res)=>{

    res.json(
        data.provinces.map(p=>({
            province_id:p.id,
            name:p.name
        }))
    );

});


router.get("/:id",basicAuth,(req,res)=>{


const p=data.provinces.find(
    x=>x.id==req.params.id
);


if(!p){

return res.status(404).json({
    error:"Province not found"
});

}


res.json(p);


});


return router;

};