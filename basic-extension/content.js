console.log("Brain Boost running on:", window.location.hostname);
console.log("Full URL:", window.location.href);

// Detect multiple platforms
const platform = getPlatformName();
console.log("Detected platform:", platform);

// Extra debugging for YouTube
if (window.location.hostname.includes("youtube")) {
  console.log(
    "YouTube detected - checking if content script is running properly"
  );
  console.log("Document ready state:", document.readyState);
}

// Global toggle state
let isPopupVisible = false;

// Add keyboard shortcut to toggle popup (Ctrl+Shift+B)
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.shiftKey && event.key === "B") {
    event.preventDefault();
    toggleEducationalAnalysis();
  }
});

// Add floating toggle button
if (platform) {
  console.log("Creating toggle button for platform:", platform);

  // YouTube is a SPA, so we may need a delay and monitoring
  if (platform === "YouTube") {
    setTimeout(() => {
      console.log("Creating YouTube toggle button after delay");
      createToggleButton();

      // Monitor for YouTube navigation changes and recreate button if needed
      setInterval(() => {
        const existingBtn = document.getElementById("brainrot-toggle-btn");
        if (!existingBtn || !document.body.contains(existingBtn)) {
          console.log("Toggle button missing on YouTube, recreating...");
          createToggleButton();
        }
      }, 3000);
    }, 2000);
  } else {
    createToggleButton();
  }
} else {
  console.log("Platform not supported, toggle button not created");
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

function toggleEducationalAnalysis() {
  const existingPopup = document.getElementById("educational-popup");

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
    createEducationalPopup(platform);
  }
}

function createToggleButton() {
  // Remove existing button if any
  const existingBtn = document.getElementById("brainrot-toggle-btn");
  if (existingBtn) existingBtn.remove();

  const toggleBtn = document.createElement("div");
  toggleBtn.id = "brainrot-toggle-btn";

  // Special positioning for YouTube to avoid conflicts
  const isYouTube = window.location.hostname.includes("youtube");
  console.log("Creating button for YouTube:", isYouTube);

  // Add Billy.png image instead of emoji
  let billySrc = "";
  try {
    if (chrome && chrome.runtime && chrome.runtime.getURL) {
      billySrc = chrome.runtime.getURL("images/Billy.png");
    } else {
      // Fallback to text if image fails to load
      toggleBtn.innerHTML = "BS";
      return;
    }
  } catch (e) {
    toggleBtn.innerHTML = "BS";
    return;
  }

  // Create the image and test if it loads
  const testImg = new Image();
  testImg.onload = () => {
    toggleBtn.innerHTML = `<img src="${billySrc}" style="width: 30px !important; height: 30px !important; border-radius: 50% !important; object-fit: cover !important; flex-shrink: 0 !important; position: relative !important; left: 0 !important; right: 0 !important; top: 0 !important; bottom: 0 !important; margin: 0 !important; padding: 0 !important;" alt="Billy Toggle">`;
  };
  testImg.onerror = () => {
    console.log("Billy.png failed to load, using text fallback");
    toggleBtn.innerHTML = "BS";
  };
  testImg.src = billySrc;

  // Style the toggle button with platform-specific positioning
  const bottomPos = isYouTube ? "80px" : "20px"; // Higher on YouTube to avoid UI conflicts
  const rightPos = isYouTube ? "30px" : "20px"; // More spacing on YouTube

  toggleBtn.style.cssText = `
    position: fixed !important;
    bottom: ${bottomPos} !important;
    right: ${rightPos} !important;
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
    z-index: 2147483647 !important;
    transition: transform 0.2s ease !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    outline: none !important;
    text-align: center !important;
    line-height: 1 !important;
    box-sizing: border-box !important;
    visibility: visible !important;
    opacity: 1 !important;
    pointer-events: auto !important;
    transform: none !important;
    top: auto !important;
    left: auto !important;
    min-width: 50px !important;
    min-height: 50px !important;
    max-width: 50px !important;
    max-height: 50px !important;
  `;
  toggleBtn.title = "TOGGLE EDUCATIONAL VALUE ANALYSIS (CTRL+SHIFT+B)";

  // Add hover effect
  toggleBtn.addEventListener("mouseenter", () => {
    toggleBtn.style.transform = "scale(1.1)";
  });

  toggleBtn.addEventListener("mouseleave", () => {
    toggleBtn.style.transform = "scale(1)";
  });

  // Add click handler
  toggleBtn.addEventListener("click", () => {
    toggleEducationalAnalysis();
  });

  // Append to document body, but for YouTube try to ensure it's visible
  if (isYouTube) {
    // Try to append to html element instead of body for YouTube
    const htmlElement = document.documentElement;
    htmlElement.appendChild(toggleBtn);
    console.log(
      "Toggle button created for YouTube and appended to HTML element"
    );

    // Force a reflow to ensure visibility
    setTimeout(() => {
      toggleBtn.style.display = "none";
      toggleBtn.offsetHeight; // Force reflow
      toggleBtn.style.display = "flex";
      console.log("YouTube button visibility forced");
    }, 100);
  } else {
    document.body.appendChild(toggleBtn);
    console.log("Toggle button created for", platform);
  }
}

function createEducationalPopup(platformName) {
  console.log("createEducationalPopup called for:", platformName);

  // Check if popup already exists
  const existingPopup = document.getElementById("educational-popup");
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
  popup.id = "educational-popup";

  // Style the popup with !important to prevent platform interference
  popup.style.cssText = `
    position: fixed !important;
    top: 20px !important;
    right: 20px !important;
    width: 280px !important;
    min-height: 360px !important;
    max-height: 480px !important;
    background-color: white !important;
    border: 3px solid #4285f4 !important;
    border-radius: 15px !important;
    padding: 15px !important;
    z-index: 999999 !important;
    box-shadow: 0 8px 16px rgba(0,0,0,0.3) !important;
    font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;
    text-align: center !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    visibility: visible !important;
    opacity: 1 !important;
    transform: none !important;
    margin: 0 !important;
    left: auto !important;
    bottom: auto !important;
    box-sizing: border-box !important;
  `;

  // Force pixelated font on all child elements for X/Twitter
  popup.style.setProperty('font-family', "'Press Start 2P', 'Courier New', 'Monaco', monospace", 'important');

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
    <div style="margin-bottom: -20px; flex-shrink: 0;">
      <img id="brainrot-mascot-gif"
           src="${gifSrc}"
           style="width: 100px; height: 100px;"
           alt="Educational Mascot">
    </div>
    <div style="margin: -20px 0; flex-shrink: 0; display: flex; justify-content: center;" id="logo-container">
    </div>
    <p style="font-size: 8px; color: #000; margin: 5px 0; flex-shrink: 0; font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace;">ANALYZING ${platformName.toUpperCase()} EDUCATIONAL VALUE...</p>
    <div id="analysis-text" style="color: #000 !important; font-size: 12px !important; line-height: 1.3 !important; flex: 1; overflow-y: auto; word-wrap: break-word; margin: 8px 0; min-height: 40px; font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">DETECTING LEARNING POTENTIAL...</div>
    <button id="close-popup" style="margin-top: 1px; padding: 6px 10px; background: #f44; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 8px; flex-shrink: 0; font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace;">CLOSE</button>
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

  // Force pixelated font on all elements inside popup for X/Twitter
  const allElements = popup.querySelectorAll('*');
  allElements.forEach(element => {
    element.style.setProperty('font-family', "'Press Start 2P', 'Courier New', 'Monaco', monospace", 'important');
  });

  // Add brainboost.png logo as the title
  const logoContainer = popup.querySelector("#logo-container");
  if (logoContainer) {
    try {
      if (chrome && chrome.runtime && chrome.runtime.getURL) {
        const brainboostSrc = chrome.runtime.getURL("images/brainboostpngversion.png");
        logoContainer.innerHTML = `<img src="${brainboostSrc}" style="height: 160px; width: auto;" alt="Brain Boost Logo">`;
      }
    } catch (e) {
      console.log("Could not load brainboostpngversion.png");
      logoContainer.innerHTML = `<div style="height: 40px; width: 120px; background: #4285f4; color: white; display: flex; align-items: center; justify-content: center; font-size: 10px; font-family: 'Press Start 2P', monospace;">BRAIN BOOST</div>`;
    }
  }

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
        action: "analyzeEducationalValue",
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

function updatePopupWithResults(popup, educationalLevel, analysis, score) {
  const analysisText = popup.querySelector("#analysis-text");
  const scoreDisplay = score ? ` (${score}/100)` : "";

  if (educationalLevel === "HIGH") {
    popup.style.borderColor = "#28a745"; // Green for high educational value
    popup.style.boxShadow = "0 8px 16px rgba(40,167,69,0.3)";
    analysisText.innerHTML = `<strong style="color: #28a745; font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">HIGHLY EDUCATIONAL${scoreDisplay}</strong><br><small style="font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">${analysis}</small>`;

    // Use Billy2000.gif for high educational value (happy Billy)
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

      // Use kawaii billy gif for high educational value (happy Billy)
      try {
        if (chrome && chrome.runtime && chrome.runtime.getURL) {
          gif.src = chrome.runtime.getURL("images/KawaiiBilly.gif");
          console.log("Switched to KawaiiBilly.gif for high educational value");
        } else {
          console.log("Chrome runtime not available, keeping original gif");
        }
      } catch (e) {
        console.error("Error loading KawaiiBilly.gif:", e);
      }

      // Start fast celebration gif animation loop (kawaii effect)
      window.gifLoopInterval = setInterval(() => {
        if (gif.src.includes("KawaiiBilly.gif")) {
          gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
        }
      }, 400); // Fast celebration
    }
  } else if (educationalLevel === "MODERATE") {
    popup.style.borderColor = "#fd7e14"; // Orange for moderate educational value
    popup.style.boxShadow = "0 8px 16px rgba(253,126,20,0.3)";
    analysisText.innerHTML = `<strong style="color: #fd7e14; font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">SOMEWHAT EDUCATIONAL${scoreDisplay}</strong><br><small style="font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">${analysis}</small>`;

    // Use Billy Medium gif for moderate educational value
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

      // Use BillyMedium.gif for moderate educational value
      try {
        if (chrome && chrome.runtime && chrome.runtime.getURL) {
          gif.src = chrome.runtime.getURL("images/BillyMedium.gif");
          console.log(
            "Switched to BillyMedium.gif for moderate educational value"
          );
        } else {
          console.log("Chrome runtime not available, keeping original gif");
        }
      } catch (e) {
        console.error("Error loading BillyMedium.gif:", e);
      }

      // Start medium gif animation loop (moderate enthusiasm)
      window.mediumGifInterval = setInterval(() => {
        if (gif.src.includes("BillyMedium.gif")) {
          gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
        }
      }, 600); // Moderate speed for moderate educational value
    }
  } else {
    // LOW educational value - use red for disappointment and BillyRIP.gif
    popup.style.borderColor = "#dc3545"; // Red for low educational value
    popup.style.boxShadow = "0 8px 16px rgba(220,53,69,0.3)";
    analysisText.innerHTML = `<strong style="color: #dc3545; font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">LOW EDUCATIONAL VALUE${scoreDisplay}</strong><br><small style="font-family: 'Press Start 2P', 'Courier New', 'Monaco', monospace !important;">${analysis}</small>`;

    // Use BillyRIP.gif for low educational value (sad Billy)
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

      // Switch to BillyRIP.gif for low educational value (disappointment)
      try {
        if (chrome && chrome.runtime && chrome.runtime.getURL) {
          gif.src = chrome.runtime.getURL("images/BillyRIP.gif");
          console.log("Switched to BillyRIP.gif for low educational value");
        } else {
          console.log("Chrome runtime not available, keeping original gif");
        }
      } catch (e) {
        console.error("Error loading BillyRIP.gif:", e);
      }

      // Start slow disappointed gif animation loop
      window.ripGifInterval = setInterval(() => {
        if (gif.src.includes("BillyRIP.gif")) {
          gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
        }
      }, 1000); // Slow for disappointment
    }
  }
}

function highlightEducationalContent() {
  const hostname = window.location.hostname;

  if (hostname.includes("instagram")) {
    highlightInstagramContent();
  } else if (hostname.includes("tiktok")) {
    highlightTikTokContent();
  } else if (hostname.includes("youtube")) {
    highlightYouTubeContent();
  }

  // Show success message
  showEducationalBoostMessage();
}

function showEducationalBoostMessage() {
  const successMsg = document.createElement("div");
  successMsg.style.position = "fixed";
  successMsg.style.top = "10px";
  successMsg.style.left = "50%";
  successMsg.style.transform = "translateX(-50%)";
  successMsg.style.background = "#28a745";
  successMsg.style.color = "white";
  successMsg.style.padding = "10px 20px";
  successMsg.style.borderRadius = "5px";
  successMsg.style.zIndex = "10001";
  successMsg.style.fontWeight = "bold";
  successMsg.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  successMsg.innerHTML = "🎓 EDUCATIONAL CONTENT HIGHLIGHTED!";

  document.body.appendChild(successMsg);

  setTimeout(() => {
    successMsg.style.opacity = "0";
    successMsg.style.transition = "opacity 0.5s ease";
    setTimeout(() => successMsg.remove(), 500);
  }, 2500);
}

function highlightInstagramContent() {
  // Highlight educational posts/reels
  const posts = document.querySelectorAll('article, [role="presentation"]');
  posts.forEach((post) => {
    if (post.offsetHeight > 100) {
      // Only highlight actual content posts
      post.style.opacity = "0.3";
      post.style.filter = "blur(5px)";
      post.style.pointerEvents = "none";

      // Add educational highlight overlay
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.top = "50%";
      overlay.style.left = "50%";
      overlay.style.transform = "translate(-50%, -50%)";
      overlay.style.background = "rgba(40, 167, 69, 0.9)";
      overlay.style.color = "white";
      overlay.style.padding = "20px";
      overlay.style.borderRadius = "10px";
      overlay.style.zIndex = "1000";
      overlay.style.textAlign = "center";
      overlay.innerHTML =
        "🎓 EDUCATIONAL CONTENT<br><small>Highlighted by Brain Boost</small>";

      post.style.position = "relative";
      post.appendChild(overlay);
    }
  });
}

function highlightTikTokContent() {
  // Highlight educational TikTok videos
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
    overlay.style.background = "rgba(40, 167, 69, 0.9)";
    overlay.style.color = "white";
    overlay.style.padding = "15px";
    overlay.style.borderRadius = "8px";
    overlay.style.zIndex = "1000";
    overlay.innerHTML = "🎓 EDUCATIONAL CONTENT";

    video.style.position = "relative";
    video.appendChild(overlay);
  });
}

function highlightYouTubeContent() {
  // Highlight educational YouTube videos
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
      overlay.style.background = "rgba(40, 167, 69, 0.8)";
      overlay.style.color = "white";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "1000";
      overlay.innerHTML = "🎓 EDUCATIONAL CONTENT";

      video.style.position = "relative";
      video.appendChild(overlay);
    }
  });
}
