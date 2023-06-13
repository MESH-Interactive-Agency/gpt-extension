// Fetch the conversations from chrome.storage
chrome.storage.local.get('conversations', (data) => {
  console.log('Data retrieved from chrome.storage:', data);
  // Get the conversations array from the data
  let conversations = data.conversations || [];

  // Get the conversations list element
  let conversationsList = document.getElementById('conversations');

  // Get the folders container element
  let foldersContainer = document.getElementById('folders-container');

  // Create dynamic folders
  const folders = ['Folder 1', 'Folder 2', 'None']; // Replace with your dynamic folder data
  folders.forEach((folderName) => {
    let folder = document.createElement('div');
    folder.className = 'folder';
    folder.textContent = folderName;
    folder.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    });

    folder.addEventListener('drop', (e) => {
      e.preventDefault();
      const conversationData = JSON.parse(
        e.dataTransfer.getData('text/custom')
      );
      const newFolder = folder.textContent.trim();

      if (newFolder === 'None') {
        conversationData.folder = null;
      } else {
        conversationData.folder = newFolder;
      }

      const conversationElement = document.createElement('li');
      conversationElement.textContent = conversationData.name;
      conversationElement.draggable = true; // Enable dragging
      conversationElement.setAttribute('data-folder', conversationData.folder); // Set folder attribute
      conversationsList.appendChild(conversationElement);

      // Add event listener for drag start
      conversationElement.addEventListener('dragstart', (event) => {
        event.dataTransfer.setData('text/plain', conversationData.name);
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData(
          'text/custom',
          JSON.stringify(conversationData)
        ); // Store conversation data
      });

      chrome.storage.local.get('conversations', (data) => {
        const savedConversations = data.conversations || [];
        savedConversations.push(conversationData);
        chrome.storage.local.set({ conversations: savedConversations });
      });

      e.target.querySelector('ul').appendChild(conversationElement);
    });

    let folderList = document.createElement('ul');
    folder.appendChild(folderList);
    foldersContainer.appendChild(folder);
  });
});
