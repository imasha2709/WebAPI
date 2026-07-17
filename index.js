const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

// Parse incoming JSON request bodies
app.use(express.json());

// Safely load and parse the seeded database
let data = { provinces: [], districts: [], stations: [], vehicles: [], pings: [] };
try {
    const seedPath = path.join(__dirname, "seed.json");
    if (fs.existsSync(seedPath)) {
        data = JSON.parse(fs.readFileSync(seedPath, "utf8"));
    } else {
        console.warn("Warning: seed.json not found. Initializing with empty datasets.");
    }
} catch (error) {
    console.error("Critical: Failed to read or parse seed.json", error);
}

// Global base route for health check
app.get("/", (req, res) => {
    res.json({
        status: "ok",
        session: "TUKTUK-MONITORING-API"
    });
});

// Route mounting
app.use(
    "/provinces",
    require("./routes/provinces")(data)
);

app.use(
    "/districts",
    require("./routes/districts")(data)
);

app.use(
    "/stations",
    require("./routes/stations")(data)
);

app.use(
    "/vehicles",
    require("./routes/vehicles")(data)
);

// Mounted under "/" so that routes nested inside pings.js 
// (e.g. "/vehicles/:vehicleId/pings") match correctly
app.use(
    "/",
    require("./routes/pings")(data)
);

// 404 Fallback for any unhandled endpoint matching standard format
app.use((req, res) => {
    res.status(404).json({
        error: "Endpoint not found"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});