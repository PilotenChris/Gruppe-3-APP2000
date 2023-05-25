import { getCompanies, getCars, getCarDetails, setCompanies, setCars, editCars, editCompanies, 
  deleteCarModel, deleteCompany, createAdminAccount, adminLogin } from "../services/db.js";
import dotenv from 'dotenv';
import fetch from "node-fetch";
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


function parseJsonResponse(data) {
const newMarkers = [];
if (data && data.chargerstations && data.chargerstations.length >= 1) {
for (let i = 0; i < data.chargerstations.length; i++) {
const csmd = data.chargerstations[i].csmd;
if (!csmd.Position) {
  console.error('Charger station position not available');
  continue;
}
const arrpunkt = csmd.Position.split(',');
const editLat = 1.0 * arrpunkt[0].substr(1);
const editLng = 1.0 * arrpunkt[1].substr(0, arrpunkt[1].length - 1);


let adress = csmd.Street;
if (csmd.House_number) {
  adress += " " + csmd.House_number;
}
let connector = null;
let maxChargingCapacity = null;

if (data.chargerstations[i].attr.conn[1][4]) {
  connector = data.chargerstations[i].attr.conn[1][4].trans;
}
if (data.chargerstations[i].attr.conn[1][5]) {
  maxChargingCapacity = data.chargerstations[i].attr.conn[1][5].trans;
}

newMarkers.push({
  id: csmd.International_id,
  geolocation: csmd.Position,
  latlng: { lat: editLat, lng: editLng },
  name: csmd.name,
  connector: connector,
  maxChargingCapacity: maxChargingCapacity,
  adress: adress,
  description: csmd.Description_of_location,
  alreadyadded: false
});
}
}
return newMarkers;
}

// Define the routes in the REST API.
const routes = (app) => {
const apiKey = process.env.REACT_APP_API_KEY;

app.post("/charger-stations", async (req, res) => {
let bounds = req.body.bounds;
let existingIds = req.body.existingIds;
let ne = bounds.ne;
let sw = bounds.sw;

const apiUrl = `https://nobil.no/api/server/search.php?apikey=${apiKey}&apiversion=3&action=search&type=rectangle&northeast=${ne}&southwest=${sw}&existingids=${existingIds}`;

try {
const response = await fetch(apiUrl);
const data = await response.json();
const newMarkers = parseJsonResponse(data);
res.json(newMarkers);
} catch (error) {
res.status(500).json({ message: error.message });
}
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

// Deliver range, battery and charging information in JSON format
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
app.put("/ElCars/:company/:oldCarModel/:newCarModel/:oldVersion/:newVersion", (req, res) => {
let company = req.params["company"];
let oldCarModel = req.params["oldCarModel"];
let newCarModel = req.params["newCarModel"];
let oldVersion = req.params["oldVersion"];
let newVersion = req.params["newVersion"];
let updatedDetails = req.body;

editCars(company, oldCarModel, newCarModel, oldVersion, newVersion, updatedDetails)
  .then(() => {
    res.sendStatus(200);
  })
  .catch((error) => {
    console.error("Error editing car details:", error);
    res.sendStatus(500);
  });
});

// Delete a company from database
app.delete("/ElCars/:company", (req, res) => {
let company = req.params["company"];
deleteCompany(company).then(() => {
  res.sendStatus(200);
}, writeError(res));
});

// Delete a car model from database
app.delete("/ElCars/:company/:car", (req, res) => {
let company = req.params["company"];
let carModel = req.params["car"];
deleteCarModel(company, carModel).then(() => {
  res.sendStatus(200);
}, writeError(res));
});

  // Create new admin account
  app.post("/Admin", (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let isSuperAdmin = req.body.isSuperAdmin;

    createAdminAccount(email, password, isSuperAdmin)
      .then(() => {
        res.sendStatus(200);
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  });


  // Authenticate admin login
  app.post("/Admin/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    try {
      adminLogin(username, password)
        .then((isAuthenticated) => {
          if (isAuthenticated) {
            res.sendStatus(200);
          } else {
            res.status(401).json({ message: "Invalid credentials" });
          }
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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
