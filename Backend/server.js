// Install this project with Node-modules for express:
// npm install

// Start the service:
// node server.js

// Chris
import express, { urlencoded, json } from "express";
import cors from "cors";
import { config } from "./config/config.js";
import { routes } from "./routes/index.js";

const app = express();

// Configure the app and routes

app.use(cors({ origin: `https://testgruppe3usnexpress.onrender.com` }));
app.use(urlencoded({ extended: true }));
app.use(json());

routes(app);

// Start the server and listen on the specified port
app.listen(config.port, () => {
    console.log(`Lytter på http://localhost:${config.port}`)
})