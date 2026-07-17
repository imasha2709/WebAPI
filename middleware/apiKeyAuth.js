function apiKeyAuth(req,res,next){


    const data=req.app.locals.data;


    const vehicleId=req.params.vehicleId;



    const vehicle =
        data.vehicles.find(
            v=>v.id==vehicleId
        );


    if(!vehicle){

        return res.status(404).json({
            message:"Vehicle not found"
        });

    }



    const key=req.headers["x-api-key"];



    if(!key){

        return res.status(401).json({
            message:"API key required"
        });

    }



    const validKey =
        `key_${vehicleId}`;



    if(key!==validKey){

        return res.status(403).json({
            message:"Invalid API key"
        });

    }



    next();

}


module.exports=apiKeyAuth;