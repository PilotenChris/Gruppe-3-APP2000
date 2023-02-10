import { getCompanies, getCars, getVersion, getBattery } from "../services/db.js";

// Helper functions for delivering output
function writeData(res) {
  return (result) => {
    res.status(200);
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(result));
    res.end();
  };
}

function writeError(res) {
  return (error) => {
    res.status(500);
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify({ "Error Message": error.message }));
    res.end();
  };
}

// Define the routes in the REST API.
const routes = (app) => {
  // Deliver all companies in JSON format
  app.get("/ElCars", (req, res) => {
    getCompanies().then(writeData(res), writeError(res));
  });

  // Deliver a specific car in JSON format
  // Note the use of :company which match all company and car names.
  app.get("/ElCars/:company/", (req, res) => {
    let company = req.params["company"];
    getCars(company).then(writeData(res), writeError(res));
  });

   // Deliver a specific car and battery in JSON format
  // Note the use of :company, :car which match all company and car names.
  app.get("/ElCars/:company/:car/", (req, res) => {
    let company = req.params["company"];
    let car = req.params["car"];
    getBattery(company, car).then(writeData(res), writeError(res));
  });

  // Deliver a specific version and battery in JSON format
  // Note the use of :company, :car which match all company, car and version names.
  app.get("/ElCars/:company/:car/version", (req, res) => {
    let company = req.params["company"];
    let car = req.params["car"];
    let battery = req.params["version"];
    getBattery(company, car, version).then(writeData(res), writeError(res));
  });

  // Catch all other requests and deliver an error message.
  app.get("*", function (req, res) {
    res.status(404);
    res.set("Content-Type", "text/plain");
    res.send("Unknown URL");
    res.end();
  });
};

export { routes };
