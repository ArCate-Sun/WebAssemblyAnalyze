// 需要的 DOME 元素
let tagHost = undefined;
let inputHost = undefined;
let tagPort = undefined;
let inputPort = undefined;
let btnSubmit = undefined;

// Background Script
let bg = chrome.extension.getBackgroundPage();

// 刷新 Popup 控件
function flushStatus() {
    if (bg.running) {
        inputHost.value = bg.host;
        inputPort.value = bg.port;
        inputHost.disabled = true;
        inputPort.disabled = true;
        btnSubmit.innerHTML = "Stop";
    } else {
        inputHost.disabled = false;
        inputPort.disabled = false;
        btnSubmit.innerHTML = "Start";
    }
}

function verifyInputs() {
    let host = inputHost.value;
    let port = inputPort.value;

    if (!!host) {
        tagHost.classList.remove("warn");
    } else {
        tagHost.classList.add("warn");
    }

    if (!!port) {
        tagPort.classList.remove("warn");
    } else {
        tagPort.classList.add("warn");
    }

    return host && port;
}

// btnSubmit's click 事件回调函数
function submit() {

    if (bg.running) {
        bg.showResult();
        bg.stop();
    } else {
        if (verifyInputs()) {
            let host = inputHost.value;
            let port = inputPort.value;
            bg.start(host, port);
        }
    }
}

window.onload = function () {

    tagHost = document.getElementById("tag-host");
    inputHost = document.getElementById("host");
    tagPort = document.getElementById("tag-port");
    inputPort = document.getElementById("port");
    btnSubmit = document.getElementById("submit");

    flushStatus();
    btnSubmit.onclick = submit;
}
