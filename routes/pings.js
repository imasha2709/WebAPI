const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());


// Load database
const data = JSON.parse(
    fs.readFileSync("./seed.json","utf8")
);


// Make data available
app.locals.data = data;



// Middleware
const basicAuth = require("./middleware/basicAuth");


// Routes

const provinceRoutes = require("./routes/provinces");
const districtRoutes = require("./routes/districts");
const stationRoutes = require("./routes/stations");
const vehicleRoutes = require("./routes/vehicles");
const pingRoutes = require("./routes/pings");



// Home

app.get("/",(req,res)=>{

    res.json({
        status:"ok",
        session:"TUKTUK-MONITORING-API"
    });

});



// Protected GET routes

app.use("/provinces",basicAuth,provinceRoutes);

app.use("/districts",basicAuth,districtRoutes);

app.use("/stations",basicAuth,stationRoutes);

app.use("/vehicles",basicAuth,vehicleRoutes);



// Ping write route
// NOT Basic Auth
app.use("/vehicles",pingRoutes);





const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});