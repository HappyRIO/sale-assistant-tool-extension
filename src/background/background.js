// Say hello when the extension is first installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("✅ Extension installed!");
});

// Enable side panel
chrome.sidePanel
  .setOptions({
    path: "sidepanel.html",
    enabled: true,
  })
  .then(() => {
    console.log("✅ Side panel enabled");
  })
  .catch((error) => console.error("❌ Error enabling side panel:", error));

// Open side panel when clicking extension icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("❌ Panel behavior error:", error));
