xs.init = function (module, data) {
    let { menu, content } = data;
    buildMenu(menu);

    module.collect(".subMenu")
        .click(function switchContent(e) {
            module.activeSubMenu.classList.remove("subMenuActive");
            e.classList.add("subMenuActive");
            module.activeSubMenu = e;

            content.clear()
                .load(e.contentPath);
        });

    let popMenus = module.collect(".subMenuBox")
        .createPopupMenu();
        
    module.collect(".sideMenu")
        .addData(["menu", popMenus])
        .click(function popOrPull(e) {
            let menu = e.menu;
            if (menu.status == xs.PopUpMenu.CLOSE) {
                menu.popup();
            }
            else if (menu.status == xs.PopUpMenu.OPEN) {
                menu.pullback();
            }
        });

    // recieve menu data and build it--------------------------------------------------
    // menu: [
    //     {
    //         text: "basic",
    //         initOpen: true,
    //         submenu: [
    //             { path: "/content/basic/codeArea", text: "code area", initActive: true },
    //             { path: "/content/basic/emptyPage2", text: "empty page2" },
    //         ]
    //     },
    //      ...
    // ]
    //generate html--------------------------------------------------------------------
    // <div class="sideMenuBox">
    //      <button class="button sideMenu">basic</button>
    //      <div class="subMenuBox">
    //          <button class="button subMenu">code area</button>
    //          <button class="button subMenu">empty page2</button>
    //      </div>
    //      ...
    // </div>
    //--------------------------------------------------------------------------------
    function buildMenu(menus) {
        let setActiveMenu = false;
        for (let i = 0; i < menus.length; i++) {
            let menudata = menus[i];
            let menu = document.createElement("BUTTON");
            menu.innerHTML = menudata.text;
            menu.classList.add("button", "sideMenu");
            module.div.appendChild(menu);
            let subMenusData = menudata.submenu;
            if (subMenusData) {
                let subMenuBox = document.createElement("DIV");
                subMenuBox.classList.add("subMenuBox");
                if (!menudata.initOpen)
                    subMenuBox.style.height = "0px";
                module.div.appendChild(subMenuBox);
                for (let j = 0; j < subMenusData.length; j++) {
                    let submenudata = subMenusData[j];
                    let subMenu = document.createElement("BUTTON");
                    subMenu.innerHTML = submenudata.text;
                    subMenu.contentPath = submenudata.path;

                    if (submenudata.initActive) {
                        if (setActiveMenu)
                            xs.Debug.redAlert("only allow one menu active ")
                        subMenu.classList.add("subMenuActive");
                        module.activeSubMenu = subMenu;//active
                        content.load(subMenu.contentPath);
                        setActiveMenu = true;
                    }

                    subMenu.classList.add("button", "subMenu");
                    subMenuBox.appendChild(subMenu);
                }
            }
        }
    }

};

if (xs.PopUpMenu == null) {
    xs.Collection.prototype.createPopupMenu = function collectionCreatePopupMenu() {
        let menuCollection = new xs.Collection();
        menuCollection.name = "popupMenu for " + this.name;
        wrapMenu(this, menuCollection);
        xs.Debug.log("create : " + menuCollection.name);
        return menuCollection;


        function wrapMenu(elementCollection, menuCollection) {
            for (let i = 0; i < elementCollection.group.length; i++) {
                const element = elementCollection.group[i];
                if (element.tagName === "DIV") {
                    let popupMenu = new xs.PopUpMenu(element);
                    menuCollection.add(popupMenu);
                }
                else
                    xs.Debug.taskError("element is not a div");
            }
        }

    };
    //class popup menu wrap div  
    xs.PopUpMenu = function newPopUpMenu(div) {
        this.div = div;
        div.menu = this;
        if (div.style.height === "0px")
            this.status = xs.PopUpMenu.CLOSE;
        else
            this.status = xs.PopUpMenu.OPEN;
    };
    xs.PopUpMenu.CLOSE = "close";
    xs.PopUpMenu.OPEN = "open";
    xs.PopUpMenu.prototype.transitionend = function popupMenuTransitionEnd(evt) {
        let element = evt.currentTarget;
        element.removeEventListener('transitionend', arguments.callee);
        element.style.height = null;
    };
    xs.PopUpMenu.prototype.popup = function menuPopUp() {
        let element = this.div;
        var sectionHeight = element.scrollHeight;
        element.style.height = sectionHeight + 'px';
        element.addEventListener('transitionend', this.transitionend);
        element.menu.status = xs.PopUpMenu.OPEN;
    };
    xs.PopUpMenu.prototype.pullback = function menuPullBack() {
        let element = this.div;
        element.removeEventListener('transitionend', this.transitionend);
        var sectionHeight = element.scrollHeight;
        var elementTransition = element.style.transition;
        element.style.transition = '';
        requestAnimationFrame(function () {
            element.style.height = sectionHeight + 'px';
            element.style.transition = elementTransition;
            requestAnimationFrame(function () {
                element.style.height = 0 + 'px';
            });
        });

        this.status = xs.PopUpMenu.CLOSE;
    };
}