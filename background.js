// Listener for when the user clicks the extension's icon
chrome.action.onClicked.addListener((tab) => {
  // Inject the content script into the current page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content.js']
  });
});

// Listener for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CONVERSATIONS') {
    // Save the conversations to chrome.storage
    chrome.storage.local.set({ conversations: request.data });
  }
});
