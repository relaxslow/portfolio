
let powerBI = document.querySelector(".control .report");
let threeJS = document.querySelector(".control .threejs");

let ballframe, reportFrame;
function frameLoadOk() {
    powerBI.addEventListener("click", clickPowerBIButton);
    threeJS.addEventListener("click", clickThreeJsButton)

    ballframe = document.querySelector(".show .rotatePhoto");
    reportFrame = document.querySelector(".show .report");
    ballframe.style.visiblity="hidden";
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
      
        ballframe.style.left=`${pos1}px`;
        reportFrame.style.visiblity="visible";
        reportFrame.style.left=`${pos2}px`;

        ballframe.offsetWidth;

        ballframe.style.transition="left 0.5s" ;
        ballframe.style.left=`${pos0}px`;
        ballframe.addEventListener("transitionend", hideBall, false);
        reportFrame.style.transition="left 0.5s" ;
        reportFrame.style.left=`${pos1}px`;
       
    
        // reportFrame.classList.remove("pos2");
        // ballframe.classList.remove("pos1");
        show = "report";
    }

}
function hideReport(){
    reportFrame.style.visiblity="hidden";
    reportFrame.style.transition="";
    reportFrame.removeEventListener("transitionend", hideReport);
}
function hideBall(){
    ballframe.style.visiblity="hidden";
    ballframe.style.transition="";
    ballframe.removeEventListener("transitionend", hideBall);
}
function showBall() {
    if (show !== "ball") {
        reportFrame.style.left=`${pos1}px`;
        ballframe.style.visiblity="visible";
        ballframe.style.left=`${pos0}px`;

        ballframe.offsetWidth;

        reportFrame.style.transition="left 0.5s" ;
        reportFrame.style.left=`${pos2}px`;
        reportFrame.addEventListener("transitionend", hideReport, false);
        ballframe.style.transition="left 0.5s" ;
        ballframe.style.left=`${pos1}px`;
        // reportFrame.classList.add("pos2");
        // ballframe.classList.add("pos1");
        
        show = "ball";
    }

}