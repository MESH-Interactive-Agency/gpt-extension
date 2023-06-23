// Hashing function
function hashCode(s) {
  let hash = 0;
  if (s.length === 0) {
    return hash;
  }
  for (let i = 0; i < s.length; i++) {
    let char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

let conversationsWithFolders = [
  {
    id: hashCode('MCU Skrull Impersonation in Secret Wars'),
    name: 'MCU Skrull Impersonation in Secret Wars',
    position: 0,
    folder: 'MCU',
  },
  {
    id: hashCode('Understanding Diabetes & Blood Sugar'),
    name: 'Understanding Diabetes & Blood Sugar',
    position: 1,
    folder: 'Health',
  },
  {
    id: hashCode('Popup Folder Management.'),
    name: 'Popup Folder Management.',
    position: 2,
    folder: 'Development',
  },
  // Add more dummy conversations as needed
];

function groupConversationsByFolder(conversations) {
  let grouped = {};
  conversations.forEach((conversation) => {
    if (!grouped[conversation.folder]) {
      grouped[conversation.folder] = [];
    }
    // Maintain the original position of each conversation
    grouped[conversation.folder].push({
      ...conversation,
      position: conversations.indexOf(conversation),
    });
  });
  return grouped;
}

// In the function where you handle moving conversations or creating new folders:
let folders = ['MCU', 'Health', 'Development']; // Retrieve this from chrome.storage and update it as needed
chrome.storage.local.set({ folders });

// In the updateConversations function:
chrome.storage.local.get('folders', (data) => {
  let folders = data.folders || [];
  let conversationsByFolder = groupConversationsByFolder(conversations);

  // Create a ul element for each folder
  folders.forEach((folder) => {
    let folderConversations = conversationsByFolder[folder] || [];
    // Rest of the code for creating and appending the ul element
  });
});

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
        let selectedConversation = conversations.find(
          (c) => c.id === conversation.id
        );
        chrome.runtime.sendMessage({
          type: 'CLICK_CONVERSATION',
          position: selectedConversation.position, // Use the original position of the conversation
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

document.getElementById('add-folder-button').addEventListener('click', () => {
  let newFolderName = document.getElementById('new-folder-input').value;

  // Add the new folder to the list of folders in chrome.storage
  chrome.storage.local.get('folders', (data) => {
    let folders = data.folders || [];
    if (!folders.includes(newFolderName)) {
      folders.push(newFolderName);
      chrome.storage.local.set({ folders });

      // Clear the input field
      document.getElementById('new-folder-input').value = '';

      updateConversations(); // Refresh the list
    }
  });
});
