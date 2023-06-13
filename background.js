chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ['content.js'],
        runAt: 'document_idle',
      },
      (result) => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          return;
        }
        const conversations = result[0]?.result || [];
        console.log(
          'Received conversations from content script:',
          conversations
        );
        chrome.storage.local.set({ conversations }, () => {
          console.log('Conversations stored in chrome.storage:', conversations);
        });
      }
    );
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (/^http/.test(tab.url)) {
      getConversations(tab.id);
    }
  });
});

function getConversations(tabId) {
  chrome.scripting.executeScript(
    {
      target: { tabId: tabId },
      function: fetchConversations,
    },
    (result) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
      }
      const conversations = result[0]?.result || [];
      console.log('Received conversations from content script:', conversations);
      chrome.storage.local.set({ conversations }, () => {
        chrome.storage.local.get('conversations', (data) => {
          console.log(
            'Conversations stored in chrome.storage:',
            data.conversations
          );
        });
      });
    }
  );
}

function fetchConversations() {
  const conversations = Array.from(
    document.querySelectorAll(
      '.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative'
    )
  ).map((el, index) => ({
    name: el.textContent,
    position: index,
  }));
  return { conversations };
}
