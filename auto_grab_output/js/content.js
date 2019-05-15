const HTML_WASM = "HTML-WASM";
const HTML_LIST = "HTML-LIST";
const HTML_UNKNOWN = "HTML-UNKNOWN"

// 获取页面类型
// 页面类型分为: WASM 页面(HTML_WASM), 列表页面(HTML_LIST), 其他页面(HTML_UNKNOWN)
function judgePageType(document) {
    let title = document.title;
    if (title === "Emscripten-Generated Code") {
        return HTML_WASM;
    } else if (title.indexOf("Directory listing for") >= 0) {
        return HTML_LIST;
    } else {
        return HTML_UNKNOWN;
    }
}

// 获取列表页面中的内容
function getItemsFromListHtml(document) {
    let items = [];
    let liList = document.getElementsByTagName("li");
    for (let i = 0; i < liList.length; i++) {
        let a = liList[i].getElementsByTagName("a")[0];
        if (a) {
            let href = a.attributes.href.value;
            href = `${window.location.pathname}${href}`;
            items.push(href);
        }
    }
    return items;
}

// 提取列表中的 html
function extractHtmlsFromList(list) {
    let result = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].endsWith(".html")) {
            result.push(list[i]);
        }
    }
    return result;
}

// 提取列表中的 directory
function extractDirectoriesFromList(list) {
    let result = [];
    for (let i = 0; i < list.length; i++) {
        if (list[i].endsWith("/")) {
            result.push(list[i]);
        }
    }
    return result;
}

function start() {

    let msg = {
        extension: "auto-grab-output-for-wasm",
        dest: "background",
        cmd: undefined,
        src: "content",
        pathname: window.location.pathname,
        data: undefined
    }

    let pageType = judgePageType(document);

    switch (pageType) {
        case HTML_LIST:

            // 获取内容
            let items = getItemsFromListHtml(document);
            let htmls = extractHtmlsFromList(items);
            let directories = extractDirectoriesFromList(items);
            
            // 组合消息
            msg.cmd = "list";
            msg.data = {
                htmls: htmls,
                directories: directories
            };

            // 发送消息
            chrome.runtime.sendMessage(msg);

            break;

        case HTML_WASM:

            let status = document.getElementById("status");
            let output = document.getElementById("output");
        
            let interval = setInterval(() => {
                if (status.innerHTML === "") {
                    clearInterval(interval);
            
                    // 获得 wasm 的输出,
                    // 并组合消息
                    msg.cmd = "output";
                    msg.data = output.value;
        
                    // 发送消息
                    chrome.runtime.sendMessage(msg);
                }
            }, 5000);

            break;
    }

}

start();