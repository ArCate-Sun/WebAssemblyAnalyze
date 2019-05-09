
let status = document.getElementById("status");
let output = document.getElementById("output");


if (status && output) {
    let interval = setInterval(() => {
        if (status.innerHTML === "") {
            // 获得 asm 的输出, 并发送给 content js
            clearInterval(interval);
    
            let msg = {
                src: "InjectJS",
                dest: "ContentJS",
                type: "output",
                data: output.value
            }
    
            window.postMessage(msg, "*")
        }
    }, 1000)    
}


