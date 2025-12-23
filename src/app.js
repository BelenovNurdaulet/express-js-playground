import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import authRoutes from "./modules/auth/auth.routes.js";


const PORT = 5001;

const app = express();
app.use(express.json());

/** @type {import('swagger-jsdoc').Options} */
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Express JS Playground",
            description: "Belenov Nurdaulet",
            version: "1.0.0",
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: [
        "./src/modules/**/*.js",
    ],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve , swaggerUi.setup(swaggerDocs))
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
