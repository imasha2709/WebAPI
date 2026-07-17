const swaggerJsdoc = require("swagger-jsdoc");


const options = {

    definition: {

        openapi: "3.0.0",

        info: {

            title: "Tuk-Tuk Monitoring API",

            version: "1.0.0",

            description:
            "Sri Lanka Police Tuk-Tuk Monitoring REST API"

        },


        servers: [

            {
                url: "http://localhost:3000"
            }

        ],


        components: {

            securitySchemes: {

                basicAuth: {

                    type: "http",

                    scheme: "basic"

                },


                apiKeyAuth: {

                    type: "apiKey",

                    in: "header",

                    name: "x-api-key"

                }

            }

        }

    },


    apis: [

        "./routes/*.js"

    ]

};


module.exports = swaggerJsdoc(options);