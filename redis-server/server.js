const express = require("express");
const redis = require("redis");
const cors = require("cors");

const app = express();

// Create Redis client
const client = redis.createClient({
  username: "default", // Default username for Redis
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: `${process.env.REDIS_HOST}`, // Redis Cloud host
    port: process.env.REDIS_PORT, // Redis Cloud port
  },
});

client.on("error", (err) => console.error("Redis Client Error:", err));
client.on("end", () => console.log("Redis connection closed"));
client.on("reconnecting", () => console.log("Redis reconnecting..."));

// CORS configuration
const corsOptions = {
  origin: "chrome-extension://fmoediidgemllljmlblddhhakmiomcoc",
  methods: "GET, POST, PUT",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

client.on("error", (err) => console.error("Redis error:", err));

// Route to get appID by gameName
app.get("/getAppId/:gameName", async (req, res) => {
  const gameName = req.params.gameName;
  try {
    const appID = await client.get(gameName); // Fetch appID from Redis
    if (appID) {
      res.json({ appID }); // Return appID if found
    } else {
      res.status(404).json({ error: "Game not found" }); // Return 404 if game not found
    }
  } catch (err) {
    console.error("Error fetching appID:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add appID for a game
app.put("/addAppId", async (req, res) => {
  const { gameName, appId } = req.body;

  if (!gameName || !appId) {
    return res
      .status(400)
      .json({ error: "Both game name and appId are required" });
  }

  const normalizedGameName = gameName
    .toLowerCase()
    .replace(/™/g, "")
    .replace(/®/g, "")
    .replace(/\s+/g, " ")
    .trim();

  try {
    await client.set(normalizedGameName, appId);
    console.log(`Stored game: ${normalizedGameName}, appId: ${appId}`);
    res.status(200).json({ message: "Game and appId added successfully" });
  } catch (err) {
    console.error("Error storing data in Redis:", err);
    res.status(500).json({ error: "Failed to store data in Redis" });
  }
});

const startServer = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");

    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();
