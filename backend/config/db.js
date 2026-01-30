const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "ECommerce",
    });
    console.log(`DB connected: ${connection.connection.name}`);
  } catch (error) {
    console.error("DB connection error:", error);
  }
};

module.exports = connectDb;
