function apiKeyAuth(req,res,next){


    const vehicleId=req.params.vehicleId;


    const key=req.headers["x-api-key"];


    if(!key){

        return res.status(401).json({
            message:"API key required"
        });

    }


    const deviceKeys={

        "v-01":"key_v01",
        "v-02":"key_v02",
        "v-03":"key_v03"

    };


    if(deviceKeys[vehicleId] !== key){

        return res.status(403).json({
            message:"Invalid API key"
        });

    }


    next();

}


module.exports=apiKeyAuth;