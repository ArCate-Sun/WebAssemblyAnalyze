let bg = chrome.extension.getBackgroundPage();
let output = bg.output;

// output = [{
//     id: "/datamining/correlation/correlation.html",
//     output: "7.423000\n"
// }, {
//     id: "/datamining/covariance/covariance.html",
//     output: "7.193000\n"
// }]

function download() {

    if (!output) {
        alert("请先运行插件抓取数据.");
        return;
    }

    let content = "";
    
    for (let i = 0; i < output.length; i++) {
        content = `${content}${i}\t${output[i].id}\t${output[i].output}\n`;
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

    console.log(table);

    for (let i = 0; i < output.length; i++) {

        // create div
        let div = document.createElement("div");

        // create ul
        let row = document.createElement("ul");
        row.classList.add("each-done")

        // create li
        let col0 = document.createElement("li");
        let col1 = document.createElement("li");
        let col2 = document.createElement("li");

        // create textnode
        let idx = document.createTextNode(i);
        let id = document.createTextNode(output[i].id);
        let out = document.createTextNode(output[i].output);

        // component
        col0.appendChild(idx);
        col1.appendChild(id);
        col2.appendChild(out);
        row.appendChild(col0);
        row.appendChild(col1);
        row.appendChild(col2);
        div.appendChild(row);
        table.appendChild(div);
    

    }

}