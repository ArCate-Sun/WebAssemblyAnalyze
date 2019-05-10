// 接受 inject js 的消息
window.addEventListener("message", function(e) {
    let msg = e.data;

    if (msg.dest === "ContentJS" && msg.src === "InjectJS" && msg.type === "output") {

        // 向 background 发送消息
        msg.dest = "BackgroundJS";
        chrome.runtime.sendMessage(msg);
    }

})

window.onload = function() {
    let status = document.getElementById("status");
    let output = document.getElementById("output");
    
    let msg = {
        cmd: undefined,
        src: "ContentJS",
        dest: "BackgroundJS",
        data: undefined
    }
    
    if (status && output) {
        let interval = setInterval(() => {
            if (status.innerHTML === "") {
                // 获得 asm 的输出, 并发送给 content js
                clearInterval(interval);
        
                msg.cmd = "output";
                msg.data = output.value
    
                chrome.runtime.sendMessage(msg);
    
            }
        }, 5000)
    } else {
        msg.cmd = "skip"
        chrome.runtime.sendMessage(msg);
    }
}
