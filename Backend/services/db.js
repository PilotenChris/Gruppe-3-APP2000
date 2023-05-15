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

// Inser company into database
async function setCompanies(company) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const existingCars = await coll.find().toArray();
    const existingCompanies = existingCars.map((car) => Object.keys(car)[1]);
    if (!existingCompanies.includes(company)) {
      const newComp = { [company]: {} };
      await coll.insertOne(newComp);
      console.log(`Successfully inserted ${company} into the database.`);
    } else {
      console.log(`${company} already exists in the database.`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
async function setCars(company, carModel, version, range, batteryCapacity, chargingSpeed) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");

    // Check if the company exists in the database
    const existingCompany = await coll.findOne({ [company]: { $exists: true } });
    if (!existingCompany) {
      console.log(`${company} does not exist in the database. Please insert the company first.`);
      return;
    }

    // Check if the car model exists for the company
    if (!existingCompany[company][carModel]) {
      // Create a new car model if it doesn't exist
      existingCompany[company][carModel] = {
        versions: [],
        range_km: {},
        battery_capacity_kWh: {},
        charging_speed_kW: {}
      };
    }

    // Check if the version already exists for the car model
    const existingVersion = existingCompany[company][carModel].versions.includes(version);
    if (existingVersion) {
      console.log(`${version} already exists for ${company} ${carModel}. Please choose a different version.`);
      return;
    }

    // Update the car details
    existingCompany[company][carModel].versions.push(version);
    existingCompany[company][carModel].range_km[version] = range;
    existingCompany[company][carModel].battery_capacity_kWh[version] = batteryCapacity;
    existingCompany[company][carModel].charging_speed_kW[version] = chargingSpeed;

    await coll.replaceOne({ _id: existingCompany._id }, existingCompany);

    console.log(`Successfully added car details for ${company} ${carModel} ${version} to the database.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}


  export { getCompanies, getCars, getCarDetails, setCompanies, setCars };