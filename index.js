const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());


// Load seed.json ONCE
const data = JSON.parse(
    fs.readFileSync("./seed.json", "utf8")
);


// Helper function - latest ping
function getLastPing(vehicleId) {

    const pings = data.pings
        .filter(p => p.vehicle_id == vehicleId)
        .sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );

    if (pings.length === 0) {
        return null;
    }

    const ping = pings[0];

    return {
        ping_id: ping.id,
        vehicle_id: ping.vehicle_id,
        timestamp: ping.timestamp,
        lat: ping.latitude,
        lng: ping.longitude,
        speed: ping.speed || 0
    };
}


// Home
app.get("/", (req,res)=>{
    res.json({
        status:"ok",
        session:"NB6007CEM S5"
    });
});


// ---------------- PROVINCES ----------------

app.get("/provinces",(req,res)=>{

    const provinces = data.provinces.map(p=>({
        province_id:p.id,
        name:p.name
    }));

    res.json(provinces);
});


app.get("/provinces/:provinceId",(req,res)=>{

    const p = data.provinces.find(
        x=>x.id == req.params.provinceId
    );

    if(!p){
        return res.status(404).json({
            message:"Province not found"
        });
    }

    res.json({
        province_id:p.id,
        name:p.name
    });
});


// ---------------- DISTRICTS ----------------


app.get("/districts",(req,res)=>{

    const districts=data.districts.map(d=>({
        district_id:d.id,
        name:d.name,
        province_id:d.province_id
    }));

    res.json(districts);
});


app.get("/districts/:districtId",(req,res)=>{

    const d=data.districts.find(
        x=>x.id==req.params.districtId
    );

    if(!d){
        return res.status(404).json({
            message:"District not found"
        });
    }

    res.json({
        district_id:d.id,
        name:d.name,
        province_id:d.province_id
    });

});


// ---------------- STATIONS ----------------


app.get("/stations",(req,res)=>{

    const stations=data.stations.map(s=>({
        station_id:s.id,
        name:s.name,
        district_id:s.district_id
    }));

    res.json(stations);

});


app.get("/stations/:stationId",(req,res)=>{

    const s=data.stations.find(
        x=>x.id==req.params.stationId
    );

    if(!s){
        return res.status(404).json({
            message:"Station not found"
        });
    }


    res.json({
        station_id:s.id,
        name:s.name,
        district_id:s.district_id
    });

});


// ---------------- VEHICLES ----------------


app.get("/vehicles",(req,res)=>{

    const vehicles=data.vehicles.map(v=>({

        vehicle_id:v.id,
        reg_number:v.registration_number,
        device_id:v.device_id,
        station_id:v.station_id

    }));

    res.json(vehicles);

});


// Vehicle Composite
app.get("/vehicles/:vehicleId",(req,res)=>{


    const v=data.vehicles.find(
        x=>x.id==req.params.vehicleId
    );


    if(!v){
        return res.status(404).json({
            message:"Vehicle not found"
        });
    }


    res.json({

        vehicle_id:v.id,
        reg_number:v.registration_number,
        device_id:v.device_id,
        station_id:v.station_id,

        last_ping:getLastPing(v.id)

    });


});



// Vehicle pings

app.get("/vehicles/:vehicleId/pings",(req,res)=>{


    const pings=data.pings
        .filter(
            p=>p.vehicle_id==req.params.vehicleId
        )
        .map(p=>({

            ping_id:p.id,
            vehicle_id:p.vehicle_id,
            timestamp:p.timestamp,
            lat:p.latitude,
            lng:p.longitude,
            speed:p.speed || 0

        }));


    res.json(pings);

});



// Last Position

app.get("/vehicles/:vehicleId/last-position",(req,res)=>{


    const lastPing=getLastPing(req.params.vehicleId);


    if(!lastPing){

        return res.status(404).json({
            message:"No location found"
        });

    }


    res.json({

        vehicle_id:lastPing.vehicle_id,
        timestamp:lastPing.timestamp,
        lat:lastPing.lat,
        lng:lastPing.lng,
        speed:lastPing.speed

    });


});



// Start server

const PORT=process.env.PORT || 3000;


app.listen(PORT,()=>{
    console.log(`Server running on ${PORT}`);
});