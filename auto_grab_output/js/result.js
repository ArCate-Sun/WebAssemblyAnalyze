let bg = chrome.extension.getBackgroundPage();
let output = bg.output;

function download() {

    if (!output) {
        alert("请先运行插件抓取数据.");
        return;
    }

    let content = "";
    
    for (let i = 0; i < output.length; i++) {
        content = `${content}${output[i].id}\t${output[i].output}\n`;
    }

    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    a.setAttribute('download', "result.txt");
    a.click();
}

window.onload = function () {

    let btnDownload = document.getElementById("download");
    btnDownload.addEventListener("click", download);

    if (!output) {
        return;
    }

    let table = document.getElementById("result-table");

    for (let i = 0; i < output.length; i++) {

        // create tr
        let row = document.createElement("tr");

        // create td
        let col1 = document.createElement("td");
        let col2 = document.createElement("td");

        // create textnode
        let id = document.createTextNode(output[i].id);
        let out = document.createTextNode(output[i].output);

        // component
        col1.appendChild(id);
        col2.appendChild(out);
        row.append(col1);
        row.append(col2);
        table.append(row);

    }

}