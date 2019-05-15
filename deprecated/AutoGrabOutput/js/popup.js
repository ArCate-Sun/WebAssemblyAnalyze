let tag_host = document.getElementById("tag_host");
let input_host = document.getElementById("host");
let tag_work_dir_path = document.getElementById("tag_work_dir_path");
let input_work_dir_path = document.getElementById("work_dir_path");
let tag_output_file_path = document.getElementById("tag_output_file_path");
let input_output_file_path = document.getElementById("output_file_path");
let btn_start = document.getElementById("start");

var bg = chrome.extension.getBackgroundPage();

function start() {
    let host = input_host.value;
    let work_dir_path = input_work_dir_path.value;
    let output_file_path = input_output_file_path.value;

    if (!!work_dir_path && !!output_file_path) {
        tag_work_dir_path.classList.remove("warn");
        tag_output_file_path.classList.remove("warn");
        btn_start.disabled = true;
        btn_start.innerHTML = "已开始";
        bg.start(host, work_dir_path, output_file_path);
    } else {
        tag_work_dir_path.classList.add("warn");
        tag_output_file_path.classList.add("warn");
    }
}

btn_start.onclick = start;