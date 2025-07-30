require("dotenv").config(); // Load environment variables
const express = require("express");
const cors = require("cors");

let fetch;

(async () => {
  fetch = (await import("node-fetch")).default;
})();
const app = express();
const PORT = process.env.PORT || 3000;

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
let authorization = process.env.AUTHORIZATION;
const renderApiKey = process.env.RENDER_APIKEY;
const serviceID = process.env.SERVICE_ID;

const corsOptions = {
  origin: "chrome-extension://bhmmmhohnnccohmpdhhgpimchaiagddc",
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.text({ type: "text/plain" }));
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Automatically refresh authorization token
async function updateAuthToken(serviceId, newToken) {
  const envVarKey = "AUTHORIZATION";

  const response = await fetch(
    `https://api.render.com/v1/services/${serviceId}/env-vars/${envVarKey}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${renderApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        value: newToken,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to update Render environment variable: ${error.message}`
    );
  }

  return response.json();
}

async function refreshAuthorizationToken() {
  try {
    // Call Twitch API to get a new token
    const response = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Failed to refresh token: ${error.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    console.log("Twitch API Response:", data);

    // Update in-memory variable
    authorization = `Bearer ${data.access_token}`;

    // Update Render environment variable
    await updateAuthToken(`${serviceID}`, data.access_token);
    console.log("Token updated in Render environment variable.");

    return authorization;
  } catch (error) {
    console.error("Error updating token:", error.message);
    throw error;
  }
}

app.options("/igdb/search", cors(corsOptions));
app.options("/igdb/games", cors(corsOptions));

// Request to search for gameID of a specific game
app.post("/igdb/search", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "string") {
      // Check if body is invalid
      return res.status(400).json({ error: "Invalid request body" });
    }

    const response = await fetch("https://api.igdb.com/v4/search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": clientID,
        Authorization: `Bearer ${authorization}`,
      },
      body: req.body,
    });

    // If token expired, refresh and retry once
    if (response.status === 401) {
      await refreshAuthorizationToken();
      response = await fetch("https://api.igdb.com/v4/search", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Client-ID": clientID,
          Authorization: authorization,
        },
        body: req.body,
      });
    }

    if (!response.ok) {
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    res
      .set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "chrome-extension://bhmmmhohnnccohmpdhhgpimchaiagddc",
      })
      .json(data);
  } catch (error) {
    console.error("Error in proxy:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

// Request to retrieve the requested games data using its gameID
app.post("/igdb/games", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "string") {
      return res.status(400).json({ error: "Invalid request body" });
    }

    const response = await fetch("https://api.igdb.com/v4/games/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Client-ID": clientID,
        Authorization: `Bearer ${authorization}`,
      },
      body: req.body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        await refreshAuthorizationToken();
        return res.status(401).json({ error: "Token expired. Please retry." });
      }
      return res.status(response.status).json({ error: await response.text() });
    }

    const data = await response.json();
    res
      .set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin":
          "chrome-extension://bhmmmhohnnccohmpdhhgpimchaiagddc",
      })
      .json(data);
  } catch (error) {
    console.error("Error in proxy:", error);
    res.status(500).json({
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
