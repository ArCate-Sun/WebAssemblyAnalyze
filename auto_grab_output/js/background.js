let host = undefined;
let port = undefined;

let running = false;

let lastTab = undefined;
var htmls = undefined;
var directories = undefined;
var output = undefined;

function showResult() {
    chrome.tabs.create({
        url: chrome.extension.getURL("html/result.html"),
        active: true
    })
}

function openNextWasmHtml() {

    if (!running) {
        return;
    }

    let url = htmls.shift() || directories.shift();
    if (url === undefined) {
        showResult();
        stop();
        return;
    }
    url = `${host}:${port}${url}`;

    chrome.tabs.create({
        url: url,
        active: true
    }, function (tab) {
        lastTab = tab;
        console.log("[Auto Grap Output for WASM HTML] Open:", url)
    });
}

// 开始任务
function start(_host, _port) {

    console.log("[Auto Grap Output for WASM HTML] Start Task!");

    host = _host;
    port = _port;

    running = true;

    lastTab = undefined;
    htmls = [];
    directories = ["/"];
    output = [];

    openNextWasmHtml();
}

function stop() {

    console.log("[Auto Grap Output for WASM HTML] Stop Task!");

    running = false;

    lastTab = undefined;
    htmls = undefined;
    directories = undefined;
}

// 验证消息来源
function verifyMessage(msg) {
    return msg.extension === "auto-grab-output-for-wasm" && msg.dest === "background";
}

// 接受来自 content js 的信息
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

    if (!running) {
        return;
    }

    if (!verifyMessage(message)) {
        return;
    }

    let tab = sender.tab;
    let pathname = message.pathname;
    let data = message.data;

    if (tab.id !== lastTab.id) {
        return;
    }

    switch (message.cmd) {
        case "list":
            htmls = htmls.concat(data.htmls);
            directories = directories.concat(data.directories);
            console.log(directories)
            chrome.tabs.remove(lastTab.id);
            openNextWasmHtml();
            break;
        case "output":
            // escape data
            data = data.replace(/\n/g, "\\n").replace(/\t/g, "\\t");
            output.push({
                id: pathname,
                output: data
            });
            chrome.tabs.remove(lastTab.id);
            openNextWasmHtml();
            break;
        case "skip":
            chrome.tabs.remove(lastTab.id);
            openNextWasmHtml();
            break;
        case "stop":
            running = false;
            break;
    }
});
