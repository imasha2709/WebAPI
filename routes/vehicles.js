const express = require("express");
const router = express.Router();
const basicAuth = require("../middleware/basicAuth");

module.exports = (data) => {

    // GET all vehicles
    // GET /vehicles
    router.get("/", basicAuth, (req, res) => {

        res.json(data.vehicles);

    });


    // GET vehicle by ID
    // GET /vehicles/:id
    router.get("/:id", basicAuth, (req, res) => {

        const vehicle = data.vehicles.find(
            v => v.id == req.params.id
        );


        if (!vehicle) {
            return res.status(404).json({
                error: "Vehicle not found"
            });
        }


        res.json(vehicle);

    });



    // CREATE vehicle
    // POST /vehicles
    router.post("/", basicAuth, (req, res) => {

        const {
            id,
            registration_number,
            device_id,
            station_id
        } = req.body;


        if (
            !id ||
            !registration_number ||
            !device_id ||
            !station_id
        ) {

            return res.status(400).json({
                error: "Missing required fields: id, registration_number, device_id, station_id"
            });

        }



        const exists = data.vehicles.some(
            v => v.id == id
        );


        if (exists) {

            return res.status(409).json({
                error: "Vehicle ID already exists"
            });

        }



        const newVehicle = {

            id,
            registration_number,
            device_id,
            station_id

        };


        data.vehicles.push(newVehicle);



        res.status(201)
            .location(`/vehicles/${id}`)
            .json(newVehicle);

    });




    // UPDATE vehicle
    // PUT /vehicles/:id
    router.put("/:id", basicAuth, (req, res) => {


        const vehicleIndex = data.vehicles.findIndex(
            v => v.id == req.params.id
        );



        if (vehicleIndex === -1) {

            return res.status(404).json({
                error: "Vehicle not found"
            });

        }



        const {
            registration_number,
            device_id,
            station_id
        } = req.body;



        if (
            !registration_number ||
            !device_id ||
            !station_id
        ) {

            return res.status(400).json({
                error: "Missing required fields"
            });

        }



        data.vehicles[vehicleIndex] = {

            id: Number(req.params.id),
            registration_number,
            device_id,
            station_id

        };



        res.json(data.vehicles[vehicleIndex]);

    });





    // DELETE vehicle
    // DELETE /vehicles/:id
    router.delete("/:id", basicAuth, (req, res) => {


        const vehicleIndex = data.vehicles.findIndex(
            v => v.id == req.params.id
        );



        if (vehicleIndex === -1) {

            return res.status(404).json({
                error: "Vehicle not found"
            });

        }



        data.vehicles.splice(vehicleIndex, 1);



        res.json({

            message:
            "Vehicle deleted successfully. Historical pings preserved."

        });


    });



    return router;

};