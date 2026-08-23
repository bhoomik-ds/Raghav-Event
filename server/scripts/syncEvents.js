require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env") });
const fs = require("fs").promises;
const path = require("path");
const mongoose = require("mongoose");
const Event = require("../src/models/Event");

const sync = async () => {
  try {
    console.log("Connecting to MongoDB:", process.env.DB_NAME || "RaghavEvents");
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.DB_NAME || "RaghavEvents",
      serverSelectionTimeoutMS: 10000,
    });
    console.log("Connected to MongoDB successfully!");

    const dataPath = path.join(__dirname, "..", "data", "events.json");
    const raw = await fs.readFile(dataPath, "utf8");
    const parsed = JSON.parse(raw);

    const formattedEvents = parsed.map(({ _id, ...event }) => ({
      ...event,
      status: "published",
    }));

    // Remove old events and insert new Junagadh events
    const deleteResult = await Event.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old events.`);

    const insertResult = await Event.insertMany(formattedEvents);
    console.log(`Inserted ${insertResult.length} new Junagadh events successfully!`);

    insertResult.forEach((e) => {
      console.log(`- ${e.title} | ${e.venue?.city} | ${e.venue?.address} | Passes: ${e.ticketTypes?.map((t) => `${t.name} (₹${t.price})`).join(", ")}`);
    });

    await mongoose.disconnect();
    console.log("Database synchronization completed!");
    process.exit(0);
  } catch (error) {
    console.error("Sync error:", error);
    process.exit(1);
  }
};

sync();
