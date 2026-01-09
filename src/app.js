import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import profileRoutes from "./modules/profile/profile.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import requestId from "./middlewares/requestId.js";
import exceptionHandler from "./middlewares/exceptionHandler.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import {buildContainer} from "./container.js";

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

const PORT = 5001;

const app = express();

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(requestId);
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
        "./src/**/*.js",
    ],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/swagger", swaggerUi.serve , swaggerUi.setup(swaggerDocs))


const container = buildContainer();
app.use("/api/posts", container.routes.postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.use(exceptionHandler)
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});