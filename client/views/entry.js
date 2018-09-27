xs.init = function (module) {
    new xs.Div("new", document.body).class("headBar")
        .load("/head/page");
    module.selectDiv("footBar")
        .load("/foot/page");
    module.selectDiv("mainBody")
        .load("/lab/page");
   
};