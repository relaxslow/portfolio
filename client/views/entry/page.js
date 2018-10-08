xs.init = function (module) {
    new xs.Div("new", document.body).addClass("headBar")
        .load("/head");
    module.selectDiv("footBar")
        .load("/foot");
    module.selectDiv("mainBody")
        .load("/lab");
   
};