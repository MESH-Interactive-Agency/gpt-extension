// Function to update the conversations list
function updateConversations() {
  // Get the conversations list element
  let conversationsList = document.getElementById('conversations');
  conversationsList.innerHTML = ''; // Clear the list

  // Fetch the conversations from chrome.storage
  chrome.storage.local.get('conversations', (data) => {
    console.log('Data retrieved from chrome.storage:', data);
    let conversations = data.conversations || [];
    console.log('should be array', conversations);
    // Display conversations
    conversations.forEach((conversation) => {
      let listItem = document.createElement('li');
      listItem.textContent = conversation.name;
      listItem.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          type: 'CLICK_CONVERSATION',
          position: conversation.position,
        });
      });

      conversationsList.appendChild(listItem);
    });
  });
}

// Call the update function initially
updateConversations();

// Listen for changes in storage
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.conversations) {
    // Conversations in storage have changed, update the list
    updateConversations();
  }
});
