import { getCompanies, getCars, getBattery, getCarDetails } from "../services/db.js";

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
  app.get("/ElCars/:company/", (req, res) => {
    let company = req.params["company"];
    getCars(company).then(writeData(res), writeError(res));
  });

   // Deliver a specific car and version in JSON format
  // Works at the moment only with the first car of each company
  app.get("/ElCars/:company/:car/", (req, res) => {
    let company = req.params["company"];
    let car = req.params["car"];
    getCarDetails(company, car).then(data => {
      let result = [];
      if (Array.isArray(data)) {
        for (let carData of data) {
          if (carData.Company === company && carData["Car Model"] === car) {
            result.push({"Versions": carData.Details.versions});
          }
        }
        res.send(result);
      } else {
        res.send(data);
      }
    }, writeError(res));
  });

  // Deliver a specific version and battery in JSON format
  app.get("/ElCars/:company/:car/:version", (req, res) => {
    let company = req.params["company"];
    let car = req.params["car"];
    let version = req.params["version"];
    getBattery(company, car, version).then(data => {
      let result = {};
      if (Array.isArray(data)) {
        for (let carData of data) {
          if (carData.Company === company && carData["Car Model"] === car && carData.Details.versions.includes(version)) {
            result = {
              "Company": company,
              "Car Model": car,
              "Version": version,
              "Battery Details": carData.Details.battery[version]
            };
            break;
          }
        }
        res.send(result);
      } else {
        res.send(data);
      }
    }, writeError(res));
  });
  /*
  app.get("/ElCars/:company/:car/:verison", (req, res) => {
    let company = req.params["company"];
    let car = req.params["car"];
    getCarDetails(company, car).then(data => {
      let result = [];
      if (Array.isArray(data)) {
        for (let carData of data) {
          if (carData.Company === company && carData["Car Model"] === car) {
            result.push({"Battery capacity": carData.Details.battery_capacity_kWh});
          }
        }
        res.send(result);
      } else {
        res.send(data);
      }
    }, writeError(res));
  });*/

  // Test of getCarDetails
 /* app.get("/ElCars/:company/:car/", (req, res) => {
    let company = req.params["company"];
    let car = req.params["car"];
    getCarDetails(company, car).then(writeData(res), writeError(res));
  });*/

  // Catch all other requests and deliver an error message.
  app.get("*", function (req, res) {
    res.status(404);
    res.set("Content-Type", "text/plain");
    res.send("Unknown URL");
    res.end();
  });
};

export { routes };
