const mongoose=require("mongoose");
const initData= require("./data.js");

const Listing=require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("Connection error:", err); // Changed console.log to console.error for better indication of error
  });

async function main() {
  await mongoose.connect(MONGO_URL); // Removed quotes around MONGO_URL variable
}


const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=> ({...obj,owner:"6654c1e90b1c0e239a397721"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");

};

initDB();