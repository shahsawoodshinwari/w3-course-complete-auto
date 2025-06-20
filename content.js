let clickingInterval;
let isClicking = false;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startClicking") {
    startClicking();
  } else if (request.action === "stopClicking") {
    stopClicking();
  }
});

// Check storage for active state when content script loads
chrome.storage.local.get(['clickingActive'], (result) => {
  if (result.clickingActive) {
    startClicking();
  }
});

function startClicking() {
  if (isClicking) return;
  isClicking = true;
  
  clickingInterval = setInterval(() => {
    const buttons = document.querySelectorAll('a.btn.btn-secondary[href*="/mod/book/view.php"]');
    const nextButton = Array.from(buttons).reverse().find(button => button.textContent.trim() === "Next");
    
    if (nextButton) {
      console.log("Clicking Next button");
      nextButton.click();
    } else {
      console.log("Next button not found - stopping");
      stopClicking();
      // Update popup status
      chrome.storage.local.set({clickingActive: false});
      chrome.runtime.sendMessage({action: "updateStatus", active: false});
    }
  }, 2000); // 2 second delay between checks
}

function stopClicking() {
  clearInterval(clickingInterval);
  isClicking = false;
}