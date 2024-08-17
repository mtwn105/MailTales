import mongoose from "mongoose";

const uri = process.env.MONGODB_URI as string; // Ensure this is set in your environment variables

let cachedClient: mongoose.Mongoose | null = null;
let isConnecting = false;

async function connectToDatabase(): Promise<mongoose.Mongoose> {
  if (cachedClient) {
    return cachedClient;
  }

  if (isConnecting) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (cachedClient) {
          clearInterval(interval);
          resolve(cachedClient);
        }
      }, 100); // Check every 100ms for connection
    });
  }

  isConnecting = true;

  const options: mongoose.ConnectOptions = {
    bufferCommands: false,
    autoIndex: false, // Disable autoIndex in production for performance
  };

  try {
    cachedClient = await mongoose.connect(uri, options);
    isConnecting = false;

    // Reconnection logic
    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected, attempting to reconnect...");
      connectToDatabase(); // Attempt reconnection
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    return cachedClient;
  } catch (error) {
    isConnecting = false;
    console.error("Mongoose connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default connectToDatabase;
