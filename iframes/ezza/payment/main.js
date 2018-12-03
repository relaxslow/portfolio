let cancel = document.querySelector(".submitBox .back");
cancel.addEventListener("click", clickCancel, false);
function clickCancel() {
    window.parent.appointmentStepGoto(1);
}

//click outside close panel
document.addEventListener("click", clickOutsideMenu, false)//click outside the menu
function clickOutsideMenu(evt) {
    let element = evt.currentTarget;
    if (type.status === "open")
        type.close();
    if (month.status === "open")
        month.close();
    if (year.status === "open")
        year.close();

}

//explain
cvv2TipPanelStat = "close";
security = "close";
let explainBox = document.querySelector(".explainBox");
let explainDetail = document.querySelectorAll(".explainDetail");
let explainCVV2Elem = explainDetail[0];
let explianSecurityElem = explainDetail[1];
explainBox.removeChild(explainCVV2Elem);
explainBox.removeChild(explianSecurityElem);

let explain = document.querySelectorAll(".explain");
let whatIsCVV2 = explain[1];
let whySecurity = explain[0];
whatIsCVV2.addEventListener("click", clickWhatIsCVV2, false);
whySecurity.addEventListener("click", clickWhySecurity, false);
function clickWhatIsCVV2() {
    if (cvv2TipPanelStat === "close") {
        explainBox.appendChild(explainCVV2Elem);
        cvv2TipPanelStat = "open";
    } else if (cvv2TipPanelStat === "open") {
        explainBox.removeChild(explainCVV2Elem);
        cvv2TipPanelStat = "close";
    }

}
function clickWhySecurity() {
    if (security === "close") {
        explainBox.appendChild(explianSecurityElem);
        security = "open";
    } else if (security === "open") {
        explainBox.removeChild(explianSecurityElem);
        security = "close";
    }

}

//pulldown Menus
let type = getPullDown(".type");
let month = getPullDown(".month");
let year = getPullDown(".year")


//submit
let submit = document.querySelector(".submit");
submit.addEventListener("click", clickSubmit, false);
function clickSubmit(evt) {
    if (validate())
        console.log("submit");
}
