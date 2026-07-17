const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

// Load seed.json ONCE at startup
const data = JSON.parse(
    fs.readFileSync("./seed.json", "utf8")
);

// Home Route
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        session: "tuktuk-monitoring-api"
    });
});

// Provinces
app.get("/provinces", (req, res) => {
    res.json(data.provinces);
});

app.get("/provinces/:provinceId", (req, res) => {
    const province = data.provinces.find(
        p => p.id == req.params.provinceId
    );

    if (!province) {
        return res.status(404).json({ message: "Province not found" });
    }

    res.json(province);
});

// Districts
app.get("/districts", (req, res) => {
    res.json(data.districts);
});

app.get("/districts/:districtId", (req, res) => {
    const district = data.districts.find(
        d => d.id == req.params.districtId
    );

    if (!district) {
        return res.status(404).json({ message: "District not found" });
    }

    res.json(district);
});

// Stations
app.get("/stations", (req, res) => {
    res.json(data.stations);
});

app.get("/stations/:stationId", (req, res) => {
    const station = data.stations.find(
        s => s.id == req.params.stationId
    );

    if (!station) {
        return res.status(404).json({ message: "Station not found" });
    }

    res.json(station);
});

// Vehicles
app.get("/vehicles", (req, res) => {
    res.json(data.vehicles);
});

app.get("/vehicles/:vehicleId", (req, res) => {
    const vehicle = data.vehicles.find(
        v => v.id == req.params.vehicleId
    );

    if (!vehicle) {
        return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
});

// Scoped Pings
app.get("/vehicles/:vehicleId/pings", (req, res) => {

    const pings = data.pings.filter(
        p => p.vehicle_id == req.params.vehicleId
    );

    res.json(pings);

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});