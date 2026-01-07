// NoReply Extension Service Worker

// Open side panel when extension icon is clicked
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id })
  }
})

// Set side panel behavior - open on action click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "GET_CURRENT_TAB") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({ tab: tabs[0] })
      }
    })
    return true // Keep the message channel open for async response
  }

  if (message.type === "GET_AUTH_STATUS") {
    // Check if user is authenticated by checking stored tokens
    chrome.storage.local.get(["user", "access_token"], (result) => {
      const authenticated = !!(result.user && result.access_token)
      sendResponse({ authenticated, user: result.user || null })
    })
    return true
  }

  if (message.type === "AUTH_CALLBACK") {
    // Store auth tokens from the callback page
    const { access_token, refresh_token, user } = message.payload
    chrome.storage.local.set({
      access_token,
      refresh_token,
      user,
    }, () => {
      console.log("NoReply: Auth tokens stored successfully")
      // Notify the sidepanel to refresh auth state
      chrome.runtime.sendMessage({ type: "AUTH_STATE_CHANGED", user })
      sendResponse({ success: true })
    })
    return true
  }

  if (message.type === "LOGOUT") {
    // Clear stored tokens
    chrome.storage.local.remove(["access_token", "refresh_token", "user"], () => {
      console.log("NoReply: Logged out")
      chrome.runtime.sendMessage({ type: "AUTH_STATE_CHANGED", user: null })
      sendResponse({ success: true })
    })
    return true
  }
})

// Log when extension is installed or updated
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    console.log("NoReply extension installed")
  } else if (details.reason === "update") {
    console.log("NoReply extension updated to version", chrome.runtime.getManifest().version)
  }
})
