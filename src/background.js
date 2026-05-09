// Handles downloads or complex actions (later will expand)
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "DOWNLOAD_SELECTED_ASSIGNMENTS") {
    // TODO: Implement logic to trigger downloading assignments/templates
    sendResponse({ ok: true })
  }
})
