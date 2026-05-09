// Content script stub for Canvas page scraping
// Later: add logic to detect courses & assignments
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "FETCH_COURSES_AND_ASSIGNMENTS") {
    // Placeholder: Example format
    sendResponse({
      courses: [
        {
          id: "12345",
          name: "Example Course",
          assignments: [
            { id: "a1", name: "Assignment 1", hasTemplate: true },
            { id: "a2", name: "Assignment 2", hasTemplate: false }
          ]
        }
      ]
    })
  }

  if (msg.action === "DOWNLOAD_SELECTED_ASSIGNMENTS") {
    // This will handle the download via more advanced logic later
    // Pass to background script, or call download logic here
    // For now, just acknowledge
    sendResponse({ ok: true })
  }
})
