/**
 * 
 * @param {xs.Div} module 
 */
xs.init = function (module) {
    let moduleName = [
        "/about",
        "/lab"
    ];
    module.selectDiv("headBar_Menu")
        .collect(".headBar_Menu_button")
        .addData(["moduleName", moduleName])
        .click(function switchMainbody(e) {
            module.selectDiv("active")
                .removeClass("active");
            xs.getDiv(e)
                .addClass("active");

            xs.selectModule("/entry")
                .selectDiv("mainBody")
                .clear()
                .load(e.moduleName);
        });

};