function search() {
    var searchField = document.getElementById("search");
    var logs = document.getElementById("logs");
    logs.innerHTML += `<p>Searched: ${searchField.value} at ${Date.now()}</p>`
    const newURL = 'https://www.google.com/search?q=' + encodeURIComponent(searchField.value);
    chrome.tabs.create({ url: newURL });
    console.log(searchField.value)
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type === "request url") {
            var logs = document.getElementById("logs");
            logs.innerHTML += `<p>Visited: ${request.url} at ${request.time} by ${request.transition}</p>`
        } else if (request.type === "copy selection") {
            var logs = document.getElementById("logs");
            logs.innerHTML += `<p>Copied: ${request.text} at ${request.time} from ${request.url}</p>`
        }
    }
);

document.getElementById("submit").addEventListener("click", search);
document.getElementById("search").addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        search()
    }
})