let content = document.querySelector(".content");
let sideMenu = document.querySelector(".sideMenu");
sideMenu.onload = iframeOk;
let workShow = document.querySelector(".workShow");
workShow.onload = iframeOk;
window.addEventListener("resize", resize, false);
function resize() {
    let sideHei = sideMenu.contentWindow.document.body.scrollHeight;
    let workHei = workShow.contentWindow.document.body.scrollHeight;
    let max = sideHei > workHei ? sideHei : workHei
    content.style.height = (max + 70) + "px";
    sideMenu.style.height = sideHei + "px";
    workShow.style.height = (workHei) + "px";
    window.top.resize();
}
let count = 0;
function iframeOk() {
    count++;
    if (count == 2) {
        resize();
        content.style.visibility = "visible";
    }
}

function gotoWork(name) {
    workShow.src=name;
    workShow.onload=loadWorkShowOk;
}
function loadWorkShowOk(){
    resize();
}