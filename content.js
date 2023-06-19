console.log('content.js script loaded');
// function fetchConversations() {
//   let conversationElements = Array.from(
//     document.querySelectorAll(
//       '.flex-1.text-ellipsis.max-h-5.overflow-hidden.break-all.relative'
//     )
//   );
//   let conversations = conversationElements.map((el, index) => ({
//     name: el.textContent,
//     position: index,
//     folder: 'none',
//   }));
//   console.log('Fetching conversations:', conversations);
//   chrome.runtime.sendMessage({
//     type: 'CONVERSATIONS',
//     data: conversations,
//   });
// }

// document.addEventListener('DOMContentLoaded', fetchConversations);
