var port = null;
var nativeName = "cc.acat.auto_grab_output_for_wasm";

var host = "localhost:8080";

let tabId = -1;
let htmlId = -1;
var htmlList = []

function terminate() {
    let msg = {
        cmd: "terminate"
    }
    sendNativeMessage(msg);
}

function openFirstWasmHtml() {

    htmlId += 1;

    let url = `${host}/${htmlList[htmlId]}`;
    
    if (htmlList.length <= htmlId) {
        return;
    }

    chrome.tabs.create({
        url: url,
        active: true
    }, function(tab) {
        tabId = tab.id
        console.log("open:", url)
    });
}

function openNextWasmHtml() {

    htmlId += 1;
    
    let url = `${host}/${htmlList[htmlId]}`;
    
    if (htmlList.length <= htmlId) {
        terminate();
        return;
    }

    chrome.tabs.update(
        tabId,
        {
            url: url,
            active: true
        },
        function(tab) {
            console.log("open:", url)
        }
    );
}

function sendNativeMessage(message) {
    console.log("send to native:", message)
    if (port) {
        port.postMessage(message);
    }
}

function onNativeMessage(message) {
    console.log("received from native:", message);
    
    if (message.cmd === "get_html_list") {
        htmlList = message.data;
        openFirstWasmHtml();
    }
}

function onDisconnected() {
	port = null;
}

function connectNative() {
    console.log("connect to native.")
    port = chrome.runtime.connectNative(nativeName);
	port.onMessage.addListener(onNativeMessage);
	port.onDisconnect.addListener(onDisconnected);
}

function start(_host, work_dir_path, output_file_path) {

    alert("start")

    host = _host;

    sendNativeMessage({
        cmd: "start",
        data: {
            work_dir_path: work_dir_path,
            output_file_path: output_file_path
        }
    });

}

// 接受来自 content js 的信息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === "output") {

        let msg = {
            cmd: "output",
            data: {
                id: htmlList[htmlId],
                output: message.data
            }
        };

        sendNativeMessage(msg);

        openNextWasmHtml();
    }
});

connectNative();