
let powerBI = document.querySelector(".control .report");
let threeJS = document.querySelector(".control .threejs");

let ballframe, reportFrame;
function frameLoadOk() {
    powerBI.addEventListener("click", clickPowerBIButton);
    threeJS.addEventListener("click", clickThreeJsButton)

    ballframe = document.querySelector(".show .rotatePhoto");
    reportFrame = document.querySelector(".show .report");
}


let show = "report";

function clickThreeJsButton() {
    showBall();

}
function clickPowerBIButton() {
    showReport();
}
let pos0 = -933;
let pos1 = 0;
let pos2 = 933;

function showReport() {
    if (show !== "report") {

        //         reportFrame.style.left = `${pos1}`;
        //         ballframe.style.left = `${pos0}`;
        reportFrame.classList.remove("pos2");
        // reportFrame.classList.add("pos1");
        ballframe.classList.remove("pos1");
        // ballframe.classList.add("pos0");
        show = "report";
    }

}
function showBall() {
    if (show !== "ball") {
        //         reportFrame.style.left = `${pos2}`;
        //         ballframe.style.left = `${pos1}`;
        reportFrame.classList.add("pos2");
        // reportFrame.classList.add("pos2");
        ballframe.classList.add("pos1");
        // ballframe.classList.add("pos1");
        show = "ball";
    }

}