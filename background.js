const grant_type = "client_credentials";
let ignoreGameList = []; // Used to store gameIDs that are invalid

const gameData = {
  first_release_date: new Date().toLocaleDateString(),
  genres: [],
  name: "",
  websites: [],
  price: 0,
  platforms: [],
};

const websiteIDs = [1, 13, 16, 17];

const romanToNumber = {
  I: "1",
  II: "2",
  III: "3",
  IV: "4",
  V: "5",
  VI: "6",
  VII: "7",
  VIII: "8",
  IX: "9",
  X: "10",
  XI: "11",
  XII: "12",
  XIII: "13",
  XIV: "14",
  XV: "15",
};

// Normalize game names
function normalizeSteamName(name) {
  return name
    .toLowerCase()
    .replace(/™/g, "")
    .replace(/®/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeGameTitle(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => romanToNumber[word] || word)
    .join(" ");
}

function formatGameTitleStrict(input) {
  // Lookup table for Roman numerals
  const cleanedInput = input.replace(/[^a-zA-Z0-9\s]/g, "");

  // Convert Roman numerals to integers
  const formattedInput = cleanedInput.replace(
    /\b(I{1,3}|IV|V|VI{0,3}|IX|X)\b/gi,
    (match) => {
      return romanToInteger[match.toUpperCase()] || match;
    }
  );

  const isUpperCase = (word) => word === word.toUpperCase();

  const finalOutput = formattedInput
    .split(" ")
    .map((word) =>
      isUpperCase(word)
        ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        : word
    )
    .join(" ");

  return finalOutput;
}

// Retrieve AppID of requested game
async function getAppId(gameName) {
  const name = normalizeSteamName(gameName);
  console.log(name);
  try {
    const response = await fetch(`http://localhost:3001/getAppId/${name}`);
    if (!response.ok) {
      throw new Error("Game not found");
    }
    const data = await response.json();
    console.log("AppID:", data.appID);
    return data.appID;
  } catch (err) {
    console.error("Error fetching AppID:", err);
    return null;
  }
}

// Retrieve gameID by making request with requested gameName
async function getGameID(gameName) {
  try {
    const response = await fetch("http://localhost:3000/igdb/search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      body: `fields game, name; search "${gameName}";`, // Search for gameId and name
    });

    // If response fails:
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData.error); // Print error
      return null;
    }

    const data = await response.json();
    console.log(data);

    // If data is null or not structured properly
    if (!data || !Array.isArray(data)) {
      console.error("Invalid response format");
      return null;
    }

    // Normalize gameName, remove special characters
    const normalizedInput = normalizeGameTitle(gameName);

    console.log(normalizedInput);

    const candidates = []; // Stores potential gameIds containing valid data
    for (const element of data) {
      const normalizedElementName = normalizeGameTitle(element.name);
      console.log(normalizedElementName + " " + normalizedInput);
      if (
        normalizedElementName === normalizedInput &&
        element.game !== undefined &&
        !ignoreGameList.includes(element.game)
      ) {
        candidates.push(element.game);
      }
    }
    return candidates.length > 0 ? candidates : null;
  } catch (err) {
    console.error("Error fetching game ID:", err);
    return null;
  }
}

function getAppIdFromSteamUrl(url) {
  const regex = /\/app\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Retrieves game details using valid game ids and steam app ids
async function getGameDetails(gameID, appId) {
  try {
    const gameData = {
      first_release_date: new Date().toLocaleDateString(),
      genres: [],
      name: "",
      websites: [],
      price: "Price not available",
      platforms: [],
    };

    if (appId) {
      const steamResponse = await fetch(
        `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=us`
      );
      const steamData = await steamResponse.json();
      console.log(steamData);
      if (steamData[appId]?.success) {
        if (steamData[appId].data?.is_free) {
          gameData.price = "Free";
        } else if (steamData[appId].data?.price_overview?.final_formatted) {
          gameData.price = steamData[appId].data.price_overview.final_formatted;
        }
      }
    }

    // Rest of the IGDB code remains the same
    const igdbResponse = await fetch("http://localhost:3000/igdb/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: `fields name, genres.name, platforms.name, websites.category, websites.url, first_release_date; where id = ${gameID};`,
    });

    const igdbData = await igdbResponse.json();
    console.log(igdbData);

    // Check if IGDB data is valid
    if (!igdbData?.length) {
      console.error("No IGDB data found");
      return null;
    }

    // Process Genres
    if (igdbData[0].genres) {
      igdbData[0].genres.forEach((genre) => {
        gameData.genres.push(genre.name);
      });
    }

    if (igdbData[0].platforms) {
      igdbData[0].platforms.forEach((platform) => {
        gameData.platforms.push(platform.name);
      });
    }

    let steamURL;
    // Process Websites
    if (igdbData[0].websites) {
      igdbData[0].websites.forEach((website) => {
        if (websiteIDs.includes(website.category)) {
          if (website.category === 13) {
            steamURL = website.url;
          }
          gameData.websites.push({
            id: website.category,
            url: website.url,
          });
        }
      });
    }

    //console.log(appId + " " + steamURL);
    if (!appId && steamURL) {
      const appId = getAppIdFromSteamUrl(steamURL);
      console.log("Added new appID!");
      const putAppIdResponse = await fetch("http://localhost:3001/addAppId", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameName: igdbData[0].name,
          appId: appId,
        }),
      });

      if (!putAppIdResponse.ok) {
        console.error("Failed to add AppID:", putAppIdResponse.statusText);
        return;
      }

      const responseData = await putAppIdResponse.json();
      console.log("AppID added successfully:", responseData);
    }

    // Process Release Date
    if (igdbData[0].first_release_date) {
      gameData.first_release_date = new Date(
        igdbData[0].first_release_date * 1000
      ).toLocaleDateString();
    }

    // Process Name
    gameData.name = igdbData[0].name || "Unknown";

    return gameData;
  } catch (error) {
    console.error("Error in getGameDetails:", error);
    return null;
  }
}

// Check validity of response
async function checkResponse(game) {
  try {
    const response = await fetch("http://localhost:3000/igdb/games", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: `fields name, genres.name, websites.category, websites.url, first_release_date; where id = ${game};`,
    });

    const data = await response.json();
    console.log(data);

    if (data.length == 0) {
      console.warn(`No data found for game ID: ${game}`);
      ignoreGameList.push(game);
      return false;
    }

    // If data does not contain some information, ignore it
    if (!data[0] || !data[0].name || !data[0].genres || !data[0].websites) {
      ignoreGameList.push(game);
      return false;
    }
    return true; // Valid
  } catch (error) {
    console.error("Error: ", error);
    ignoreGameList.push(game);
    return false;
  }
}

let completedFormattedCheck = false; // Formatted title check
let completedNormalCheck = false; // Normal title check

// Strict gameID search
async function getGameIDStrict(gameName) {
  const gameTitle = !completedFormattedCheck
    ? formatGameTitleStrict(gameName)
    : gameName;

  console.log(gameTitle);

  try {
    const response = await fetch("http://localhost:3000/igdb/search", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      body: `fields game, name; where name = "${gameTitle}";`,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData.error);
      return null;
    }

    const data = await response.json();
    console.log(data);

    if ((!data || data.length === 0) && !completedNormalCheck) {
      if (!completedFormattedCheck) {
        completedFormattedCheck = true;
        return getGameIDStrict(gameName);
      } else {
        completedNormalCheck = true;
        return null;
      }
    }

    const normalizedInput = completedFormattedCheck
      ? gameName
          .toLowerCase()
          .replace(/[^a-z0-9 ]/g, "")
          .replace(/ii/g, "2")
          .replace(/iii/g, "3")
          .replace(/\s+/g, " ")
          .trim()
      : gameTitle;

    const candidates = [];
    for (const element of data) {
      const normalizedElementName = completedFormattedCheck
        ? element.name
            .toLowerCase()
            .replace(/[^a-z0-9 ]/g, "")
            .replace(/ii/g, "2")
            .replace(/iii/g, "3")
            .replace(/\s+/g, " ")
            .trim()
        : element.name;

      //console.log(normalizedElementName + " " + normalizedInput);

      if (
        normalizedElementName === normalizedInput &&
        element.game !== undefined &&
        !ignoreGameList.includes(element.game)
      ) {
        candidates.push(element.game);
      }
    }

    return candidates.length > 0 ? candidates : null;
  } catch (err) {
    console.error("Error fetching game ID:", err);
    return null;
  }
}

async function processGame(gameName, appId) {
  try {
    let candidates = await getGameIDStrict(gameName);
    completedFormattedCheck = false;
    completedNormalCheck = false;
    console.log(candidates);
    if (!candidates) {
      candidates = await getGameID(gameName);
      console.log(candidates + " retry attempt " + gameName);
      if (!candidates) {
        return null;
      }
    }

    candidates.sort((a, b) => a - b); // Sort gameIds in ascending order

    for (const gameID of candidates) {
      const isValid = await checkResponse(gameID);
      if (isValid) {
        const details = await getGameDetails(gameID, appId);
        if (details) {
          // Fallback for price
          if (!details.price) {
            details.price = "Price unavailable";
          }
          console.log("Valid Game Details:", details);
          return details;
        }
      } else {
        console.log(`Skipping invalid game ID: ${gameID}`);
        ignoreGameList.push(gameID);
      }
    }
    return null;
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}
// Listen for messages from content.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getAppId") {
    console.log("Received request for game:", request.gameName);
    getAppId(request.gameName).then((appID) => {
      console.log("Sending AppID:", appID);
      sendResponse({ appID });
    });
    return true;
  } else if (request.action === "getGameData") {
    console.log("Received request for game:", request.gameName);
    // Process game data through IGDB and Steam
    getAppId(request.gameName).then((appID) => {
      processGame(request.gameName, appID).then((gameData) => {
        sendResponse({ gameData });
      });
    });
    return true;
  }
});
