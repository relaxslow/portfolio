function setStep(num){
    let step=document.getElementsByClassName("step")[0];
    step.contentWindow.setCurrentStep(2);
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