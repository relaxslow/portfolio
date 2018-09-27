/**
 * 
 * @param {xs.Div} module 
 */
xs.init = function (module) {
    module.selectDiv("content")
        .load("/content/svg/animation/page");
    let buttonData = [
        // "basic"
        "/content/basic/emptyPage1/page",
        "/content/basic/emptyPage2/page",
        //"svg",
        "/content/svg/animation/page",

        //"webgl",
        "/content/webgl/pickObj/page"

    ];

    let namedata = ["basic", "svg", "webgl"];

    module.selectDiv("sideMenuBox")
        .collect("subMenu")
        .addData(["data", buttonData])
        .click(function switchContent(e) {
            module.selectDiv("content")
                .clear()
                .load(e.data);
        });

    let popMenus = module.selectDiv("sideMenuBox")
        .collect("subMenuBox")
        .addData(["name", namedata])
        .createPopupMenu(xs.PopUpMenu.CLOSE);
    module.selectDiv("sideMenuBox")
        .collect("sideMenu")
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
};