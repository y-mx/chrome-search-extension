chrome.webNavigation.onCommitted.addListener(
    function(details) {
        var transition = details.transitionType;
        if(transition !== 'link' && transition !== 'typed' && transition !== 'generated' && transition !== 'form_submit') return
        chrome.runtime.sendMessage({type: "request url", url: details.url, time: Date.now(), transition: details.transitionType})
    },
    {
        urls: ["<all_urls>"],
    }
  );
let contextMenuItem = {
    "id": "copyLog",
    "title": "Copy and Log",
    "contexts": ["selection"],
};
chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(
    async function(info) {
        if(info.menuItemId === "copyLog") {
            chrome.runtime.sendMessage({type: "copy selection", url: info.pageUrl, text: info.selectionText, time: Date.now()})
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true, })
            copySelection(info.selectionText, tab);
        }
      }
  )

  function contentCopy(text) {
    navigator.clipboard.writeText(text);
  }

  async function copySelection(text, tab) {
    console.log(tab);
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: contentCopy,
      args: [text],
    });
  }