let currentOpen = null;

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
    p.setValue = setValue;
    function setValue(num) {
        
        p.button.querySelector("span").innerHTML = p.items[num].innerHTML;
        p.select.classList.remove("select");
        p.select=p.items[num];
        p.select.classList.add("select");
    }
    function closeMenu() {

        p.group.removeChild(p.menu);
        p.status = "close";
        currentOpen = null;

    }
    function openMenu() {
        p.group.appendChild(p.menu);
        p.status = "open";
        currentOpen = p;
    }
    function clickBut(evt) {
        evt.stopPropagation();
        if (currentOpen == null) {
            p.open();
        }
        else {
            if (currentOpen == p) {
                p.close();
            } else if (currentOpen != p) {
                currentOpen.close();
                p.open();
            }
        }

    }
    for (let i = 0; i < p.items.length; i++) {
        const item = p.items[i];
        item.addEventListener("click", clickItem, false);
        item.index=i;
    }
    function clickItem(evt) {
        let item = evt.currentTarget;
        p.button.querySelector("span").innerHTML = item.innerHTML;
        p.select.classList.remove("select");
        item.classList.add("select");
        p.select = item;
        p.close();
    }
    return p;
}