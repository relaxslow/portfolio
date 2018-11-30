//step
let currentStep;
let stepNum = 3
let wid = window.innerWidth;
let stepWid = (wid / stepNum);


let stepHei = 30;
let arrowWid = 10;

let total = (stepWid + arrowWid).toFixed(3);


let textData = [
    "Select Manicure Preferences",
    "Gel Removal and Calendar",
    "Payment and Confirmation"
]
buildStep();
resizeStep();
function buildStep() {
    let step = document.getElementsByClassName("svgArrow")[0];
    for (let i = 0; i < stepNum - 1; i++) {
        let newStep = cloneSVG(step);
    }
    window.addEventListener("resize", resizeStep, false);
    currentStep = document.getElementsByClassName("currentStep")[0];
    setCurrentStep(0);
}
function cloneSVG(svg) {
    let newSvg = svg.cloneNode(true);
    svg.parentNode.appendChild(newSvg);
    return newSvg;
}

function resizeStep() {
    let container = document.getElementsByClassName("progress")[0];
    stepWid = ((container.clientWidth - arrowWid) / stepNum);
    total = (stepWid + arrowWid).toFixed(3);
    let steps = document.querySelectorAll(".svgArrow");
    for (let i = 0; i < steps.length; i++) {
        let step = steps[i];
        let viewbox = `0 0 ${total} ${stepHei}`;
        step.setAttribute("viewBox", viewbox);
        step.setAttribute("width", `${total}px`);
        step.setAttribute("height", `${stepHei}px`);

        step.style.left = `${stepWid * i}`;
        step.style.zIndex = `${(steps.length - i) * 100}`;

    }
    let paths = document.querySelectorAll("path");
    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];
        path.setAttribute("d", `M 0 0 L ${stepWid} 0 l ${arrowWid} ${stepHei / 2} l -${arrowWid} ${stepHei / 2} l -${stepWid} 0 l 0 0 Z `);
    }


    let texts = document.querySelectorAll(".progress svg text");
    for (let i = 0; i < texts.length; i++) {
        let text = texts[i];
        text.innerHTML = textData[i];
        var bbox = text.getBBox();
        var x = stepWid / 2 - bbox.width / 2;
        var y = stepHei / 2 + bbox.height / 2 - 3;

        text.setAttribute('x', `${x}`);
        text.setAttribute('y', `${y}`);

    }

    setCurrentStep(0);
}

 function setCurrentStep(num) {
    currentStep.style.width = `${stepWid}px`;
    currentStep.style.left = `${num * stepWid}px`;
}

