var loglist = [];
function search() {
    var searchField = document.getElementById("search");
    var logs = document.getElementById("logs");
    loglist.push(JSON.stringify({logType:"search", terms:searchField.value, timestamp:Date.now()})+"\n");
    logs.innerHTML += `<p>Searched: ${searchField.value} at ${Date.now()}</p>`
    const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(searchField.value);
    chrome.tabs.create({ url: newURL });
    console.log(searchField.value)
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "request url") {
            var logs = document.getElementById("logs");
            loglist.push(JSON.stringify({logType:"visit", url:request.url, by:request.transition, timestamp:request.time})+"\n");
            logs.innerHTML += `<p>Visited: ${request.url} at ${request.time} by ${request.transition}</p>`
        } else if (request.type === "copy selection") {
            var logs = document.getElementById("logs");
            loglist.push(JSON.stringify({logType:"copy", url:request.url, selection:request.text, timestamp:request.time})+"\n");
            logs.innerHTML += `<p>Copied: ${request.text} at ${request.time} from ${request.url}</p>`
        }
    }
);

function download() {
    console.log(loglist);
    var blob = new Blob(loglist);
    href = window.webkitURL.createObjectURL(blob);
    var link = document.getElementById("link");
    link.innerHTML = `<a href=\"${href}\" download=\"chrome-logs\"><h1>link</h1></a>`
}
document.getElementById("submit").addEventListener("click", search);
document.getElementById("search").addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        search()
    }
})
document.getElementById("download").addEventListener("click", download);