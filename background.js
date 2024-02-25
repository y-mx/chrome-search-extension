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


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === "collapse dialog") {
      setSize(request.frame, 80, 40).then(sendResponse("response"));
      return true;
    } else if (request.type === "expand dialog") {
      setSize(request.frame, 200, 200).then(sendResponse("response"));
      return true;
    }
  }
);

async function setSize(frame, width, height) {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true, })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (frame, width, height) => {
      divid = frame.replace("iframe", "div")
      f = document.getElementById(divid);
      f.width = width+'px';
      f.height = height+'px';
      f.style.width = width+'px';
      f.style.height = height+'px';
    },
    args: [frame, width, height]
  })

}
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
let iframe_cnt = 0;
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
        func: makeIframe,
        args:[iframe_cnt]
      });
      iframe_cnt++;
    } else if(info.menuItemId === "addPalette") {
      chrome.runtime.sendMessage({type: "add palette", url: info.pageUrl, text: info.selectionText, time: Date.now()})
    }
  }
)

function contentCopy(text) {
  navigator.clipboard.writeText(text);
}

function makeIframe(id) {
  // todo: make unique ids
  // add message listener for close/open and resize iframe
  // todo: make div draggable and resizable, add iframe inside with appendchild
  var r=window.getSelection().getRangeAt(0).getBoundingClientRect();
  var relative=document.body.parentNode.getBoundingClientRect();
  var top =(r.bottom -relative.top)-200-r.height;
  var left=(r.left-relative.left);
  const iframe = document.createElement('iframe');
  const div = document.createElement('div')
  const handle = document.createElement('div')
  const container = document.createElement('div')
  iframe.setAttribute('id', `iframe-${id}`);
  iframe.setAttribute('name', `iframe-${id}`);
  div.setAttribute('id', `div-${id}`);
  div.setAttribute('name', `div-${id}`);
  handle.setAttribute('id', `handle-${id}`);
  handle.setAttribute('name', `handle-${id}`);
  container.setAttribute('id', `container-${id}`);
  container.setAttribute('name', `container-${id}`);
  handle.setAttribute(
    'style',
    'width: 100%; background: #ccc; border: 1px solid #000; border-radius: 4px; height: 23px; margin-bottom: -3px;'
  )
  container.setAttribute(
    'style',
    'width: 100%;'
  )
  iframe.setAttribute(
    'style',
    `width: 100%; height:100%;flex-grow:1;z-index: 2147483650;border:grey solid 1px;
    background:white;`
  );
  div.setAttribute(
    'style',
    'position:absolute;display:flex; margin:0; padding:0; resize:both; overflow:hidden'
  )
  div.style.top = `${top}px`;
  div.style.left = `${left}px`;
  div.setAttribute('width', '200px')
  div.setAttribute('height', '200px')
  iframe.setAttribute('allow', '');
  div.setAttribute('draggable', 'true');
  div.setAttribute('resize', 'both');
  iframe.src = chrome.runtime.getURL('dialog.html');
  div.addEventListener('dragstart',function (e) {
    e.dataTransfer.effectAllowed = 'move';
  })
  div.addEventListener('dragend', function (e) {
    this.style.top = `${e.pageY}px`
    this.style.left = `${e.pageX}px`

  })
  container.appendChild(handle)
  container.appendChild(iframe)
  div.appendChild(container)
  document.body.appendChild(div);
  
}

async function copySelection(text, tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: contentCopy,
    args: [text],
  });
}
