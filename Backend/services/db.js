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

// Get all versions for a given car model
async function getVersion(company, carModel) {
  let result = {};
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const carData = await coll.find({ [company]: { [carModel]: { $exists: true } } }).toArray();
    if (carData.length > 0) {
      result = carData[0][company][carModel]["versions"];
    }
  } catch (error) {
    console.error(error);
    result = { "Error Message": error.message };
  } finally {
    await client.close();
  }
  return result;
}

// Get battery capacity for a given car model and version
async function getBattery(company, carModel, modelVersion) {
  let result = {};
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const carData = await coll.findOne({ [company]: { [carModel]: { $exists: true } } });
    if (carData) {
      result = carData[company][carModel]["battery_capacity_kWh"][modelVersion];
    }
  } catch (error) {
    console.error(error);
    result = { "Error Message": error.message };
  } finally {
    await client.close();
  }
  return result;
}

async function getCarDetails(company, carModel) {
  let result = [];
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");
    const cars = await coll.find({ [company]: { $exists: true } }).toArray();
    if (cars.length > 0) {
      for (const car of cars) {
        if (Object.keys(car[company])[0] === carModel) {
          result.push({
            "Company": company,
            "Car Model": carModel,
            "Details": car[company][carModel]
          });
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

  export { getCompanies, getCars, getVersion, getBattery };