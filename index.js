const express=require("express");
const fs=require("fs");


const app=express();

app.use(express.json());


const data=JSON.parse(
fs.readFileSync("./seed.json","utf8")
);



app.get("/",(req,res)=>{

res.json({

status:"ok",

session:"TUKTUK-MONITORING-API"

});

});



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


app.use(
"/",
require("./routes/pings")(data)
);



const PORT=process.env.PORT||3000;


app.listen(PORT,()=>{

console.log(
`Server running on ${PORT}`
);

});