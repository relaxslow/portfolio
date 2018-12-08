let div = document.querySelector(".box");
// let svg = document.querySelector(".box svg");
let allPaths = document.querySelectorAll("path");
//init paths
for (let i = 0; i < allPaths.length; i++) {
    const path = allPaths[i];
    let length = path.length = path.getTotalLength();
    path.index = i;
    let speed = 100;
    path.time = path.length / speed ;

    path.style.transition = "";
    path.style.strokeDasharray = length + ' ' + length;
    path.style.strokeDashoffset = length;
    path.style.strokeOpacity = "1";
    path.color = path.getAttribute("fill");
    path.setAttribute("fill", "");
    if (path.classList.contains("arrow"))
        path.style.fill = "#ffffff";
    else
        path.style.fill = "#FBB03B";
    path.style.fillOpacity = "0";


}
div.offsetWidth;//trigger
// svg.offsetWidth;

let count = 0;
// let allAniPaths = document.querySelectorAll("path");
// let startTime = [];
// for (let i = 0; i < allAniPaths.length; i++) {
//     const path = allAniPaths[i];
//     path.index = i;
//     let speed = 50;
//     path.time = path.length / speed;
//     startTime.push(path.time * 1000);
// }
// begin(allAniPaths[0]);

beginAllAnimation();
function beginAllAnimation() {
    for (let i = 0; i < allPaths.length; i++) {
        const path = allPaths[i];
        begin(path);
    }
}


function begin(path) {
    path.style.transition = 'stroke-dashoffset ' + path.time + 's ease-in-out ';
    path.style.strokeDashoffset = '0';
    path.addEventListener("transitionend", startAtSametime, false);
}
function oneByone(evt) {
    let path = evt.currentTarget;
    let next = path.index + 1;
    if (next != allAniPaths.length)
        begin(allAniPaths[next]);
    else
        showAllFill();
}

function startAtSametime(evt) {
    let path = evt.currentTarget;
    path.removeEventListener("transitionend", startAtSametime);
    count++;
    if (count == allPaths.length - 1) {
        showAllFill();
    }
}
function showAllFill() {
    for (let i = 0; i < allPaths.length; i++) {
        let path = allPaths[i];
        fill(path, 0.5, "ease-out");

    }

}
function fill(path, sec, ease) {
    path.style.transition = `fill-opacity ${sec}s ${ease} `;
    path.style.fillOpacity = "1";
    path.style.transition += `,stroke-opacity ${sec}s ${ease} `;
    path.style.strokeOpacity = "0";
    path.addEventListener("transitionend", backOriginColor, false);
}

function backOriginColor(evt) {
    let path = evt.currentTarget;
    origin(path, 0.8, "ease-in");

}
function origin(path, sec, ease) {
    path.style.transition = `fill ${sec}s ${ease} `;
    path.style.fill = path.color;
}