let backToCalendar = document.querySelector(".back");
backToCalendar.addEventListener("click", clickChange, false);
function clickChange() {
    window.parent.appointmentStepGoto(0);
}

let pay = document.querySelector(".submit");
pay.addEventListener("click", clickPay, false);
// pay.addEventListener("mouseover", mouseOverPay, false);

function clickPay(evt) {
    if (validate())
        window.parent.appointmentStepGoto(2);
}
// function mouseOverPay(evt) {

// }