const express = require("express");
const router = express.Router();

const basicAuth = require("../middleware/basicAuth");
const apiKeyAuth = require("../middleware/apiKeyAuth");



/**
 * @swagger
 * tags:
 *   name: Pings
 *   description: Vehicle location ping management
 */



module.exports = (data) => {



    /**
     * @swagger
     * /vehicles/{vehicleId}/pings:
     *   post:
     *     tags:
     *       - Pings
     *     summary: Create a vehicle location ping
     *     security:
     *       - apiKeyAuth: []
     *
     *     parameters:
     *       - in: path
     *         name: vehicleId
     *         required: true
     *         schema:
     *           type: integer
     *         example: 17
     *
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - latitude
     *               - longitude
     *               - speed
     *             properties:
     *               latitude:
     *                 type: number
     *                 example: 6.9271
     *               longitude:
     *                 type: number
     *                 example: 79.8612
     *               speed:
     *                 type: number
     *                 example: 40
     *
     *     responses:
     *       201:
     *         description: Ping created successfully
     *       400:
     *         description: Missing location data
     *       401:
     *         description: Missing API key
     *       403:
     *         description: Invalid API key
     *       404:
     *         description: Vehicle not found
     */


    router.post(
        "/vehicles/:vehicleId/pings",
        apiKeyAuth(data),
        (req,res)=>{


            const vehicle = data.vehicles.find(
                v => v.id == req.params.vehicleId
            );


            if(!vehicle){

                return res.status(404).json({
                    error:"Vehicle not found"
                });

            }



            const {
                latitude,
                longitude,
                speed
            } = req.body;



            if(
                latitude === undefined ||
                longitude === undefined ||
                speed === undefined
            ){

                return res.status(400).json({
                    error:"Missing location data"
                });

            }



            const ping = {

                id:"p-" + Date.now(),

                vehicle_id: vehicle.id,

                latitude,

                longitude,

                speed,

                timestamp:new Date().toISOString()

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






    /**
     * @swagger
     * /vehicles/{vehicleId}/pings:
     *   get:
     *     tags:
     *       - Pings
     *     summary: Get all pings of a vehicle
     *     security:
     *       - basicAuth: []
     *
     *     parameters:
     *       - in: path
     *         name: vehicleId
     *         required: true
     *         schema:
     *           type: integer
     *
     *     responses:
     *       200:
     *         description: List of pings
     *       404:
     *         description: Vehicle not found
     */


    router.get(
        "/vehicles/:vehicleId/pings",
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



            const pings = data.pings.filter(
                p => p.vehicle_id == req.params.vehicleId
            );



            res.json(pings);


        }
    );








    /**
     * @swagger
     * /vehicles/{vehicleId}/pings/{pingId}:
     *   get:
     *     tags:
     *       - Pings
     *     summary: Get one ping by ID
     *     security:
     *       - basicAuth: []
     *
     *     parameters:
     *       - in: path
     *         name: vehicleId
     *         required: true
     *         schema:
     *           type: integer
     *
     *       - in: path
     *         name: pingId
     *         required: true
     *         schema:
     *           type: string
     *
     *     responses:
     *       200:
     *         description: Ping found
     *       404:
     *         description: Ping not found
     */



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