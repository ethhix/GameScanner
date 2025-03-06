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

const PROXY_MANAGER_URL = "https://proxy-server-j4qa.onrender.com";
const REDIS_SERVER_URL = "https://redis-server-toxf.onrender.com";

// Normalize steam names
function normalizeSteamName(name) {
  return name
    .toLowerCase()
    .replace(/™/g, "")
    .replace(/®/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

//Normalize games titles
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

function sortGamesAsc(response) {
  const sortedGames = response.sort((a, b) => {
    const dateA = a.published_at || 0;
    const dateB = b.published_at || 0;
    return dateB - dateA;
  });

  return sortedGames;
}

function formatGameTitleStrict(input) {
  // Lookup table for Roman numerals
  const cleanedInput = input.replace(/[^a-zA-Z0-9'\s]/g, "");

  // Convert Roman numerals to integers
  const formattedInput = cleanedInput.replace(
    /\b(I{1,3}|IV|V|VI{0,3}|IX|X)\b/gi,
    (match) => {
      return romanToNumber[match.toUpperCase()] || match;
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

  //console.log(finalOutput);

  return finalOutput;
}

// Retrieve AppID of requested game
async function getAppId(gameName) {
  const name = normalizeSteamName(gameName);
  //console.log(name);
  try {
    const response = await fetch(
      `${REDIS_SERVER_URL}/getAppId/${encodeURIComponent(name)}`
    );
    if (!response.ok) {
      throw new Error("Game not found");
    }
    const data = await response.json();
    //console.log("AppID:", data.appID);
    return data.appID;
  } catch (err) {
    console.error("Error fetching AppID:", err);
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
      //console.log(steamData);
      if (steamData[appId]?.success) {
        if (steamData[appId].data?.is_free) {
          gameData.price = "Free";
        } else if (steamData[appId].data?.price_overview?.final_formatted) {
          gameData.price = steamData[appId].data.price_overview.final_formatted;
        }
      }
    }

    // Rest of the IGDB code remains the same
    const igdbResponse = await fetch(`${PROXY_MANAGER_URL}/igdb/games`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: `fields name, genres.name, platforms.name, websites.category, websites.url, first_release_date; where id = ${gameID};`,
    });

    const igdbData = await igdbResponse.json();
    //console.log(igdbData);

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

    // Process Platforms
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
      if (!steamURL && appId) {
        gameData.websites.push({
          id: 13,
          url: `https://store.steampowered.com/app/${appId}/`,
        });
      }
    }

    //console.log(appId + " " + steamURL);
    if (!appId && steamURL) {
      const appId = getAppIdFromSteamUrl(steamURL);
      //console.log("Added new appID!");
      const putAppIdResponse = await fetch(`${REDIS_SERVER_URL}/addAppId`, {
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

      //const responseData = await putAppIdResponse.json();
      //console.log("AppID added successfully:", responseData);
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
    const response = await fetch(`${PROXY_MANAGER_URL}/igdb/games`, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: `fields name, genres.name, websites.category, websites.url, first_release_date; where id = ${game};`,
    });

    const data = await response.json();
    //console.log(data);

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

// Strict gameID search
async function getGameID(gameName, options = {}) {
  const { isFormatted = false, attemptNormalSearch = false } = options;

  // Only format if not already formatted
  const gameTitle = !isFormatted ? formatGameTitleStrict(gameName) : gameName;

  try {
    const queryBody = attemptNormalSearch
      ? `fields game, name, published_at; search "${gameTitle}";`
      : `fields game, name, published_at; where name = "${gameTitle}";`;
    const response = await fetch(`${PROXY_MANAGER_URL}/igdb/search`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "text/plain",
      },
      body: queryBody,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Server error:", errorData.error);
      return null;
    }

    const data = await response.json();
    const sortedGames = sortGamesAsc(data);

    // Normalize input consistently
    const normalizedInput = gameTitle
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/ii/g, "2")
      .replace(/iii/g, "3")
      .replace(/\s+/g, " ")
      .trim();

    const candidates = [];
    for (const element of sortedGames) {
      const normalizedElementName = element.name
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/ii/g, "2")
        .replace(/iii/g, "3")
        .replace(/\s+/g, " ")
        .trim();

      if (
        normalizedElementName === normalizedInput &&
        element.game !== undefined &&
        !ignoreGameList.includes(element.game)
      ) {
        candidates.push(element.game);
      }
    }

    // If no candidates found, try alternative approaches
    if (candidates.length === 0) {
      // If not yet formatted, try with formatting
      if (!isFormatted) {
        return getGameID(gameName, {
          isFormatted: true,
          attemptNormalSearch,
        });
      }
      // If formatted but not tried normal search, try that
      else if (!attemptNormalSearch) {
        // Implement different search logic for normal search
        return getGameID(gameName, {
          isFormatted: true,
          attemptNormalSearch: true,
        });
      }
      // All attempts failed
      else {
        return null;
      }
    }

    return candidates.length > 0 ? candidates : null;
  } catch (err) {
    console.error("Error fetching game ID:", err);
    return null;
  }
}

async function processGame(gameName, appId) {
  // Clear the ignore list at the start of processing each new game
  ignoreGameList = [];

  try {
    let candidates = await getGameID(gameName, {
      isFormatted: false,
      attemptNormalSearch: false,
    });

    //console.log(candidates);
    if (!candidates) {
      return null;
    }

    for (const gameID of candidates) {
      const isValid = await checkResponse(gameID);
      if (isValid) {
        const details = await getGameDetails(gameID, appId);
        if (details) {
          // Fallback for price
          if (!details.price) {
            details.price = "Price unavailable";
          }
          //console.log("Valid Game Details:", details);
          return details;
        }
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
    //console.log("Received request for game:", request.gameName);
    getAppId(request.gameName)
      .then((appID) => {
        //console.log("Sending AppID:", appID);
        sendResponse({ appID, success: true });
      })
      .catch((error) => {
        console.error("Error getting AppID:", error);
        sendResponse({ error: error.message, success: false });
      });
    return true;
  } else if (request.action === "getGameData") {
    //console.log("Received request for game:", request.gameName);
    // Process game data through IGDB and Steam
    getAppId(request.gameName)
      .then((appID) => {
        return processGame(request.gameName, appID);
      })
      .then((gameData) => {
        sendResponse({ gameData, success: true });
      })
      .catch((error) => {
        console.error("Error processing game:", error);
        sendResponse({ error: error.message, success: false });
      });
    return true;
  }
});
