// Fetch the conversations from chrome.storage
chrome.storage.local.get('conversations', (data) => {
  // Get the conversations array from the data
  let conversations = data.conversations;

  // Get the conversations list element
  let conversationsList = document.getElementById('conversations');

  // Create a list item for each conversation and append it to the list
  conversations.forEach((conversation) => {
    let listItem = document.createElement('li');
    listItem.textContent = conversation.name;
    conversationsList.appendChild(listItem);
  });
});
