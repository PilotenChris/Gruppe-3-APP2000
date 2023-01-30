import { config } from "../config/config.js";
import { MongoClient } from "mongodb";

// Functions to get data from the MongoDB-database

const client = new MongoClient(config.db.url);

// Functions comming soon(tm):