document.getElementById('toggle').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const button = document.getElementById('toggle');
      const status = document.getElementById('status');
      
      if (button.textContent === 'Start Clicking') {
        button.textContent = 'Stop Clicking';
        status.textContent = 'Status: Active';
        chrome.storage.local.set({clickingActive: true});
        chrome.tabs.sendMessage(tabs[0].id, {action: "startClicking"});
      } else {
        button.textContent = 'Start Clicking';
        status.textContent = 'Status: Inactive';
        chrome.storage.local.set({clickingActive: false});
        chrome.tabs.sendMessage(tabs[0].id, {action: "stopClicking"});
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