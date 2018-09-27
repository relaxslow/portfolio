
/**
 * 
 * @param {xs.Div} module 
 */
// @ts-ignore
xs.init = function (module) {
    // xs.loadGoogleFont("Bungee+Hairline");
    new xs.Div("new", document.body).class("headBar")
        .load("/head/page");
    module.selectDiv("footBar")
        .load("/foot/page");
    module.selectDiv("mainBody")
        .load("/lab/page");
   

};