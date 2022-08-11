    document.getElementById("toggle")?.addEventListener('click', function () {
            console.log(this)
            chrome.tabs.sendMessage(0, "toggle");
    });
