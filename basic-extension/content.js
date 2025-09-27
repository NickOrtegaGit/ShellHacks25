console.log("Brainrot Shield running on:", window.location.hostname);

// Detect multiple platforms
const platform = getPlatformName();
if (platform) {
  setTimeout(() => {
    createBrainrotPopup(platform);
  }, 2000);
}

function getPlatformName() {
  const hostname = window.location.hostname;
  if (hostname.includes('instagram')) return 'Instagram';
  if (hostname.includes('tiktok')) return 'TikTok';
  if (hostname.includes('youtube')) return 'YouTube';
  if (hostname.includes('twitter') || hostname.includes('x.com')) return 'Twitter';
  return null; // Not a supported platform
}

function createBrainrotPopup(platformName) {
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
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.textAlign = "center";
  popup.style.overflow = "hidden";
  popup.style.display = "flex";
  popup.style.flexDirection = "column";

  // Add content with your custom GIF
  popup.innerHTML = `
    <div style="margin-bottom: 10px; flex-shrink: 0;">
      <img id="brainrot-mascot-gif"
           src="${chrome.runtime.getURL("images/Billy2000.gif")}"
           style="width: 50px; height: 50px;"
           alt="Brainrot Mascot">
    </div>
    <h3 style="margin: 8px 0; color: #333; font-size: 16px; flex-shrink: 0;">🧠 Brainrot Shield</h3>
    <p style="font-size: 11px; color: #666; margin: 3px 0; flex-shrink: 0;">Analyzing ${platformName}...</p>
    <div id="analysis-text" style="color: #666; font-size: 12px; line-height: 1.3; flex: 1; overflow-y: auto; word-wrap: break-word; margin: 8px 0;">AI is thinking...</div>
    <button id="close-popup" style="margin-top: 8px; padding: 6px 12px; background: #f44; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 12px; flex-shrink: 0;">Close</button>
  `;

  // Add close functionality
  const closeBtn = popup.querySelector("#close-popup");
  closeBtn.addEventListener("click", () => {
    popup.remove();
    // Stop the GIF loop when popup is closed
    if (window.gifLoopInterval) {
      clearInterval(window.gifLoopInterval);
    }
  });

  document.body.appendChild(popup);

  // START GIF INFINITE LOOP
  const gif = popup.querySelector('#brainrot-mascot-gif');
  if (gif) {
    window.gifLoopInterval = setInterval(function() {
      // Force GIF to restart by changing its source
      gif.src = gif.src.split('?')[0] + '?t=' + Date.now();
    }, 500); // Every 500ms
  }

  // REAL AI ANALYSIS
  setTimeout(() => {
    // Get page content for analysis - platform specific
    const pageText = getPageContent(platformName);
    
    // Send to background script for AI analysis
    chrome.runtime.sendMessage({
      action: 'analyzeBrainrot',
      data: {
        platform: platformName,
        text: pageText,
        url: window.location.href
      }
    }, (response) => {
      if (response && !response.error) {
        updatePopupWithResults(popup, response.category, response.reason, response.score);
      } else {
        updatePopupWithResults(popup, "MODERATE", "Analysis failed - using default", 50);
      }
    });
  }, 2000); // Wait 2 seconds before analyzing
}

function getPageContent(platformName) {
  // Get platform-specific content for better analysis
  let content = "";
  
  try {
    switch(platformName) {
      case 'Instagram':
        // Try to get post captions and comments
        const igCaptions = document.querySelectorAll('article span, [data-testid="post-caption"]');
        igCaptions.forEach(el => content += el.textContent + " ");
        break;
        
      case 'TikTok':
        // Try to get video descriptions
        const ttDescriptions = document.querySelectorAll('[data-e2e="browse-video-desc"], [data-e2e="video-desc"]');
        ttDescriptions.forEach(el => content += el.textContent + " ");
        break;
        
      case 'YouTube':
        // Try to get video titles and descriptions
        const ytTitles = document.querySelectorAll('h1.title, #video-title, #meta h1');
        const ytDescriptions = document.querySelectorAll('#description, .description');
        ytTitles.forEach(el => content += el.textContent + " ");
        ytDescriptions.forEach(el => content += el.textContent + " ");
        break;
        
      case 'Twitter':
        // Try to get tweet text
        const tweets = document.querySelectorAll('[data-testid="tweetText"], .tweet-text');
        tweets.forEach(el => content += el.textContent + " ");
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
  
  // Create score display
  const scoreDisplay = score ? ` (${score}/100)` : '';
  
  if (riskLevel === "HIGH") {
    popup.style.borderColor = "red";
    popup.style.boxShadow = "0 8px 16px rgba(255,0,0,0.3)";
    analysisText.innerHTML = `<strong style="color: red;">🚨 HIGH BRAINROT${scoreDisplay}</strong><br><small>${analysis}</small>`;
  } else if (riskLevel === "MODERATE") {
    popup.style.borderColor = "orange";
    popup.style.boxShadow = "0 8px 16px rgba(255,165,0,0.3)";
    analysisText.innerHTML = `<strong style="color: orange;">⚠️ MODERATE BRAINROT${scoreDisplay}</strong><br><small>${analysis}</small>`;
  } else {
    popup.style.borderColor = "green";
    popup.style.boxShadow = "0 8px 16px rgba(0,255,0,0.3)";
    analysisText.innerHTML = `<strong style="color: green;">✅ BRAIN SAFE${scoreDisplay}</strong><br><small>${analysis}</small>`;
  }
}