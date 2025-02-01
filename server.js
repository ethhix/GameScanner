require("dotenv").config({ path: "./credentials.env" }); // Load environment variables
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

// CORS configuration
const corsOptions = {
  origin: "chrome-extension://fmoediidgemllljmlblddhhakmiomcoc",
  methods: "GET, POST",
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Connect to Redis
client
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((err) => console.error("Redis connection error:", err));

app.use(cors(corsOptions));
app.use(express.json());

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
