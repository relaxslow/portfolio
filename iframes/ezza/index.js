function setStep(num) {
    let step = document.getElementsByClassName("step")[0];
    step.contentWindow.setCurrentStep(2);
}

function gotoSummary() {
    let content = document.querySelector(".content");
    let parent = content.parentNode;
    parent.removeChild(content);
    parent.appendChild(createIframe("/iframes/ezza/summary/main.html","content"));
}

function createIframe(name, classname) {
    let iframe = document.createElement("iframe");
    iframe.src = name;
    if (classname)
        iframe.classList.add(classname);
    iframe.frameBorder = 0;
    iframe.onload = iframeLoadOk;
    return iframe;

}
function iframeLoadOk(evt) {
    let frame = evt.currentTarget;
}



//  function loadIframe(wid, hei, name, data) {
//     let iframe = document.createElement("iframe");
//     iframe.src = name;
//     iframe.width = wid;
//     iframe.height = hei;
//     iframe.frameBorder = 0;
//     iframe.style.backgroundColor = "#9c9c9c";
//     iframe.onload = iframeLoadOk;
//     this.div.appendChild(iframe);

//     function iframeLoadOk(evt) {
//         if (this.isDeath)
//             return;
//         xs.control.waitingLoad--;

//         let frame = evt.currentTarget;
//         frame.contentWindow.addEventListener("click", focus);
//         if (frame.contentWindow.start)
//             frame.contentWindow.start(data);

//         this.operating = null;
//         xs.Task.next();
//     }
//     function focus(evt) {
//         let window = evt.currentTarget;
//         window.focus();
//     }
// }