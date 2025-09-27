document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("testBtn");
  const output = document.getElementById("output");

  button.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = tabs[0].url;

      // LEARNING: Log the URL breakdown
      console.log("Full URL:", url);
      const urlObj = new URL(url);
      console.log("Hostname only:", urlObj.hostname);
      console.log("Pathname:", urlObj.pathname);

      // Platform detection logic
      const hostname = urlObj.hostname;
      let platform = "unknown";
      let brainrotRisk = "LOW";

      if (hostname.includes("tiktok.com")) {
        platform = "TikTok";
        brainrotRisk = "HIGH";
      } else if (hostname.includes("instagram.com")) {
        platform = "Instagram";
        brainrotRisk = "MEDIUM";
      } else if (hostname.includes("youtube.com")) {
        platform = "Youtube";
        brainrotRisk = "LOW";
      } else if (hostname.includes("x.com")) {
        platform = "X";
        brainrotRisk = "HIGH";
      }

      popup.innerHTML = `
  <div style="margin-bottom: 15px;">
    <img src="${chrome.runtime.getURL("images/Billy2000.gif")}" 
         style="width: 60px; height: 60px;" 
         alt="Analyzing...">
  </div>
  <h3 style="margin: 10px 0; color: #333;"> Brainrot Shield</h3>
  <p id="analysis-text" style="color: #666;">Analyzing content...</p>
  <button id="close-popup">Close</button>
`;
    });
  });
});
