console.log("Brainrot Shield running on:", window.location.hostname);

// Detect multiple platforms
const platform = getPlatformName();
console.log("Detected platform:", platform);

// Global toggle state
let isPopupVisible = false;

// Add keyboard shortcut to toggle popup (Ctrl+Shift+B)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.shiftKey && event.key === "B") {
    event.preventDefault();
    toggleBrainrotPopup();
  }
});

// Add floating toggle button
if (platform) {
  createToggleButton();
}

function getPlatformName() {
  const hostname = window.location.hostname;
  if (hostname.includes("instagram")) return "Instagram";
  if (hostname.includes("tiktok")) return "TikTok";
  if (hostname.includes("youtube")) return "YouTube";
  if (hostname.includes("twitter") || hostname.includes("x.com"))
    return "Twitter";
  return null; // Not a supported platform
}

function toggleBrainrotPopup() {
  const existingPopup = document.getElementById("brainrot-popup");

  if (existingPopup) {
    // Hide popup
    existingPopup.remove();
    isPopupVisible = false;
    console.log("Popup hidden");

    // Clear all GIF intervals if running
    if (window.gifLoopInterval) {
      clearInterval(window.gifLoopInterval);
      window.gifLoopInterval = null;
    }
    if (window.ripGifInterval) {
      clearInterval(window.ripGifInterval);
      window.ripGifInterval = null;
    }
    if (window.mediumGifInterval) {
      clearInterval(window.mediumGifInterval);
      window.mediumGifInterval = null;
    }
  } else if (platform) {
    // Show popup and analyze current content
    isPopupVisible = true;
    console.log("Showing popup and analyzing content");
    createBrainrotPopup(platform);
  }
}

function createToggleButton() {
  // Remove existing button if any
  const existingBtn = document.getElementById("brainrot-toggle-btn");
  if (existingBtn) existingBtn.remove();

  const toggleBtn = document.createElement("div");
  toggleBtn.id = "brainrot-toggle-btn";

  // Add Billy.png image instead of emoji
  let billySrc = "";
  try {
    if (chrome && chrome.runtime && chrome.runtime.getURL) {
      billySrc = chrome.runtime.getURL("images/Billy.png");
    } else {
      // Fallback to brain emoji if image fails to load
      toggleBtn.innerHTML = "🧠";
      return;
    }
  } catch (e) {
    toggleBtn.innerHTML = "🧠";
    return;
  }

  // Create the image and test if it loads
  const testImg = new Image();
  testImg.onload = () => {
    toggleBtn.innerHTML = `<img src="${billySrc}" style="width: 30px !important; height: 30px !important; border-radius: 50% !important; object-fit: cover !important; flex-shrink: 0 !important; position: relative !important; left: 0 !important; right: 0 !important; top: 0 !important; bottom: 0 !important; margin: 0 !important; padding: 0 !important;" alt="Billy Toggle">`;
  };
  testImg.onerror = () => {
    console.log("Billy.png failed to load, using brain emoji fallback");
    toggleBtn.innerHTML = "🧠";
  };
  testImg.src = billySrc;

  // Style the toggle button with !important to override TikTok CSS
  toggleBtn.style.cssText = `
    position: fixed !important;
    bottom: 20px !important;
    right: 20px !important;
    width: 50px !important;
    height: 50px !important;
    border-radius: 50% !important;
    background-color: #4285f4 !important;
    color: white !important;
    font-size: 24px !important;
    font-family: 'Press Start 2P', 'Courier New', monospace !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    cursor: pointer !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    z-index: 9999 !important;
    transition: transform 0.2s ease !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    outline: none !important;
    text-align: center !important;
    line-height: 1 !important;
    box-sizing: border-box !important;
  `;
  toggleBtn.title = "TOGGLE BRAINROT ANALYSIS (CTRL+SHIFT+B)";

  // Add hover effect
  toggleBtn.addEventListener("mouseenter", () => {
    toggleBtn.style.transform = "scale(1.1)";
  });

  toggleBtn.addEventListener("mouseleave", () => {
    toggleBtn.style.transform = "scale(1)";
  });

  // Add click handler
  toggleBtn.addEventListener("click", () => {
    toggleBrainrotPopup();
  });

  document.body.appendChild(toggleBtn);
  console.log("Toggle button created");
}

function createBrainrotPopup(platformName) {
  console.log("createBrainrotPopup called for:", platformName);

  // Check if popup already exists
  const existingPopup = document.getElementById("brainrot-popup");
  if (existingPopup) {
    console.log("Popup already exists, removing it");
    existingPopup.remove();
  }

  // Add pixelated font to page if not already added
  if (!document.getElementById("pixelated-font-link")) {
    const fontLink = document.createElement("link");
    fontLink.id = "pixelated-font-link";
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap";
    document.head.appendChild(fontLink);
  }

  // Create popup container
  const popup = document.createElement("div");
  popup.id = "brainrot-popup";

  // Style the popup
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.width = "280px";
  popup.style.minHeight = "200px";
  popup.style.maxHeight = "300px";
  popup.style.backgroundColor = "white";
  popup.style.border = "3px solid #4285f4";
  popup.style.borderRadius = "15px";
  popup.style.padding = "15px";
  popup.style.zIndex = "10000";
  popup.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
  popup.style.fontFamily =
    "'Press Start 2P', 'Courier New', 'Monaco', monospace";
  popup.style.textAlign = "center";
  popup.style.overflow = "hidden";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";

  // Add content with your custom GIF (with fallback)
  let gifSrc = "";
  try {
    if (chrome && chrome.runtime && chrome.runtime.getURL) {
      gifSrc = chrome.runtime.getURL("images/Billy2000.gif");
    } else {
      console.log("Chrome runtime not available, using fallback icon");
      // Fallback to a brain icon SVG
      gifSrc =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjQiIGZpbGw9IiM0Mjg1ZjQiLz4KPHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHg9IjEwIiB5PSIxMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNOS41IDNBNi41IDYuNSAwIDAgMSAxNiA5LjVjMCAxLTEuNSAzLTIgNC0uNSAxLTEgMS41LTEgMi41YTIgMiAwIDAgMS00IDBjMC0xLS41LTEuNS0xLTIuNS0uNS0xLTItMy0yLTRBNi41IDYuNSAwIDAgMSA5LjUgM3oiLz4KPHBhdGggZD0iTTguNSAyMmg2Ii8+Cjwvc3ZnPgo8L3N2Zz4=";
    }
  } catch (e) {
    console.error("Error getting GIF URL:", e);
    gifSrc =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjUiIGN5PSIyNSIgcj0iMjQiIGZpbGw9IiM0Mjg1ZjQiLz4KPHN2ZyB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHg9IjEwIiB5PSIxMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiPgo8cGF0aCBkPSJNOS41IDNBNi41IDYuNSAwIDAgMSAxNiA5LjVjMCAxLTEuNSAzLTIgNC0uNSAxLTEgMS41LTEgMi41YTIgMiAwIDAgMS00IDBjMC0xLS41LTEuNS0xLTIuNS0uNS0xLTItMy0yLTRBNi41IDYuNSAwIDAgMSA5LjUgM3oiLz4KPHBhdGggZD0iTTguNSAyMmg2Ii8+Cjwvc3ZnPgo8L3N2Zz4=";
  }

  popup.innerHTML = `
    <div style="margin-bottom: 2px; flex-shrink: 0;">
      <img id="brainrot-mascot-gif"
           src="${gifSrc}"
           style="width: 100px; height: 100px;"
           alt="Brainrot Mascot">
    </div>
    <h3 style="margin: 8px 0; color: #000; font-size: 12px; flex-shrink: 0;">BRAIN SHIELD</h3>
    <p style="font-size: 8px; color: #000; margin: 3px 0; flex-shrink: 0;">ANALYZING ${platformName.toUpperCase()}...</p>
    <div id="analysis-text" style="color: #000; font-size: 8px; line-height: 1.4; flex: 1; overflow-y: auto; word-wrap: break-word; margin: 8px 0;">AI IS THINKING...</div>
    <button id="close-popup" style="margin-top: 8px; padding: 8px 12px; background: #f44; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 8px; flex-shrink: 0;">CLOSE</button>
  `;

  // Add close functionality
  const closeBtn = popup.querySelector("#close-popup");
  closeBtn.addEventListener("click", () => {
    popup.remove();
    // Stop all GIF loops when popup is closed
    if (window.gifLoopInterval) {
      clearInterval(window.gifLoopInterval);
      window.gifLoopInterval = null;
    }
    if (window.ripGifInterval) {
      clearInterval(window.ripGifInterval);
      window.ripGifInterval = null;
    }
    if (window.mediumGifInterval) {
      clearInterval(window.mediumGifInterval);
      window.mediumGifInterval = null;
    }
  });

  document.body.appendChild(popup);
  console.log("Popup appended to DOM:", popup);

  // START GIF INFINITE LOOP
  const gif = popup.querySelector("#brainrot-mascot-gif");
  if (gif) {
    console.log("GIF element found:", gif.src);

    // Add load/error handlers to debug gif loading
    gif.onload = () => {
      console.log("Billy gif loaded successfully!");
    };
    gif.onerror = () => {
      console.error("Billy gif failed to load!");
      // Fallback to a visible placeholder
      gif.style.background = "white";
      gif.style.border = "2px solid black";
      gif.alt = "Billy (failed to load)";
    };

    window.gifLoopInterval = setInterval(function () {
      // Force GIF to restart by changing its source
      gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
    }, 500); // Every 500ms
  } else {
    console.log("GIF element not found");
  }

  // REAL AI ANALYSIS
  setTimeout(() => {
    // Get page content for analysis - platform specific
    const pageText = getPageContent(platformName);

    // Send to background script for AI analysis
    chrome.runtime.sendMessage(
      {
        action: "analyzeBrainrot",
        data: {
          platform: platformName,
          text: pageText,
          url: window.location.href,
        },
      },
      (response) => {
        if (response && !response.error) {
          updatePopupWithResults(
            popup,
            response.category,
            response.reason,
            response.score
          );
        } else {
          updatePopupWithResults(
            popup,
            "MODERATE",
            "Analysis failed - using default",
            50
          );
        }
      }
    );
  }, 2000); // Wait 2 seconds before analyzing
}

function getPageContent(platformName) {
  // Get platform-specific content for better analysis
  let content = "";

  try {
    switch (platformName) {
      case "Instagram":
        // Try to get post captions and comments
        const igCaptions = document.querySelectorAll(
          'article span, [data-testid="post-caption"]'
        );
        igCaptions.forEach((el) => (content += el.textContent + " "));
        break;

      case "TikTok":
        // Try to get video descriptions
        const ttDescriptions = document.querySelectorAll(
          '[data-e2e="browse-video-desc"], [data-e2e="video-desc"]'
        );
        ttDescriptions.forEach((el) => (content += el.textContent + " "));
        break;

      case "YouTube":
        // Try to get video titles and descriptions
        const ytTitles = document.querySelectorAll(
          "h1.title, #video-title, #meta h1"
        );
        const ytDescriptions = document.querySelectorAll(
          "#description, .description"
        );
        ytTitles.forEach((el) => (content += el.textContent + " "));
        ytDescriptions.forEach((el) => (content += el.textContent + " "));
        break;

      case "Twitter":
        // Try to get tweet text
        const tweets = document.querySelectorAll(
          '[data-testid="tweetText"], .tweet-text'
        );
        tweets.forEach((el) => (content += el.textContent + " "));
        break;

      default:
        content = document.body.innerText;
    }

    // Fallback to general page content if platform-specific didn't work
    if (content.trim().length < 50) {
      content = document.body.innerText;
    }

    // Limit content length for API
    return content.substring(0, 800);
  } catch (error) {
    console.log("Error getting platform content:", error);
    return document.body.innerText.substring(0, 500);
  }
}

function updatePopupWithResults(popup, riskLevel, analysis, score) {
  const analysisText = popup.querySelector("#analysis-text");
  const scoreDisplay = score ? ` (${score}/100)` : "";

  if (riskLevel === "HIGH") {
    popup.style.borderColor = "red";
    popup.style.boxShadow = "0 8px 16px rgba(255,0,0,0.3)";
    analysisText.innerHTML = `<strong style="color: red;">🚨 HIGH BRAINROT${scoreDisplay}</strong><br><small>${analysis}</small>`;

    // Change to Billy RIP gif for high brainrot
    const gif = popup.querySelector("#brainrot-mascot-gif");
    if (gif) {
      // Stop all other GIF loops
      if (window.gifLoopInterval) {
        clearInterval(window.gifLoopInterval);
        window.gifLoopInterval = null;
      }
      if (window.mediumGifInterval) {
        clearInterval(window.mediumGifInterval);
        window.mediumGifInterval = null;
      }

      // Switch to BillyRIP.gif for high brainrot
      try {
        if (chrome && chrome.runtime && chrome.runtime.getURL) {
          gif.src = chrome.runtime.getURL("images/BillyRIP.gif");
          console.log("Switched to BillyRIP.gif for high brainrot");
        } else {
          console.log("Chrome runtime not available, keeping original gif");
        }
      } catch (e) {
        console.error("Error loading BillyRIP.gif:", e);
      }

      // Start slower RIP gif animation loop (dramatic effect)
      window.ripGifInterval = setInterval(() => {
        if (gif.src.includes("BillyRIP.gif")) {
          gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
        }
      }, 1000);
    }
  } else if (riskLevel === "MODERATE") {
    popup.style.borderColor = "orange";
    popup.style.boxShadow = "0 8px 16px rgba(255,165,0,0.3)";
    analysisText.innerHTML = `<strong style="color: orange;">⚠️ MODERATE BRAINROT${scoreDisplay}</strong><br><small>${analysis}</small>`;

    // Change to Billy Medium gif for moderate brainrot
    const gif = popup.querySelector("#brainrot-mascot-gif");
    if (gif) {
      // Stop all other GIF loops
      if (window.gifLoopInterval) {
        clearInterval(window.gifLoopInterval);
        window.gifLoopInterval = null;
      }
      if (window.ripGifInterval) {
        clearInterval(window.ripGifInterval);
        window.ripGifInterval = null;
      }

      // Switch to BillyMedium.gif for moderate brainrot
      try {
        if (chrome && chrome.runtime && chrome.runtime.getURL) {
          gif.src = chrome.runtime.getURL("images/BillyMedium.gif");
          console.log("Switched to BillyMedium.gif for moderate brainrot");
        } else {
          console.log("Chrome runtime not available, keeping original gif");
        }
      } catch (e) {
        console.error("Error loading BillyMedium.gif:", e);
      }

      // Start medium gif animation loop (moderate speed)
      window.mediumGifInterval = setInterval(() => {
        if (gif.src.includes("BillyMedium.gif")) {
          gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
        }
      }, 750); // Between normal (500ms) and RIP (1000ms) speed
    }
  } else {
    popup.style.borderColor = "green";
    popup.style.boxShadow = "0 8px 16px rgba(0,255,0,0.3)";
    analysisText.innerHTML = `<strong style="color: green;">✅ BRAIN SAFE${scoreDisplay}</strong><br><small>${analysis}</small>`;
  }
}

function autoCleanseCurrentPlatform() {
  const hostname = window.location.hostname;

  if (hostname.includes("instagram")) {
    hideInstagramPosts();
  } else if (hostname.includes("tiktok")) {
    hideTikTokVideos();
  } else if (hostname.includes("youtube")) {
    hideYouTubeVideos();
  }

  // Show success message
  showCleanseSuccessMessage();
}

function showCleanseSuccessMessage() {
  const successMsg = document.createElement("div");
  successMsg.style.position = "fixed";
  successMsg.style.top = "10px";
  successMsg.style.left = "50%";
  successMsg.style.transform = "translateX(-50%)";
  successMsg.style.background = "#4CAF50";
  successMsg.style.color = "white";
  successMsg.style.padding = "10px 20px";
  successMsg.style.borderRadius = "5px";
  successMsg.style.zIndex = "10001";
  successMsg.style.fontWeight = "bold";
  successMsg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  successMsg.innerHTML = "🛡️ Brainrot content automatically blocked!";

  document.body.appendChild(successMsg);

  setTimeout(() => {
    successMsg.style.opacity = "0";
    successMsg.style.transition = "opacity 0.5s ease";
    setTimeout(() => successMsg.remove(), 500);
  }, 2500);
}

function hideInstagramPosts() {
  // Hide current post/reel
  const posts = document.querySelectorAll('article, [role="presentation"]');
  posts.forEach((post) => {
    if (post.offsetHeight > 100) {
      // Only hide actual content posts
      post.style.opacity = "0.3";
      post.style.filter = "blur(5px)";
      post.style.pointerEvents = "none";

      // Add overlay message
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "50%";
      overlay.style.left = "50%";
      overlay.style.transform = "translate(-50%, -50%)";
      overlay.style.background = "rgba(255, 0, 0, 0.9)";
      overlay.style.color = "white";
      overlay.style.padding = "20px";
      overlay.style.borderRadius = "10px";
      overlay.style.zIndex = "1000";
      overlay.style.textAlign = "center";
      overlay.innerHTML =
        "🧠 BRAINROT BLOCKED<br><small>Content hidden by Brainrot Shield</small>";

      post.style.position = "relative";
      post.appendChild(overlay);
    }
  });
}

function hideTikTokVideos() {
  // Hide TikTok videos
  const videos = document.querySelectorAll(
    '[data-e2e="recommend-list-item"], .video-feed-item'
  );
  videos.forEach((video) => {
    video.style.opacity = "0.2";
    video.style.filter = "blur(8px)";

    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.top = "50%";
    overlay.style.left = "50%";
    overlay.style.transform = "translate(-50%, -50%)";
    overlay.style.background = "rgba(255, 0, 0, 0.9)";
    overlay.style.color = "white";
    overlay.style.padding = "15px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "1000";
    overlay.innerHTML = "⛔ BRAINROT DETECTED";

    video.style.position = "relative";
    video.appendChild(overlay);
  });
}

function hideYouTubeVideos() {
  // Hide YouTube video thumbnails
  const videos = document.querySelectorAll(
    "ytd-video-renderer, ytd-rich-item-renderer"
  );
  videos.forEach((video) => {
    const thumbnail = video.querySelector("img, ytd-thumbnail");
    if (thumbnail) {
      thumbnail.style.filter = "blur(10px) grayscale(100%)";

      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.right = "0";
      overlay.style.bottom = "0";
      overlay.style.background = "rgba(255, 0, 0, 0.8)";
      overlay.style.color = "white";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "1000";
      overlay.innerHTML = "🚫 BRAINROT BLOCKED";

      video.style.position = "relative";
      video.appendChild(overlay);
    }
  });
}
