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

//type
let type = getPullDown(".type");
let month = getPullDown(".month");
let year = getPullDown(".year")

function getPullDown(sel) {
    let p = {}
    p.status = "close";
    p.group = document.querySelector(`${sel}`)
    p.button = document.querySelector(`${sel} button`);
    p.items = document.querySelectorAll(`${sel} .options .optionItem`);
    p.select = p.items[0];
    p.menu = document.querySelector(`${sel} .options`);
    p.group.removeChild(p.menu);
    p.button.addEventListener("click", clickBut, false);
    p.close = closeMenu;
    p.open = openMenu;
    function closeMenu() {

        p.group.removeChild(p.menu);
        p.status = "close";

    }
    function openMenu() {

        p.group.appendChild(p.menu);
        p.status = "open";

    }
    function clickBut(evt) {
        evt.stopPropagation();
        if (p.status === "open") p.close();
        else p.open();

    }
    for (let i = 0; i < p.items.length; i++) {
        const item = p.items[i];
        item.addEventListener("click", clickItem, false);
    }
    function clickItem(evt) {
        let item = evt.currentTarget;
        p.button.innerHTML = item.innerHTML;
        p.select.classList.remove("select");
        item.classList.add("select");
        p.select = item;
        p.close();
    }
    return p;
}


let submit = document.querySelector(".submit");
submit.addEventListener("click", clickSubmit, false);
function clickSubmit(evt) {
    if(validate())
    console.log("submit");
}
