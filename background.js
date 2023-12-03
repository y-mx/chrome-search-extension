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