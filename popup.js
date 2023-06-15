// Fetch the conversations from chrome.storage
chrome.storage.local.get('conversations', (data) => {
  console.log('Data retrieved from chrome.storage:1', data);
  // Get the conversations array from the data
  let conversations = data.conversations.conversations || [];
  console.log('Popup conversations:', conversations);

  // Get the conversations list element
  let conversationsList = document.getElementById('conversations');

  // Get the folders container element
  let foldersContainer = document.getElementById('folders-container');

  // Create dynamic folders
  const folders = ['Folder 1', 'Folder 2', 'None']; // Replace with your dynamic folder data

  folders.forEach((folderName) => {
    //console.log(folders, folderName);
    let folder = document.createElement('div');
    folder.className = 'folder';
    folder.textContent = folderName;
    folder.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    folder.addEventListener('drop', (e) => {
      e.preventDefault();
      const conversationId = e.dataTransfer.getData('text/plain');
      const newFolder = folder.textContent.trim();

      // Update the conversation's folder attribute
      conversations.forEach((conversation) => {
        if (conversation.id === conversationId) {
          conversation.folder = newFolder;
        }
      });

      // Save the updated conversations to chrome.storage
      chrome.storage.local.set({ conversations }, () => {
        console.log('Conversations updated:', conversations);
      });
    });

    foldersContainer.appendChild(folder);
  });

  // Display conversations under their respective folders
  conversations.forEach((conversation) => {
    console.log('test:', conversation.name, 'of', conversations);
    let listItem = document.createElement('li');
    listItem.textContent = conversation.name;
    listItem.draggable = true; // Enable dragging
    listItem.setAttribute('data-folder', conversation.folder); // Set folder attribute

    console.log(foldersContainer);
    // Find the folder element for the conversation's folder
    const folder = Array.from(
      foldersContainer.getElementsByClassName('folder')
    ).find(
      (folder) => folder.textContent.trim() === (conversation.folder || 'None')
    );

    folder.appendChild(listItem);

    // Add event listener for drag start
    listItem.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', conversation.id);
    });
  });
});

// Handle folder creation
const createFolderButton = document.getElementById('create-folder-button');
createFolderButton.addEventListener('click', () => {
  const folderNameInput = document.getElementById('folder-name-input');
  const folderName = folderNameInput.value.trim();

  // Create a new folder element
  let folder = document.createElement('div');
  folder.className = 'folder';
  folder.textContent = folderName;
  folder.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  });

  folder.addEventListener('drop', (e) => {
    e.preventDefault();
    const conversationId = e.dataTransfer.getData('text/plain');
    const newFolder = folder.textContent.trim();

    // Update the conversation's folder attribute
    conversations.forEach((conversation) => {
      if (conversation.id === conversationId) {
        conversation.folder = newFolder;
      }
    });

    // Save the updated conversations to chrome.storage
    chrome.storage.local.set({ conversations }, () => {
      console.log('Conversations updated:', conversations);
    });
  });

  // Append the new folder to the folders container
  foldersContainer.appendChild(folder);

  // Clear the folder name input
  folderNameInput.value = '';
});
