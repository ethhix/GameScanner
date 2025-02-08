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

// Initialize Redis and auto-start proxy if needed
let proxyServer = null;
client
  .connect()
  .then(async () => {
    const isRunning = (await client.get("server:running")) === "true";
    if (isRunning) {
      server = mainApp.listen(process.env.PROXY_PORT || 3001, () => {
        console.log("Proxy server auto-started (Redis state was 'running')");
      });
    }
  })
  .catch((err) => console.error("Redis connection failed:", err));

// Start/stop endpoints
bootstrapApp.post("/start-server", async (req, res) => {
  if (!proxyServer) {
    proxyServer = mainApp.listen(process.env.PROXY_PORT || 3001, async () => {
      await client.set("server:running", "true");
      console.log("Proxy server started");
      res.send("Server started!");
    });
  } else {
    res.status(400).send("Server already running");
  }
});

bootstrapApp.post("/stop-server", async (req, res) => {
  if (proxyServer) {
    const serverInstance = proxyServer;

    serverInstance.closeAllConnections();

    serverInstance.close(async () => {
      await client.set("server:running", "false");
      proxyServer = null;
      console.log("Proxy server stopped");
      res.send("Server stopped");
    });
  } else {
    res.status(400).send("Server not running");
  }
});

bootstrapApp.get("/status", async (req, res) => {
  try {
    const isRunning = server !== null && server.listening;
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
    server.close(() => {
      proxyServer.log("Proxy server stopped during shutdown");
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
