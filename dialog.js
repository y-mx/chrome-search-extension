
const closeButton = document.getElementById("closeButton")
const frameid = parent.window.frames[window.name].name
closeButton.addEventListener("click", close);
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
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
        closeButton.innerHTML = 'close'
        content.style.display = 'block';
        chrome.runtime.sendMessage({type: "expand dialog", frame: frameid}, (response)=>{
            
        })
    } else {
        closeButton.innerHTML = 'open'
        content.style.display = 'none';
        chrome.runtime.sendMessage({type: "collapse dialog", frame: frameid}, (response)=>{
            
        })
    }
}
