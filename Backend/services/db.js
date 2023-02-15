import { config } from "../config/config.js";
import { MongoClient } from "mongodb";

// Functions to get data from the MongoDB-database

const client = new MongoClient(config.db.url);

// Functions:

// Get all companies
async function getCompanies() {
  let result = [];
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const cars = await coll.find().toArray();
    cars.forEach(car => {
      result.push(Object.keys(car)[1]);
    });
  } finally {
    await client.close();
  }
  return result;
}

// Get all cars for a given company
async function getCars(company) {
  let result = [];
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const cars = await coll.find({ [company]: { $exists: true } }).toArray();
    if (cars.length > 0) {
      result = Object.keys(cars[0][company]);
    }
  } catch (error) {
    console.error(error);
    result = { "Error Message": error.message };
  } finally {
    await client.close();
  }
  return result;
}



// Get all details of a car model and version
async function getCarDetails(company, carModel, version) {
  let result = [];
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const cars = await coll.find({ [company]: { $exists: true } }).toArray();
    if (cars.length > 0) {
      for (const car of cars) {
        for (const model in car[company]) {
          if (car[company].hasOwnProperty(model) && car[company][model].hasOwnProperty('versions')) {
            if (model === carModel) {
              const details = car[company][model];
              if (version && details.versions.includes(version)) {
                result.push({
                  "Company": company,
                  "Car Model": carModel,
                  "Version": version,
                  "Details": {
                    "Range (km)": details.range_km[version],
                    "Battery Capacity (kWh)": details.battery_capacity_kWh[version],
                    "Charging Speed (kW)": details.charging_speed_kW[version]
                  }
                });
              } else if (!version) {
                result.push({
                  "Company": company,
                  "Car Model": carModel,
                  "Details": details
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    result = { "Error Message": error.message };
  } finally {
    await client.close();
  }
  return result;
}

  export { getCompanies, getCars, getCarDetails };