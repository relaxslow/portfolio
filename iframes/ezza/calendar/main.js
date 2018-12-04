
//timeList
let hourStep = 1, minuteStep = 15;
let begin = { hour: 7, minute: 0 };
let end = { hour: 20, minute: 15 };
let allTimes = [];
function generateAllTime() {

    for (let h = begin.hour; h < end.hour + 1; h += hourStep) {
        let t = "";
        let afternoon = false;
        if (h > 12) {
            t += (h - 12);
            afternoon = true;
        }
        else
            t += h;
        t += ":"
        for (let m = 0; m < 60; m += minuteStep) {

            let tm = ""
            if (m < 10)
                tm += "0";
            tm += m;
            if (afternoon)
                tm += " PM";
            else
                tm += " AM";
            allTimes.push(t + tm);
            if (h == end.hour && m == end.minute)
                return;
        }


    }


    //PM
}
generateAllTime();
let timeList = document.querySelector(".timePullDown");
let fistTimeElement = document.querySelector(".timePullDown .option");
initTimeElement(fistTimeElement, allTimes[0]);
function initTimeElement(element, text) {
    element.innerHTML = text;
    element.text = text;
    element.addEventListener("click", clickTime, false);
    element.addEventListener("mouseover", mouseOverTime, false);
    element.addEventListener("mouseout", mouseOutTime, false);

}
let timeHighLight = document.querySelector(".timeHighLight");
timeHighLight.style.visibility = "hidden";
for (let i = 1; i < allTimes.length; i++) {
    let time = fistTimeElement.cloneNode(true);
    initTimeElement(time, allTimes[i]);
    timeList.appendChild(time);

}
function clickTime(evt) {
    window.parent.appointmentStepGoto(1);
}
function mouseOverTime(evt) {
    let time = evt.currentTarget;

    let rect = time.getBoundingClientRect(time);
    timeHighLight.style.top = `${rect.top + window.scrollY}px`;
    timeHighLight.style.left = `${rect.left + 13}px`;
    timeHighLight.style.visibility = "visible";
    timeHighLight.textContent = time.text;
    // day.classList.add("active");

}
function mouseOutTime(evt) {
    timeHighLight.style.visibility = "hidden";
}

//removal
let removalOptions = document.querySelectorAll(".removal-option input");
let removalOptionsData = [
    "no",
    "yes"
];
for (let i = 0; i < removalOptions.length; i++) {
    let option = removalOptions[i];
    option.addEventListener("click", clickRemovalOptions, false);
    option.data = removalOptionsData[i];
}
function clickRemovalOptions(evt) {
    evt.stopPropagation();
    let option = evt.currentTarget;
    console.log(option.data);

}

//option Menu
let year = getPullDown(".year");

//prev next
let prev = document.getElementsByClassName("prev")[0];
let next = document.getElementsByClassName("next")[0];
prev.addEventListener("click", clickPrev, false);
next.addEventListener("click", clickNext, false);
function clickPrev(evt) {
    // console.log("click Prev");

    let currentNum = year.select.index;
    if (currentNum > 0){
        year.setValue(--currentNum);
       
    }

}
function clickNext(evt) {
    // console.log("click Next");
    let currentNum = year.select.index;
    if (currentNum < year.items.length-1)
        year.setValue(++currentNum);

}
//close panel when click outside
document.addEventListener("click", clickOutsideMenu, false)//click outside the menu
function clickOutsideMenu(evt) {
    let element = evt.currentTarget;
    if (year.status === "open")
        year.close();

    if (selectDay) {
        timePullDown.close();
        // if (selectTime) {
        //     closeTimePullRight();
        // }

    }
}

//days
let days = document.querySelectorAll(".days li");

let dayHighlight = document.querySelectorAll(".dayHighlight")[0];
let daySelector = document.querySelectorAll(".dayHighlight")[1];
let timePullRight = document.getElementsByClassName("timePullRight")[0];
let timePullDown = document.getElementsByClassName("timePullDown")[0];
timePullDown.close = function closeTimePullDownMenu() {
    timePullDown.parentNode.removeChild(timePullDown);
    selectDay.removeChild(daySelector);
    currentOpen = null;
    selectDay = null;
}
timePullDown.open = function openTimePullDownMenu() {

    document.body.appendChild(timePullDown);
    timePullDown.moveToDay(selectDay);
    currentOpen = timePullDown;
}
timePullDown.moveToDay = function moveToDay(day) {
    let rect = day.getBoundingClientRect();
    timePullDown.style.left = `${rect.left + window.scrollX}px`;
    timePullDown.style.top = `${rect.top + window.scrollY + 30}px`;
}
function closeTimePullDown() {
    if (timePullDown.parentNode) {
        timePullDown.parentNode.removeChild(timePullDown);

    }
}
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
        showTimePullDown(day);

    }

}
function showTimePullDown(day) {
    if (currentOpen == null) {
        timePullDown.open();
    }
    else {
        if (currentOpen == timePullDown) {
            timePullDown.moveToDay(day);
        } else {
            currentOpen.close();
            timePullDown.open();
        }

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
