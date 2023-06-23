async function fetchConversations() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: () => {
            const conversations = Array.from(
              document.querySelectorAll(
                '.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative'
              )
            ).map((el, index) => ({
              id: hashCode(el.textContent), // Generate a unique id for each conversation
              name: el.textContent,
              position: index,
              folder: 'None',
              url: window.location.href,
            }));
            return { conversations };
          },
        },
        async (result) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
          } else {
            // Store the conversations in chrome.storage before resolving the promise
            await new Promise((resolve, reject) => {
              chrome.storage.local.set(
                { conversations: result[0].result.conversations },
                resolve
              );
            });
            resolve(result[0].result);
          }
        }
      );
    });
  });
}

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (/^http/.test(tab.url)) {
      fetchConversations()
        .then((result) => {
          const conversations = result.conversations || [];
          console.log(
            'Received conversations from background script:',
            conversations
          );
          chrome.storage.local.set({ conversations }, () => {
            chrome.storage.local.get('conversations', (data) => {
              console.log(
                'Conversations stored in chrome.storage:',
                data.conversations
              );
            });
          });
        })
        .catch((error) => console.error(error));
    }
  });
});

// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'CLICK_CONVERSATION') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: (position) => {
          const conversationElements = Array.from(
            document.querySelectorAll(
              '.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative'
            )
          );
          if (position < conversationElements.length) {
            conversationElements[position].click();
          }
        },
        args: [request.position],
      });
    });
  }
});
