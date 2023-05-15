import { getCompanies, getCars, getCarDetails, setCompanies, setCars, editCars, editCompanies } from "../services/db.js";
import dotenv from 'dotenv';
dotenv.config();

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
  // Deliver the API key in JSON format
  app.get("/api-key", (req, res) => {
    res.send({ apiKey: process.env.REACT_APP_API_KEY });
  });
  
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
    let version = req.params["version"]
    getCarDetails(company, car, version).then(writeData(res), writeError(res));
  });

  // Insert a company into the database
  app.post("/ElCars/:company", (req, res) => {
    let company = req.params["company"];
    setCompanies(company).then(() => {
      res.sendStatus(200);
    }, writeError(res));
  });

    // Insert car details from a webpage into the database
    app.post("/ElCars/:company/:car/:version", (req, res) => {
      let company = req.params["company"];
      let carModel = req.params["car"];
      let version = req.params["version"];
      let range = req.body.range;
      let batteryCapacity = req.body.batteryCapacity;
      let chargingSpeed = req.body.chargingSpeed;
  
      setCars(company, carModel, version, range, batteryCapacity, chargingSpeed).then(() => {
        res.sendStatus(200);
      }, writeError(res));
    });

    // Edit a company in the database
    app.put("/ElCars/:oldCompany/:newCompany", (req, res) => {
      let oldCompany = req.params["oldCompany"];
      let newCompany = req.params["newCompany"];
      editCompanies(oldCompany, newCompany).then(() => {
        res.sendStatus(200);
      }, writeError(res));
    });

    // Edit car details in the database
    app.put("/ElCars/:company/:car/:version", (req, res) => {
      let company = req.params["company"];
      let carModel = req.params["car"];
      let version = req.params["version"];
      let updatedDetails = req.body;

      editCars(company, carModel, version, updatedDetails).then(() => {
        res.sendStatus(200);
      }, writeError(res));
    });

  // Catch all other requests and deliver an error message.
  app.get("*", function (req, res) {
    res.status(404);
    res.set("Content-Type", "text/plain");
    res.send("Unknown URL");
    res.end();
  });
};

// Testing setCompanies and setCars functions in console
/*async function test() {
  // Test setCompanies function
  try {
    await setCompanies("BYD");
    await setCompanies("BMW");
    await setCompanies("Tesla"); // Testing duplicate company
  } catch (error) {
    console.error(error);
  }

  // Test setCars and editCars function
  try {
    // Set car details
    await setCars("Tesla", "Model S", "Long Range", 500, 100, 50); 
    await setCars("Tesla", "Model 3", "Short Range", 400, 75, 30);
    await setCars("BMW", "i3", "2021", 250, 50, 20);
  
    // Edit car details company, oldCarModel, newCarModel, oldVersion, newVersion, updatedDetails
    await editCars("BMW", "i3", "i5", "Super Long Range", "Long Range", {
      range_km: 450,
      battery_capacity_kWh: 40,
      charging_speed_kW: 40
    });
  } catch (error) {
    console.error(error);
  }
  try {
    await editCompanies("BYD", "BMW");
  } catch (error) {
    console.error(error);
  }

  try { 
    await editCars("BMW", "i3", "Super Long Range", 350, 30, 30);
  } catch (error) {
    console.error(error);
  }

}*/

// Run the test function
test();

export { routes };
