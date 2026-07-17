const express = require("express");
const router = express.Router();

const basicAuth = require("../middleware/basicAuth");
const apiKeyAuth = require("../middleware/apiKeyAuth");


module.exports = (data) => {


    // POST /vehicles/:vehicleId/pings
    router.post(
        "/vehicles/:vehicleId/pings",
        apiKeyAuth(data),
        (req, res) => {


            const vehicle = data.vehicles.find(
                v => v.id == req.params.vehicleId
            );


            if (!vehicle) {

                return res.status(404).json({
                    error: "Vehicle not found"
                });

            }



            const {
                latitude,
                longitude,
                speed
            } = req.body;



            if (
                latitude === undefined ||
                longitude === undefined ||
                speed === undefined
            ) {

                return res.status(400).json({
                    error: "Missing location data"
                });

            }



            const ping = {

                id: "p-" + Date.now(),

                vehicle_id: vehicle.id,

                latitude,

                longitude,

                speed,

                timestamp: new Date().toISOString()

            };



            data.pings.push(ping);



            res
                .status(201)
                .location(
                    `/vehicles/${vehicle.id}/pings/${ping.id}`
                )
                .set(
                    "ETag",
                    `"${ping.id}"`
                )
                .set(
                    "Last-Modified",
                    ping.timestamp
                )
                .json(ping);


        }
    );





    // GET all vehicle pings
    // GET /vehicles/:vehicleId/pings
    router.get(
        "/vehicles/:vehicleId/pings",
        basicAuth,
        (req, res) => {


            const vehicle = data.vehicles.find(
                v => v.id == req.params.vehicleId
            );



            if (!vehicle) {

                return res.status(404).json({
                    error:"Vehicle not found"
                });

            }



            const pings = data.pings.filter(
                p => p.vehicle_id == req.params.vehicleId
            );



            res.json(pings);


        }
    );






    // GET single ping
    // GET /vehicles/:vehicleId/pings/:pingId
    router.get(
        "/vehicles/:vehicleId/pings/:pingId",
        basicAuth,
        (req,res)=>{


            const vehicle = data.vehicles.find(
                v => v.id == req.params.vehicleId
            );



            if(!vehicle){

                return res.status(404).json({
                    error:"Vehicle not found"
                });

            }




            const ping = data.pings.find(
                p =>
                p.vehicle_id == req.params.vehicleId &&
                p.id == req.params.pingId
            );



            if(!ping){

                return res.status(404).json({
                    error:"Ping not found"
                });

            }



            res.json(ping);


        }
    );



    return router;

};