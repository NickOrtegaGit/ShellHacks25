console.log("Brainrot Shield running on:", window.location.hostname);

if (window.location.hostname.includes("instagram")) {
  function createBrainrotPopup() {
    // Create popup container
    const popup = document.createElement("div");
    popup.id = "brainrot-popup";

    // Style the popup
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.right = "20px";
    popup.style.width = "300px";
    popup.style.height = "200px";
    popup.style.backgroundColor = "white";
    popup.style.border = "3px solid #4285f4";
    popup.style.borderRadius = "15px";
    popup.style.padding = "20px";
    popup.style.zIndex = "10000";
    popup.style.boxShadow = "0 8px 16px rgba(0,0,0,0.3)";
    popup.style.fontFamily = "Arial, sans-serif";
    popup.style.textAlign = "center";

    // Add content with your custom GIF
    popup.innerHTML = `
      <div style="margin-bottom: 15px;">
        <img id="brainrot-mascot-gif" 
             src="${chrome.runtime.getURL("images/Billy2000.gif")}" 
             style="width: 60px; height: 60px;" 
             alt="Brainrot Mascot">
      </div>
      <h3 style="margin: 10px 0; color: #333;">🧠 Brainrot Shield</h3>
      <p id="analysis-text" style="color: #666;">Analyzing content...</p>
      <button id="close-popup" style="margin-top: 10px; padding: 8px 16px; background: #f44; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
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
    const gif = popup.querySelector("#brainrot-mascot-gif");
    if (gif) {
      window.gifLoopInterval = setInterval(function () {
        // Force GIF to restart by changing its source
        gif.src = gif.src.split("?")[0] + "?t=" + Date.now();
      }, 500); // Every 500ms - adjust timing as needed
    }

    // Simulate analysis (same GIF, different messages)
    setTimeout(() => {
      updatePopupWithResults(popup, "MODERATE", "Instagram content detected");
    }, 3000);
  }

  function updatePopupWithResults(popup, riskLevel, analysis) {
    const analysisText = popup.querySelector("#analysis-text");
    // GIF stays the same, just change colors and text

    if (riskLevel === "HIGH") {
      popup.style.borderColor = "red";
      analysisText.innerHTML = `<strong style="color: red;">HIGH BRAINROT DETECTED!</strong><br>${analysis}`;
    } else if (riskLevel === "MODERATE") {
      popup.style.borderColor = "orange";
      analysisText.innerHTML = `<strong style="color: orange;">Moderate Brainrot</strong><br>${analysis}`;
    } else {
      popup.style.borderColor = "green";
      analysisText.innerHTML = `<strong style="color: green;">Brain Safe!</strong><br>${analysis}`;
    }
  }

  // Trigger popup when page loads
  setTimeout(() => {
    createBrainrotPopup();
  }, 2000);
}
