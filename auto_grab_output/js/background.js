var host = undefined;
var port = undefined;

var running = false;

var lastTab = undefined;
var htmls = undefined;
var directories = undefined;
var output = undefined;

function showResult() {

    console.log("[Auto Grap Output for WASM HTML] Show Result!");

    chrome.tabs.create({
        url: chrome.extension.getURL("html/result.html"),
        active: true
    })
}

// 关闭当前页面
function closeCurrentPage() {
    if (lastTab) {
        chrome.tabs.remove(lastTab.id);
        lastTab = undefined;
    }
}

// 打开下一个页面
function openNextPage() {

    if (!running) {
        return;
    }

    let url = htmls.shift() || directories.shift();
    if (url === undefined) {
        // 遍历完成所有 html 后, 结束
        showResult();
        stop();
        return;
    }
    url = `http://${host}:${port}${url}`;

    chrome.tabs.create({
        url: url,
        active: true
    }, function (tab) {
        lastTab = tab;

        // 向页面注入执行的 js 代码
        chrome.tabs.executeScript(tab.id, {
            file: "js/content.js",
            runAt: "document_end"
        });

        console.log("[Auto Grap Output for WASM HTML] Open:", tab.id, url);
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

    openNextPage();
}

function stop() {

    console.log("[Auto Grap Output for WASM HTML] Stop Task!");


    closeCurrentPage();

    running = false;
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
            directories = data.directories.concat(directories);
            closeCurrentPage();
            openNextPage();
            break;
        case "output":
            // escape data
            data = data.replace(/\n/g, "\\n").replace(/\t/g, "\\t");
            output.push({
                id: pathname,
                output: data
            });
            closeCurrentPage();
            openNextPage();
            break;
        case "skip":
            closeCurrentPage();
            openNextPage();
            break;
        case "stop":
            running = false;
            break;
    }
});
