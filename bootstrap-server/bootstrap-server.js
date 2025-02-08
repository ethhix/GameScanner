const express = require("express");
const redis = require("redis");
const cors = require("cors");
const mainApp = require("./proxy");

const bootstrapApp = express();

const client = redis.createClient({
  username: "default", // Default username for Redis
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: `${process.env.REDIS_HOST}`, // Redis Cloud host
    port: process.env.REDIS_PORT, // Redis Cloud port
  },
});

const BOOTSTRAP_PORT = process.env.PORT || 4000;

const corsOptions = {
  origin: ["chrome-extension://fmoediidgemllljmlblddhhakmiomcoc"],
  methods: ["GET", "POST", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

bootstrapApp.use(cors(corsOptions));
bootstrapApp.options("*", cors());

let proxyServer = null;
const PROXY_PORT = process.env.PROXY_PORT || 3001;

// Auto-start logic
client
  .connect()
  .then(async () => {
    const isRunning = (await client.get("server:running")) === "true";
    if (isRunning) {
      startProxyServer();
    }
  })
  .catch((err) => console.error("Redis connection failed:", err));

// Dedicated server starter
function startProxyServer() {
  if (!proxyServer) {
    proxyServer = mainApp.listen(PROXY_PORT, () => {
      console.log("Proxy server running on port", PROXY_PORT);
    });
  }
}

// Modified start endpoint
bootstrapApp.post("/start-server", async (req, res) => {
  if (!proxyServer) {
    try {
      await client.set("server:running", "true");
      startProxyServer();
      res.send("Server started!");
    } catch (err) {
      console.error("Start error:", err);
      res.status(500).send("Failed to start server");
    }
  } else {
    res.status(400).send("Server already running");
  }
});

// Modified stop endpoint
bootstrapApp.post("/stop-server", async (req, res) => {
  if (proxyServer) {
    const serverInstance = proxyServer;

    // Forcefully close connections
    serverInstance.closeAllConnections();

    serverInstance.close(async (err) => {
      if (err) {
        console.error("Stop error:", err);
        return res.status(500).send("Error stopping server");
      }

      await client.set("server:running", "false");
      proxyServer = null;
      console.log("Proxy server fully stopped");
      res.send("Server stopped");
    });
  } else {
    res.status(400).send("Server not running");
  }
});

// Updated status check
bootstrapApp.get("/status", async (req, res) => {
  try {
    const isRunning = proxyServer !== null && proxyServer.listening;
    const redisState = await client.get("server:running");

    res.json({
      running: isRunning,
      redis_state: redisState,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Status check failed:", err);
    res.status(500).json({ error: "Failed to check server status" });
  }
});

// Graceful shutdown
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

function shutdown() {
  if (proxyServer) {
    proxyServer.close(() => {
      console.log("Proxy server stopped during shutdown");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Start bootstrap server
bootstrapApp.listen(BOOTSTRAP_PORT, () => {
  console.log(`Bootstrap server running on port ${BOOTSTRAP_PORT}`);
});
