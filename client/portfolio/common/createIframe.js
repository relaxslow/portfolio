
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