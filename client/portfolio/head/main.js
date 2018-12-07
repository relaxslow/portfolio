let menu = getMenu(".menuItem");

let goto=[
"about",
"lab"
]

function getMenu(itemClass) {
    let menu = {};
    menu.items = document.querySelectorAll(itemClass);
    menu.select = menu.items[0];


    for (let i = 0; i < menu.items.length; i++) {
        const item = menu.items[i];
        item.index=i;
        item.addEventListener("click", clickitem, false);
    }
    function clickitem(evt) {
        let item = evt.currentTarget;
        if (menu.select != item) {
            menu.select.classList.remove("select");
            item.classList.add("select");
            menu.select = item;
            window.parent.content.goto(`/client/portfolio/${goto[item.index]}/main.html`);
        }
    }
  

}


