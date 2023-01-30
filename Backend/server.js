// Install this project with Node-modules for express:
// npm install

// Start the service:
// node server.js

import express, { urlencoded, json } from "express";
import cors from "cors";
import { config } from "./config/config.js";
import { routes } from "./routes/index.js";

const app = express();

//

app.use(cors({ origin: `http://localhost:3000` }));
app.use(urlencoded({ extended: true }));
app.use(json());

routes(app);

app.listen(config.port, () => {
    console.log(`Lytter på http://localhost:${config.port}`)
})