function getCredentials(url, tabId) {
  chrome.runtime.sendNativeMessage('com.piaotech.chrome.extension.pass',
      { action: "get-creds", url: url },
      function(response) {
        if(response) {
          if(tabId) {
            chrome.tabs.sendMessage(tabId, { action: "fill-creds", url: response.url, credentials: response.credentials });
          } else {
            chrome.runtime.sendMessage({ action: "fill-creds", url: response.url, credentials: response.credentials });
          }
        } else {
          chrome.runtime.sendMessage({ action: "native-app-error" });
        }
      }
  );
}

function getPass(root, url, user, tabId) {
  chrome.runtime.sendNativeMessage('com.piaotech.chrome.extension.pass',
      { action: "get-pass", user: user, path: root + "/" + user },
      function(response) {
        if(response) {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            currentTab = tabs[0];
            var msg = { action: "fill-pass", user: response.user, pass: response.pass };
            chrome.tabs.sendMessage(currentTab.id, msg);
          });
        } else {
          console.log("Native app returned no response");
          chrome.runtime.sendMessage({ action: "native-app-error" });
        }
      }
  );
}

chrome.runtime.onMessage.addListener(function(msg, sender, response) {
  switch(msg.action) {
    case "get-creds":
      if(sender.tab) {
        getCredentials(sender.tab.url, sender.tab.id);
      } else {
        getCredentials(msg.url);
      }
      return false;
    case "get-pass":
      if(sender.tab) {
        getPass(msg.root, msg.url, msg.user, sender.tab.id);
      } else {
        getPass(msg.root, msg.url, msg.user);
      }
      return false;
  }
});

chrome.commands.onCommand.addListener(function(command, sender) {
  switch(command) {
    case "fill-password":
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        currentTab = tabs[0];

        chrome.runtime.sendNativeMessage('com.piaotech.chrome.extension.pass',
          { action: "get-creds", url: currentTab.url },
          function(response) {
            if(response) {
              credential = response.credentials[0];
              getPass(credential[0], credential[1], credential[2]);
            }
          }
        );
      })
  }
})
