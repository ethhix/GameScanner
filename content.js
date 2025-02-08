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
  "Animals, Aquariums, and Zoos",
  "Games + Demos",
  "Retro",
  "Special Events",
  "Talk Shows & Podcasts",
  "Makers & Crafting",
  "Virtual Casino",
];

const validPlatforms = [
  "PlayStation",
  "Xbox",
  "Nintendo",
  "PC",
  "Linux",
  "Mac",
];
const statusButton = document.querySelector("#toggleSwitch");

let previousGameTitle = null;
const hoverContainer = document.createElement("div");
hoverContainer.style.position = "absolute";
hoverContainer.style.backgroundColor = "#583994";
hoverContainer.style.border = "1px solid #ccc";
hoverContainer.style.padding = "10px";
hoverContainer.style.borderRadius = "5px";
hoverContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
hoverContainer.style.display = "none";
hoverContainer.style.maxWidth = "300px";
hoverContainer.style.zIndex = "1000";
document.body.appendChild(hoverContainer);

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

function updateGameInfo(gameData, appId, isFound) {
  if (!gameData || !isFound) {
    hoverContainer.innerHTML = `<strong>Game Not Found</strong>`;
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

      return `<p style="margin-right: 5px;"><a href=${website.url} target="_blank">${urlLabel}</a></p>`;
    })
    .join(" ");

  console.log(appId);

  if (!websiteLinks && appId) {
    const steamLink = `https://store.steampowered.com/app/${appId}/`;
    websiteLinks = `<p><a href=${steamLink} target="_blank">View Steam Link</a></p>`;
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
    ${iconContainer.outerHTML}
  <h5><strong>${gameData.name}</strong></h5>
  <p>Price: ${gameData.price}</p>
  <p>Genres: ${gameData.genres.join(", ") || "N/A"}</p>
  <p>Release Date: ${gameData.first_release_date}</p>
  <div style="display: flex; flex-wrap: wrap;">${websiteLinks}</div>
`;
}

document.addEventListener("DOMContentLoaded", () => {
  const PROXY_MANAGER_URL = "https://gamescanner-extension.onrender.com";
  const statusButton = document.querySelector("#toggleSwitch");

  if (!statusButton) {
    console.error("Toggle element not found!");
    return;
  }

  // Initial state: disable until we know status
  statusButton.disabled = true;

  // Fetch server status and update toggle
  function updateServerStatus() {
    fetch(`${PROXY_MANAGER_URL}/status`)
      .then((response) => {
        if (!response.ok) throw new Error("Server unreachable");
        return response.json();
      })
      .then((data) => {
        statusButton.checked = data.running;
        statusButton.disabled = false; // Enable toggle once status is known
      })
      .catch((error) => {
        console.error("Status check failed:", error);
        statusButton.disabled = true;
      });
  }

  // Initial status check
  updateServerStatus();

  // Toggle handler
  statusButton.addEventListener("change", (event) => {
    const enabled = event.target.checked;
    statusButton.disabled = true; // Disable during transition

    chrome.runtime.sendMessage(
      { action: "toggleServer", enabled },
      (response) => {
        if (response?.success) {
          // Refresh status after 1 second to confirm
          setTimeout(updateServerStatus, 1000);
        } else {
          console.error("Toggle failed:", response?.error);
          statusButton.checked = !enabled;
          statusButton.disabled = true;
          setTimeout(updateServerStatus, 5000); // Retry after 5 seconds
        }
      }
    );
  });
});

function retrieveGameData() {
  const gameTitleElement = document.querySelector(
    'a[data-a-target="stream-game-link"]'
  );

  if (gameTitleElement) {
    const currentGameTitle = gameTitleElement.textContent;
    if (currentGameTitle !== previousGameTitle) {
      console.log(`Game title changed: ${currentGameTitle}`);
      previousGameTitle = currentGameTitle;

      // Get the AppID for the game
      chrome.runtime.sendMessage(
        { action: "getAppId", gameName: currentGameTitle },
        (response) => {
          const appId = response?.appID || null;
          console.log(appId);

          // Get game data regardless of AppID existence
          chrome.runtime.sendMessage(
            {
              action: "getGameData",
              gameName: currentGameTitle,
              appId: appId,
            },
            (gameDataResponse) => {
              if (gameDataResponse?.gameData) {
                // Handle missing price information
                if (!gameDataResponse.gameData.price) {
                  gameDataResponse.gameData.price = "Price unavailable";
                }
                updateGameInfo(gameDataResponse.gameData, appId, true);
              } else {
                console.error("Failed to retrieve game data.");
                updateGameInfo(
                  {
                    name: currentGameTitle,
                    price: "Price unavailable",
                    genres: [],
                    websites: [],
                    first_release_date: "Unknown",
                  },
                  appId,
                  false
                );
              }
            }
          );
        }
      );
    }
  }
}

function positionHoverContainer(targetElement) {
  const rect = targetElement.getBoundingClientRect();
  hoverContainer.style.top = `${rect.bottom + window.scrollY}px`;
  hoverContainer.style.left = `${rect.left + window.scrollX}px`;
}

function addEventListeners(gameTitleElement) {
  const onMouseEnter = () => {
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
  const gameTitleElement = document.querySelector(
    'a[data-a-target="stream-game-link"]'
  );

  if (gameTitleElement) {
    const currentGameTitle = gameTitleElement.textContent;

    if (ignoreGameTitle.includes(currentGameTitle)) {
      hoverContainer.remove();
    } else {
      if (!document.body.contains(hoverContainer)) {
        document.body.appendChild(hoverContainer);
      }
      addEventListeners(gameTitleElement);
      retrieveGameData();
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
