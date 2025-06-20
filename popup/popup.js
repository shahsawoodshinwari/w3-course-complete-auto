document.getElementById('request-permission').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);
    const origin = url.origin + '/*';
    chrome.permissions.request({origins: [origin]}, (granted) => {
      if (granted) {
        // Inject content script dynamically
        chrome.scripting.executeScript({
          target: {tabId: tab.id},
          files: ['content.js']
        }, () => {
          alert('Permission granted and content script injected!');
        });
      } else {
        alert('Permission was not granted.');
      }
    });
  });
});

// Update toggle button logic to inject content script if needed
function sendMessageWithInjection(tabId, message) {
  chrome.tabs.sendMessage(tabId, message, (response) => {
    if (chrome.runtime.lastError) {
      // Try injecting the content script and resend the message
      chrome.scripting.executeScript({
        target: {tabId: tabId},
        files: ['content.js']
      }, () => {
        chrome.tabs.sendMessage(tabId, message);
      });
    }
  });
}

document.getElementById('toggle').addEventListener('click', () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const button = document.getElementById('toggle');
    const status = document.getElementById('status');
    const tabId = tabs[0].id;
    
    if (button.textContent === 'Start Clicking') {
      button.textContent = 'Stop Clicking';
      status.textContent = 'Status: Active';
      chrome.storage.local.set({clickingActive: true});
      sendMessageWithInjection(tabId, {action: "startClicking"});
    } else {
      button.textContent = 'Start Clicking';
      status.textContent = 'Status: Inactive';
      chrome.storage.local.set({clickingActive: false});
      sendMessageWithInjection(tabId, {action: "stopClicking"});
    }
  });
});
  
// Check current status on popup open
chrome.storage.local.get(['clickingActive'], (result) => {
  const button = document.getElementById('toggle');
  const status = document.getElementById('status');
  
  if (result.clickingActive) {
    button.textContent = 'Stop Clicking';
    status.textContent = 'Status: Active';
  }
});