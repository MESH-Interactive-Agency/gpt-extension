let conversationsWithFolders = [
  {
    name: 'MCU Skrull Impersonation in Secret Wars',
    position: 0,
    folder: 'MCU',
  },
  {
    name: 'Understanding Diabetes & Blood Sugar',
    position: 1,
    folder: 'Health',
  },
  { name: 'Popup Folder Management.', position: 2, folder: 'Development' },
  // Add more dummy conversations as needed
];

function updateConversations() {
  // Get the conversations container element
  let conversationsContainer = document.getElementById('conversations');
  conversationsContainer.innerHTML = ''; // Clear the container

  // Fetch the conversations from chrome.storage
  chrome.storage.local.get('conversations', (data) => {
    console.log('Data retrieved from chrome.storage:', data);
    let conversations = data.conversations || [];
    console.log('should be array', conversations);

    // Update conversations with folder information
    conversations.forEach((conversation) => {
      let matchingConversation = conversationsWithFolders.find(
        (c) => c.name === conversation.name
      );
      if (matchingConversation) {
        conversation.folder = matchingConversation.folder;
      }
    });

    // Group conversations by folder
    let conversationsByFolder = {};
    conversations.forEach((conversation) => {
      if (!conversationsByFolder[conversation.folder]) {
        conversationsByFolder[conversation.folder] = [];
      }
      conversationsByFolder[conversation.folder].push(conversation);
    });

    // Display conversations
    for (let folder in conversationsByFolder) {
      // Create a list for the folder
      let folderList = document.createElement('ul');
      let folderLabel = document.createElement('h2');
      folderLabel.textContent = folder;
      folderList.appendChild(folderLabel);

      // Add conversations to the list
      conversationsByFolder[folder].forEach((conversation) => {
        let listItem = document.createElement('li');
        listItem.textContent = conversation.name;
        listItem.addEventListener('click', () => {
          chrome.runtime.sendMessage({
            type: 'CLICK_CONVERSATION',
            position: conversation.position,
          });
        });

        folderList.appendChild(listItem);
      });

      // Add the list to the container
      conversationsContainer.appendChild(folderList);
    }
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
