// List of Twitch Caetgories to not display game data for
const ignoreGameTitle = [
  "Just Chatting",
  "I'm Only Sleeping",
  "IRL",
  "Art",
  "Music",
  "Food & Drink",
  "ASMR",
  "Travel & Outdoors",
  "Creative",
  "Software & Game Development",
  "Software and Game Development",
  "Animals, Aquariums, and Zoos",
  "Games + Demos",
  "Retro",
  "Special Events",
  "Talk Shows & Podcasts",
  "Makers & Crafting",
  "Virtual Casino",
];

// Valid platforms to include
const validPlatforms = [
  "PlayStation",
  "Xbox",
  "Nintendo",
  "PC",
  "Linux",
  "Mac",
];

const statusButton = document.querySelector("#toggleSwitch"); // Extension control toggle
let isExtensionEnabled; // Determines if the extension is enabled or not
let previousGameTitle = null; // Stores previous game title
let loadingStartTime = 0;

// Loading icon styles
const spinnerCSS = `
.lds-ring {
  display: inline-block;
  position: relative;
  width: 64px;
  height: 64px;
  margin: 0 auto;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 51px;
  height: 51px;
  margin: 6px;
  border: 6px solid #9147ff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #9147ff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}`;

// Add the CSS to the document
const styleElement = document.createElement("style");
styleElement.textContent = spinnerCSS;
document.head.appendChild(styleElement);

// Different platform icons
const xboxIconUrl = chrome.runtime.getURL("./assets/icons/xbox-icon.png");
const playstationIconUrl = chrome.runtime.getURL(
  "./assets/icons/playstation-icon.png"
);
const appleIconUrl = chrome.runtime.getURL("./assets/icons/apple-icon.png");
const linuxIconUrl = chrome.runtime.getURL("./assets/icons/linux-icon.png");
const windowsIconUrl = chrome.runtime.getURL("./assets/icons/windows-icon.png");
const nintendoIconUrl = chrome.runtime.getURL(
  "./assets/icons/nintendo-icon.png"
);

const hoverContainer = document.createElement("div");
hoverContainer.style.position = "absolute";
hoverContainer.style.zIndex = "9999";
hoverContainer.style.display = "none";
hoverContainer.style.minWidth = "250px";
hoverContainer.style.maxWidth = "300px";
hoverContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
hoverContainer.style.borderRadius = "4px";
hoverContainer.style.fontSize = "14px";
hoverContainer.style.fontFamily =
  "Roobert, 'Helvetica Neue', Helvetica, Arial, sans-serif";
document.body.appendChild(hoverContainer);

// Show loading state function
function showLoadingState() {
  if (!isExtensionEnabled) return;

  loadingStartTime = Date.now();

  // Create a loading spinner
  hoverContainer.innerHTML = `
    <div style="text-align: center; padding: 15px; background-color: rgba(23, 20, 31, 0.95); border-radius: 4px;">
      <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
      <p style="margin-top: 15px; color: white; font-size: 14px;">Loading game data...</p>
    </div>
  `;
}

// Messaging in order to control the display of the hover container
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleVisibility") {
    isExtensionEnabled = message.isEnabled;
    console.log(isExtensionEnabled);
    if (!isExtensionEnabled) {
      hoverContainer.style.display = "none";
    } else {
      // Immediately check for game data when enabled
      const gameTitleElement = document.querySelector(
        'a[data-a-target="stream-game-link"]'
      );
      if (gameTitleElement) {
        // Re-add the hover container if it was removed
        if (!document.body.contains(hoverContainer)) {
          document.body.appendChild(hoverContainer);
        }
        // Reset previous game title to force data refresh
        previousGameTitle = null;
        // Add event listeners and retrieve data
        addEventListeners(gameTitleElement);
        retrieveGameData();
      }
    }
  }
});

// Used to dictate and enstate previous status of the extension
async function initializeExtensionState() {
  try {
    const result = await chrome.storage.local.get(["extensionEnabled"]);
    //console.log("initial state:", result);
    isExtensionEnabled = result.extensionEnabled ?? true; // Default to true if not set

    // If extension is disabled, ensure hover container is hidden
    if (!isExtensionEnabled && hoverContainer) {
      hoverContainer.style.display = "none";
    }

    // Force a check of current game info if extension is enabled
    if (isExtensionEnabled) {
      const gameTitleElement = document.querySelector(
        'a[data-a-target="stream-game-link"]'
      );
      if (gameTitleElement) {
        retrieveGameData();
      }
    }
  } catch (error) {
    console.error("Error getting extension state:", error);
  }
}

initializeExtensionState(); // Initialize the extensions state

// Used to display data retrieved onto the hover container
function updateGameInfo(gameData, appId, isFound, isExtensionEnabled) {
  if (!isExtensionEnabled) {
    hoverContainer.style.display = "none";
    return;
  }

  const loadingDuration = Date.now() - loadingStartTime;
  const minLoadingTime = 500;

  if (loadingDuration < minLoadingTime) {
    setTimeout(() => {
      updateGameInfo(gameData, appId, isFound, isExtensionEnabled);
    }, minLoadingTime - loadingDuration);
    return;
  }

  if (!gameData || !isFound) {
    hoverContainer.innerHTML = `
      <div style="text-align: center; padding: 15px; background-color: rgba(23, 20, 31, 0.95); border-radius: 4px;">
        <strong style="color: white;">Game Not Found</strong>
      </div>
    `;
    return;
  }

  let urlLabel = "";
  let websiteLinks = gameData.websites
    .map((website) => {
      urlLabel =
        website.id === 1
          ? "View Offical Website"
          : website.id === 13
          ? "View Steam Link"
          : website.id === 16
          ? "View Epic Games Link"
          : "View GoG Link";

      return `<p style="margin-right: 5px;"><a href=${website.url} target="_blank" style="color: #bf94ff;">${urlLabel}</a></p>`;
    })
    .join(" ");

  //console.log(appId);

  if (!websiteLinks && appId) {
    const steamLink = `https://store.steampowered.com/app/${appId}/`;
    websiteLinks = `<p><a href=${steamLink} target="_blank" style="color: #bf94ff;">View Steam Link</a></p>`;
  }

  const filteredIcons = gameData.platforms.filter((platform) => {
    return validPlatforms.some((validPlatform) =>
      platform.startsWith(validPlatform)
    );
  });

  //console.log(filteredIcons);

  let playstationFound = false,
    xboxFound = false,
    nintendoFound = false,
    pcFound = false,
    macFound = false,
    linuxFound = false;

  const icons = filteredIcons
    .map((platform) => {
      let iconSrc;
      if (platform.includes("PlayStation") && !playstationFound) {
        playstationFound = true;
        iconSrc = playstationIconUrl;
      } else if (platform.includes("Xbox") && !xboxFound) {
        xboxFound = true;
        iconSrc = xboxIconUrl;
      } else if (platform.includes("Nintendo") && !nintendoFound) {
        nintendoFound = true;
        iconSrc = nintendoIconUrl;
      } else if (platform.includes("PC") && !pcFound) {
        pcFound = true;
        iconSrc = windowsIconUrl;
      } else if (platform.includes("Mac") && !macFound) {
        macFound = true;
        iconSrc = appleIconUrl;
      } else if (platform.includes("Linux") && !linuxFound) {
        linuxFound = true;
        iconSrc = linuxIconUrl;
      }

      if (iconSrc) {
        return `<img src="${iconSrc}" alt="${platform} Icon" style="width: 20px; height: 20px; margin-right: 8px; text-align: center;"/>`;
      }

      return null;
    })
    .filter((icon) => icon !== null);

  //console.log(icons);

  // Create a container for the icons
  const iconContainer = document.createElement("div");
  iconContainer.style.display = "flex";
  iconContainer.style.alignContent = "center";
  iconContainer.className = "iconContainer";
  iconContainer.innerHTML = icons.join("");

  //console.log(gameData.price);

  // Render the hover container
  hoverContainer.innerHTML = `
    <div style="padding: 15px; background-color: rgba(23, 20, 31, 0.95); border-radius: 4px;">
      ${iconContainer.outerHTML}
      <h5 style="margin: 10px 0; color: white;"><strong>${
        gameData.name
      }</strong></h5>
      <p style="margin: 5px 0; color: white;">Price: ${gameData.price}</p>
      <p style="margin: 5px 0; color: white;">Genres: ${
        gameData.genres.join(", ") || "N/A"
      }</p>
      <p style="margin: 5px 0; color: white;">Release Date: ${
        gameData.first_release_date
      }</p>
      <div style="display: flex; flex-wrap: wrap; margin-top: 10px;">${websiteLinks}</div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", async () => {
  const statusButton = document.querySelector("#toggleSwitch");

  if (!statusButton) {
    console.error("Toggle element not found!");
    return;
  }

  // Function to save status
  async function saveStatus(enabled) {
    try {
      await chrome.storage.local.set({ extensionEnabled: enabled });
      //console.log("Status saved:", enabled);
    } catch (error) {
      console.error("Error saving status:", error);
    }
  }

  // Function to get previous status
  async function getPreviousStatus() {
    try {
      const result = await chrome.storage.local.get(["extensionEnabled"]);
      return result.extensionEnabled ?? true; // Default to true if not set
    } catch (error) {
      console.error("Error getting previous status:", error);
      return true; // Default to true on error
    }
  }

  // Function to check extension status
  async function checkStatus() {
    try {
      const prevEnabled = await getPreviousStatus();

      // Set the toggle position immediately based on stored state
      statusButton.checked = prevEnabled;
      statusButton.disabled = false;
    } catch (error) {
      console.error("Error checking status:", error);
      statusButton.disabled = true;
    }
  }
  // Toggle handler
  statusButton.addEventListener("change", async (event) => {
    const enabled = event.target.checked;
    statusButton.disabled = true; // Temporarily disable while processing

    try {
      await saveStatus(enabled);

      // Notify all Twitch tabs about the state change
      const twitchTabs = await chrome.tabs.query({ url: "*://*.twitch.tv/*" });
      twitchTabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: "toggleVisibility",
          isEnabled: enabled,
        });
      });

      statusButton.disabled = false;
    } catch (error) {
      console.error("Error toggling extension:", error);
      statusButton.checked = !enabled;
      statusButton.disabled = false;
    }
  });

  // Check initial status when popup opens
  checkStatus();
});

// Used to retrieve the data by sending messages to background.js to execute data fetching functions
function retrieveGameData() {
  if (!isExtensionEnabled) {
    // if the extension is disabled then no need to send requests
    hoverContainer.style.display = "none";
    return;
  }
  const gameTitleElement = document.querySelector(
    'a[data-a-target="stream-game-link"]'
  );

  if (
    gameTitleElement &&
    !ignoreGameTitle.includes(gameTitleElement.textContent)
  ) {
    const currentGameTitle = gameTitleElement.textContent;
    if (currentGameTitle !== previousGameTitle) {
      console.log(`Game title changed: ${currentGameTitle}`);
      previousGameTitle = currentGameTitle;

      showLoadingState(); // Display loading state

      positionHoverContainer(gameTitleElement);

      // Get the AppID for the game
      chrome.runtime.sendMessage(
        { action: "getAppId", gameName: currentGameTitle },
        (response) => {
          const appId = response?.appID || null;
          //console.log(appId);

          // Get game data regardless of AppID existence
          chrome.runtime.sendMessage(
            {
              action: "getGameData",
              gameName: currentGameTitle,
              appId: appId,
            },
            (gameDataResponse) => {
              if (gameDataResponse?.gameData) {
                //console.log(gameDataResponse.gameData);
                // Handle missing price information
                if (!gameDataResponse.gameData.price) {
                  gameDataResponse.gameData.price = "Price unavailable";
                }
                updateGameInfo(
                  gameDataResponse.gameData,
                  appId,
                  true,
                  isExtensionEnabled
                );
                //console.log(gameDataResponse.gameData);
              } else {
                console.error("Failed to retrieve game data.");
                updateGameInfo(
                  {
                    name: currentGameTitle,
                    price: "Price unavailable",
                    genres: [],
                    websites: [],
                    first_release_date: "Unknown",
                    platforms: [],
                  },
                  appId,
                  false,
                  isExtensionEnabled
                );
              }
            }
          );
        }
      );
    }
  }
}

// Position the hover container under the game category
function positionHoverContainer(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  hoverContainer.style.top = `${rect.bottom + window.scrollY}px`;
  hoverContainer.style.left = `${rect.left + window.scrollX}px`;
}

// Adds event listeners to the hover container
function addEventListeners(gameTitleElement) {
  const onMouseEnter = () => {
    if (!isExtensionEnabled) return;
    positionHoverContainer(gameTitleElement);
    hoverContainer.style.display = "block";
  };

  const onMouseLeave = () => {
    hoverContainer.style.display = "none";
  };

  gameTitleElement.addEventListener("mouseenter", onMouseEnter);
  hoverContainer.addEventListener("mouseenter", onMouseEnter);
  gameTitleElement.addEventListener("mouseleave", onMouseLeave);
  hoverContainer.addEventListener("mouseleave", onMouseLeave);
}

const observer = new MutationObserver(() => {
  if (!isExtensionEnabled) return;
  const gameTitleElement = document.querySelector(
    'a[data-a-target="stream-game-link"]'
  );

  if (gameTitleElement) {
    const currentGameTitle = gameTitleElement.textContent;

    if (ignoreGameTitle.includes(currentGameTitle)) {
      hoverContainer.style.display = "none";
    } else {
      addEventListeners(gameTitleElement);
      if (currentGameTitle !== previousGameTitle) {
        showLoadingState();
        positionHoverContainer(gameTitleElement);
      }
      retrieveGameData();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
