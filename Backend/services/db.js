import { config } from "../config/config.js";
import { MongoClient } from "mongodb";

// Functions to get data from the MongoDB-database

const client = new MongoClient(config.db.url);

// Functions:

// Get all companies from the database
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

// Get all cars from a selected company
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



// Get all details of a chosen car model and version
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

// Inser a new company into database
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
      console.log(`${company} is added to the database.`);
    } else {
      console.log(`${company} already exists in the database.`);
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

// Insert a new car into the database
async function setCars(company, carModel, version, range, batteryCapacity, chargingSpeed) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");

    // Check if the company exists in the database
    const existingCompany = await coll.findOne({ [company]: { $exists: true } });
    if (!existingCompany) {
      console.log(`${company} does not exist in the database.`);
      return;
    }

    // Check if the car model exists for the chosen company
    if (!existingCompany[company][carModel]) {
      // Create a new car model if it doesn't exist
      existingCompany[company][carModel] = {
        versions: [],
        range_km: {},
        battery_capacity_kWh: {},
        charging_speed_kW: {}
      };
    }

    // Check if the version already exists of a car model
    const existingVersion = existingCompany[company][carModel].versions.includes(version);
    if (existingVersion) {
      console.log(`${version} already exists for this ${carModel}.`);
      return;
    }

    // Update the car details
    existingCompany[company][carModel].versions.push(version);
    existingCompany[company][carModel].range_km[version] = range;
    existingCompany[company][carModel].battery_capacity_kWh[version] = batteryCapacity;
    existingCompany[company][carModel].charging_speed_kW[version] = chargingSpeed;

    await coll.replaceOne({ _id: existingCompany._id }, existingCompany);

    console.log(`Successfully added details for ${company} ${carModel} ${version} to the database.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

// Edit a company name in the database
async function editCompanies(oldCompany, newCompany) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");

    // Check if the old company exists in the database
    const existingCompany = await coll.findOne({ [oldCompany]: { $exists: true } });
    if (!existingCompany) {
      console.log(`${oldCompany} does not exist in the database.`);
      return;
    }

    // Check if the new company already exists in the database
    const existingNewCompany = await coll.findOne({ [newCompany]: { $exists: true } });
    if (existingNewCompany) {
      console.log(`${newCompany} already exists in the database.`);
      return;
    }

    // Update the chosen companys name
    existingCompany[newCompany] = existingCompany[oldCompany];
    delete existingCompany[oldCompany];
    await coll.replaceOne({ _id: existingCompany._id }, existingCompany);

    console.log(`Successfully updated ${oldCompany} to ${newCompany}.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

// Edit a car model, version and details
async function editCars(company, oldCarModel, newCarModel, oldVersion, newVersion, updatedDetails) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");

    // Check if the company exists in the database
    const existingCompany = await coll.findOne({ [company]: { $exists: true } });
    if (!existingCompany) {
      console.log(`${company} does not exist in the database.`);
      return;
    }

    // Check if the old car model exists for the company
    if (!existingCompany[company][oldCarModel]) {
      console.log(`${oldCarModel} does not exist for ${company}.`);
      return;
    }

    // Check if the old version exists for the car model
    if (!existingCompany[company][oldCarModel].versions.includes(oldVersion)) {
      console.log(`${oldVersion} does not exist for ${oldCarModel}.`);
      return;
    }

    // Update the details of the car
    const carDetails = existingCompany[company][oldCarModel];
    if (newCarModel) {
      existingCompany[company][newCarModel] = existingCompany[company][oldCarModel];
      delete existingCompany[company][oldCarModel];
      carDetails.versions.forEach((version) => {
        carDetails.range_km[version] = carDetails.range_km[version] || carDetails.range_km[oldVersion];
        carDetails.battery_capacity_kWh[version] = carDetails.battery_capacity_kWh[version] || carDetails.battery_capacity_kWh[oldVersion];
        carDetails.charging_speed_kW[version] = carDetails.charging_speed_kW[version] || carDetails.charging_speed_kW[oldVersion];
      });
    }
    if (newVersion) {
      const versionIndex = carDetails.versions.indexOf(oldVersion);
      if (versionIndex > -1) {
        carDetails.versions.splice(versionIndex, 1, newVersion);
        carDetails.range_km[newVersion] = carDetails.range_km[newVersion] || carDetails.range_km[oldVersion];
        carDetails.battery_capacity_kWh[newVersion] = carDetails.battery_capacity_kWh[newVersion] || carDetails.battery_capacity_kWh[oldVersion];
        carDetails.charging_speed_kW[newVersion] = carDetails.charging_speed_kW[newVersion] || carDetails.charging_speed_kW[oldVersion];
        delete carDetails.range_km[oldVersion];
        delete carDetails.battery_capacity_kWh[oldVersion];
        delete carDetails.charging_speed_kW[oldVersion];
      } else {
        console.log(`${oldVersion} does not exist for ${oldCarModel}. `);
        return;
      }
    }
    if (updatedDetails.range_km) {
      carDetails.range_km[newVersion] = updatedDetails.range_km;
    }
    if (updatedDetails.battery_capacity_kWh) {
      carDetails.battery_capacity_kWh[newVersion] = updatedDetails.battery_capacity_kWh;
    }
    if (updatedDetails.charging_speed_kW) {
      carDetails.charging_speed_kW[newVersion] = updatedDetails.charging_speed_kW;
    }

    await coll.replaceOne({ _id: existingCompany._id }, existingCompany);

    console.log(`Successfully updated car details for ${company} ${oldCarModel} ${oldVersion} in the database.`);

    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  }

  // Delete a company from the database
async function deleteCompany(company) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");

    // Check if the company exists in the database
    const existingCompany = await coll.findOne({ [company]: { $exists: true } });
    if (!existingCompany) {
      console.log(`${company} does not exist in the database.`);
      return;
    }

    // Delete the company from the collection
    await coll.deleteOne({ _id: existingCompany._id });

    console.log(`Successfully deleted ${company} from the database.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}
// Delete a car model from the database
async function deleteCarModel(company, carModel) {
  try {
    await client.connect();
    const db = client.db(config.db.name);
    const coll = db.collection("ElCars");

    // Check if the company exists in the database
    const existingCompany = await coll.findOne({ [company]: { $exists: true } });
    if (!existingCompany) {
      console.log(`${company} does not exist in the database.`);
      return;
    }

    // Check if the car model exists for the company
    if (!existingCompany[company][carModel]) {
      console.log(`${carModel} does not exist for ${company}.`);
      return;
    }

    // Delete car model of a company
    delete existingCompany[company][carModel];

    await coll.replaceOne({ _id: existingCompany._id }, existingCompany);

    console.log(`Successfully deleted ${carModel}.`);
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

export { getCompanies, getCars, getCarDetails, setCompanies, setCars, editCompanies, editCars, deleteCompany, deleteCarModel };
