let head = document.querySelector(".head");
head.onload = AllIframeOk;
let content = get(".content");
content.onload = AllIframeOk;
window.content = content;
let foot = document.querySelector(".foot");
foot.onload = AllIframeOk;
window.addEventListener("resize", resize, false);



let count = 0;
function AllIframeOk() {
    count++;
    if (count == 3) {
        resize();
    }
}
function resize(evt) {
    let contentHei = content.contentWindow.document.body.scrollHeight;
    let footHei = foot.contentWindow.document.body.scrollHeight;
    let gap = window.innerHeight - (contentHei + footHei);
    if (gap > 0) {
        // content.style.height = `calc(100vh - ${headHei+footHei}px)`;
        content.style.height = (contentHei + gap) + "px";
    }
    else {
        content.style.height = (contentHei) + "px";
    }
    foot.style.height = (footHei) + "px";
}

function resizeIframe(iFrame) {
    iFrame.style.height = (iFrame.contentWindow.document.body.scrollHeight) + "px";
}
function get(className) {
    let result = document.querySelector(className);
    result.goto = goto;
    return result;
    function goto(pathname) {
        result.src = pathname;
        result.onload = iframeOk;
    }
}
function iframeOk() {
    resize();
}



// window.addEventListener('message', function(e) {
// 	// message passed can be accessed in "data" attribute of the event object
// 	var scroll_height = e.data;

// 	foot.style.height = scroll_height + 'px'; 
// } , false);