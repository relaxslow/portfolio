xs.init = function (parent) {
    new xs.Div("new", document.body).class("headBar")
        .load("/head/page");

    let content = parent.getElementsByClassName("content")[0];
    let contentDiv = new xs.Div("wrap", content)
        .load("/content/svgAnimation/page");
    let buttonData = [
        "/content/svgAnimation/page",
        "/content/emptyPage2/page",
        "/content/pickObj/page",
    ];
    function distrubuteFun(e, d) {
        e.path = d;
        e.addEventListener('click', switchContent);
    }
    function switchContent(evt) {
        contentDiv.clear()
            .load(evt.currentTarget.path);
    }

    xs.selectDiv("sideMenuBox", parent)
        .collect("button")
        .addData(buttonData, distrubuteFun);
    // new xs.Collection("button", parent)
    //     .addData(buttonData, distrubuteFun);



};