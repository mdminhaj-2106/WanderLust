import mongoose from "mongoose";
import data from "./data.js";
import Listing from "../models/listings.model.js";



let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


async function main() {
    await mongoose.connect(MONGO_URL);
}

main()
    .then((result) => {
        console.log("Connection Established Successfully !!!");
    })
    .catch((err) => {
        console.log(err);
    });

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(data);
    console.log("Data was initialised");
}

initDB();