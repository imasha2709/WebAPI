const express = require("express");
const fs = require("fs");
const path = require("path");

const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swagger");

const app = express();


// JSON middleware
app.use(express.json());



// Load seed data
let data = {
    provinces: [],
    districts: [],
    stations: [],
    vehicles: [],
    pings: []
};


try {

    const seedPath = path.join(__dirname, "seed.json");

    data = JSON.parse(
        fs.readFileSync(seedPath, "utf8")
    );


    console.log("Seed data loaded successfully");


}
catch(error){

    console.log(
        "Error loading seed.json",
        error
    );

}



// Home route
app.get("/", (req,res)=>{

    res.json({

        status:"ok",

        session:"TUKTUK-MONITORING-API"

    });

});





// Routes

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


// Ping routes
app.use(
    "/",
    require("./routes/pings")(data)
);





// Swagger Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);





// 404 handler (always last)

app.use((req,res)=>{

    res.status(404).json({

        error:"Endpoint not found"

    });

});





const PORT = process.env.PORT || 3000;


app.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});