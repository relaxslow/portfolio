/**
 * 
 * @param {xs.Div} module 
 */
xs.init = function (module) {
    let moduleName = [
        "/about/page",
        "/lab/page"
    ];
    module.selectDiv("headBar_Menu")
        .collect("headBar_Menu_button")
        .addData(["moduleName", moduleName])
        .click(function switchMainbody(e) {
         xs.selectModule("//entry")
                .selectDiv("mainBody")
                .clear()
                .load(e.moduleName);
        });

};