// 需要的 DOME 元素
let tagHost = document.getElementById("tag-host");
let inputHost = document.getElementById("host");
let tagPort = document.getElementById("tag-port");
let inputPort = document.getElementById("port");
let btnStart = document.getElementById("start")

// Background Script
let bg = chrome.extension.getBackgroundPage();

function enableBtnStart() {
    btnStart.disabled = false;
    btnStart.innerHTML = "Start";
}

function disableBtnStart() {
    btnStart.disabled = true;
    btnStart.innerHTML = "Running...";
}

// btnStart's click 事件回调函数
function start() {
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

    if (!!host && !!port) {
        disableBtnStart()
        bg.start(host, port);
    }
}

if (bg.running) {
    disableBtnStart()
} else {
    enableBtnStart()
}

btnStart.onclick = start;