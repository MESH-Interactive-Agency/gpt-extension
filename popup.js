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

function groupConversationsByFolder(conversations) {
  console.log(conversations);
  let grouped = {};
  conversations.forEach((conversation) => {
    if (!grouped[conversation.folder]) {
      grouped[conversation.folder] = [];
    }
    grouped[conversation.folder].push(conversation);
  });
  return grouped;
}

function updateConversations() {
  // Get the conversations list element
  let conversationsList = document.getElementById('conversations');
  conversationsList.innerHTML = ''; // Clear the list

  // Replace the data from chrome.storage with dummy data
  let conversations = conversationsWithFolders;

  console.log('should be array', conversations);

  // Group conversations by folder
  let conversationsByFolder = groupConversationsByFolder(conversations);

  // Display each folder
  for (let folder in conversationsByFolder) {
    // Create a list for the folder
    let folderList = document.createElement('ul');
    let folderLabel = document.createElement('h2');
    folderLabel.textContent = folder;
    folderList.appendChild(folderLabel);

    // Add drop event listener
    folderList.addEventListener('drop', (event) => {
      event.preventDefault();
      let name = event.dataTransfer.getData('text/plain');
      let conversation = conversations.find((c) => c.name === name);
      if (conversation) {
        conversation.folder = folder;
        updateConversations(); // Refresh the list
      }
    });

    // Add dragover event listener
    folderList.addEventListener('dragover', (event) => {
      event.preventDefault();
      folderList.style.backgroundColor = 'lightgray'; // Change the appearance so the user knows a drop is possible
    });

    // Add dragleave and dragend event listeners to reset appearance
    folderList.addEventListener('dragleave', (event) => {
      folderList.style.backgroundColor = ''; // Reset the appearance
    });
    folderList.addEventListener('dragend', (event) => {
      folderList.style.backgroundColor = ''; // Reset the appearance
    });

    // Display conversations in this folder
    conversationsByFolder[folder].forEach((conversation) => {
      let listItem = document.createElement('li');
      listItem.textContent = conversation.name;
      listItem.draggable = true;
      listItem.addEventListener('click', () => {
        chrome.runtime.sendMessage({
          type: 'CLICK_CONVERSATION',
          position: conversation.position,
        });
      });

      // Add drag event listeners
      listItem.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', conversation.name);
      });

      folderList.appendChild(listItem);
    });

    conversationsList.appendChild(folderList);
  }
}

// Call the update function initially
updateConversations();

// Listen for changes in storage and update the list if conversations have changed
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.conversations) {
    // Conversations in storage have changed, update the list
    updateConversations();
  }
});
