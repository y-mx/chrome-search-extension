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
let contextMenuItem2 = {
  "id": "openPopup",
  "title": "Open Dialog",
  "contexts": ["selection"],
};
let contextMenuItem3 = {
  "id": "addPalette",
  "title": "Add to Palette",
  "contexts": ["selection"],
};
chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.create(contextMenuItem2);
chrome.contextMenus.create(contextMenuItem3);

let windowId;

chrome.contextMenus.onClicked.addListener(
    async function(info) {
        if(info.menuItemId === "copyLog") {
            chrome.runtime.sendMessage({type: "copy selection", url: info.pageUrl, text: info.selectionText, time: Date.now()})
            const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true, })
            copySelection(info.selectionText, tab);
        } else if(info.menuItemId === "openPopup") {  
          const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true, })
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              // todo: make unique ids
              // add message listener for close/open and resize iframe

              var r=window.getSelection().getRangeAt(0).getBoundingClientRect();
              var relative=document.body.parentNode.getBoundingClientRect();
              console.log(r);
              console.log(relative);
              var top =(r.bottom -relative.top)-200-r.height;
              var right=-(r.right-relative.right)-200+r.width;
              console.log(top)
              console.log(right)
              const iframe = document.createElement('iframe');
              iframe.setAttribute('id', 'cm-frame');
              iframe.setAttribute(
                'style',
                `top: ${top}px; right: ${right}px; width: fit-content;height: fit-content;z-index: 2147483650;border: none; position:absolute;border:grey solid 1px;
                background:white;`
              );
              iframe.setAttribute('allow', '');
              iframe.src = chrome.runtime.getURL('dialog.html');
        
              document.body.appendChild(iframe);
            },
          });
        } else if(info.menuItemId === "addPalette") {
          chrome.windows.update(windowId,
            {
              focused: true
            }
          )
          chrome.runtime.sendMessage({type: "add palette", url: info.pageUrl, text: info.selectionText, time: Date.now()})
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