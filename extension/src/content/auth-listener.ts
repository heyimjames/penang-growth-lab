// Content script that listens for auth messages from the extension callback page

window.addEventListener("message", (event) => {
  // Only accept messages from the same origin
  if (event.origin !== window.location.origin) return

  if (event.data?.type === "NOREPLY_AUTH_CALLBACK") {
    const { access_token, refresh_token, user } = event.data.payload

    // Send the tokens to the extension's background script
    chrome.runtime.sendMessage({
      type: "AUTH_CALLBACK",
      payload: {
        access_token,
        refresh_token,
        user,
      },
    })
  }
})
