
var closeButton = document.getElementById("closeButton")
var id = window.frameElement.id;
closeButton.addEventListener("click", close);
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("dailog")
        console.log(document)
        console.log(close)
        if (request.type === "add palette") {
            var palette = document.getElementById("palette");
            palette.innerHTML += `<h>${request.text}</h><p>${request.url}</p>`
        }
    }
);

function close() {
    console.log("close")
    var content = document.getElementById("content")
    if(content.style.display == 'none') {
        content.style.display = 'block';
    } else {
        content.style.display = 'none';
    }
    window.parent.document.getElementById('cm-frame').width = 'fit-content'
    window.parent.document.getElementById('cm-frame').height = 'fit-content'
}
