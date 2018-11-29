//option Menu
let optionMenu = document.getElementsByClassName("options")[0];
optionMenu.style.visibility = "hidden";
let current = document.getElementsByClassName("current")[0];
current.addEventListener("click", clickOptionMenu, false);//click month year 
optionMenuOpen = false;
function clickOptionMenu(evt) {
    evt.stopPropagation();
    if (optionMenuOpen) {
        optionMenu.style.visibility = "hidden";
        optionMenuOpen = false;
    } else {
        optionMenu.style.visibility = "visible";
        optionMenuOpen = true;
    }

}
let optionItems = document.getElementsByClassName("optionItem");
for (let i = 0; i < optionItems.length; i++) {
    let option = optionItems[i];
    option.index = i;
    option.addEventListener("click", clickOptionItem, false);

}
function clickOptionItem(evt) {
    let optionItem = evt.currentTarget;
    current.textContent = optionItem.textContent;
    console.log("click option" + evt.currentTarget.index);
}

let prev = document.getElementsByClassName("prev")[0];
let next = document.getElementsByClassName("next")[0];
prev.addEventListener("click", clickPrev, false);
next.addEventListener("click", clickNext, false);
function clickPrev(evt) {
    console.log("click Prev");
    //attachDatatoDays

}
function clickNext(evt) {
    console.log("click Next");
    //attachDatatoDays
}
//close panel when click outside
document.addEventListener("click", clickOutsideMenu, false)//click outside the menu
function clickOutsideMenu(evt) {
    let element = evt.currentTarget;
    if (optionMenuOpen) {
        optionMenu.style.visibility = "hidden";
        optionMenuOpen = false;
    }
    if (selectDay) {
        daySelector.parentNode.removeChild(daySelector);
        closeTimePullDown();
        if (selectTime) {
            closeTimePullRight();
        }

    }
}

//days
let days = document.querySelectorAll(".days li");
let dayData = {
    text: 0,
    available: false
}
let timeData = {
    hour: 2,
    minutes: 15,
    am: "am",
}
let dayHighlight = document.querySelectorAll(".dayHighlight")[0];
let daySelector = document.querySelectorAll(".dayHighlight")[1];
let timePullRight = document.getElementsByClassName("timePullRight")[0];
let timePullDown = document.getElementsByClassName("timePullDown")[0];

let timeItems = document.querySelectorAll(".timePullDown .option");
for (let i = 0; i < timeItems.length; i++) {
    const timeItem = timeItems[i];
    timeItem._index = i;
    timeItem.addEventListener("click", clickTimeitem, false);
}

timePullRight.parentNode.removeChild(timePullRight);
timePullDown.parentNode.removeChild(timePullDown);
let selectTime;
function clickTimeitem(evt) {
    evt.stopPropagation();
    let time = evt.currentTarget;
    // showTimePullRight(time);

}
function showTimePullRight(time) {
    if (selectTime == time) return;

    timePullRight.classList.remove("end");

    let rect = time.getBoundingClientRect();
    document.body.appendChild(timePullRight);
    timePullRight.style.left = `${rect.left}px`;
    timePullRight.style.top = `${rect.top}px`;
    timePullRight.offsetWidth;//trigger
    timePullRight.style.left = `${rect.left + 140}px`;
    selectTime = time;
}
function closeTimePullRight() {
    if (timePullRight.parentNode) {
        timePullRight.parentNode.removeChild(timePullRight);
        selectTime = null;

    }
}
for (let i = 0; i < days.length; i++) {
    let day = days[i];
    //attach data
    day.text = i + 1;
    day.innerHTML = day.text;
    //     day.classList.add("avaliable");
    day.addEventListener("mouseover", mouseOverItem);
    day.addEventListener("mouseout", mouseOutItem);
    day.addEventListener("click", clickDay);
}

let selectDay;
function clickDay(evt) {
    evt.stopPropagation();
    let day = evt.currentTarget;
    closeTimePullRight();
    if (day.classList.contains("avaliable")) {
        selectDay = day;
        day.appendChild(daySelector);
        daySelector.innerHTML = day.text;
        showTimePullDown(day)

    }

}
function showTimePullDown(day) {
    let rect = day.getBoundingClientRect();
    document.body.appendChild(timePullDown);
    timePullDown.style.left = `${rect.left}px`;
    timePullDown.style.top = `${rect.top + 30}px`;
}
function closeTimePullDown() {
    if (timePullDown.parentNode) {
        timePullDown.parentNode.removeChild(timePullDown);
        selectDay = null;
    }
}
function mouseOverItem(evt) {
    let day = evt.currentTarget;
    if (day.classList.contains("avaliable")) {
        if (dayHighlight.parentNode)
            dayHighlight.parentNode.removeChild(dayHighlight);
        day.appendChild(dayHighlight);
        dayHighlight.style.visibility = "visible";
        dayHighlight.textContent = day.text;
        // day.classList.add("active");
    }
}
function mouseOutItem(evt) {
    let day = evt.currentTarget;
    // day.classList.remove("active");
    if (dayHighlight.parentNode)
        dayHighlight.parentNode.removeChild(dayHighlight);
}
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
    let container=document.getElementsByClassName("progress")[0];
    stepWid = (container.clientWidth / stepNum-arrowWid);
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

function setCurrentStep(num){
    currentStep.style.width=`${stepWid}px`;
    currentStep.style.left=`${num*stepWid}px`;
}
