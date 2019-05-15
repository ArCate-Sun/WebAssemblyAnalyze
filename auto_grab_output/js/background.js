var host = "localhost:8080";

let tabId = -1;
let htmlId = -1;
var htmlList = []

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

// 开始任务
function start(_host, _port) {

    console.log("[Auto Grap Output] Start Task!")

    host = _host;
    port = _port;

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
    if (message.src === "ContentJS" && message.dest === "BackgroundJS") {
        switch (message.cmd) {
            case "output":
                let msg = {
                    cmd: "output",
                    data: {
                        id: htmlList[htmlId],
                        output: message.data
                    }
                };
                sendNativeMessage(msg);
        
                openNextWasmHtml();
                break;
            case "skip":
                openNextWasmHtml();
                break;
        }
    }
    
});