let menus = document.querySelectorAll(".menuItem");
let select = document.querySelector(".select");
for (let i = 0; i < menus.length; i++) {
    const item = menus[i];
    item.index = i;
    item.addEventListener("click", clickItem, false);
}

function clickItem(evt) {
    let item = evt.currentTarget;
    if (select != item && item.innerHTML != "") {
        select.classList.remove("select");
        item.classList.add("select");
        select = item;
        window.parent.gotoWork(folder[select.index]);
    }

}

function workPath(folder) {
    return `/works/${folder}/main.html`;
}
let folder = [
    workPath("data524"),
    workPath("animatedLine"),
    workPath("loadGLTF"),
    workPath('lastbattle')
];