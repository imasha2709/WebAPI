module.exports = (data)=>{


    return (req,res,next)=>{


        const apiKey =
            req.headers["x-api-key"];



        const vehicle =
            data.vehicles.find(
                v => v.id == req.params.vehicleId
            );



        if(!vehicle){

            return res.status(404).json({

                error:"Vehicle not found"

            });

        }



        // Missing key

        if(!apiKey){

            return res.status(401).json({

                error:"API key required"

            });

        }



        // Wrong key

        if(apiKey !== vehicle.device_id){

            return res.status(403).json({

                error:"Forbidden: Invalid API key for this vehicle"

            });

        }



        next();

    };


};