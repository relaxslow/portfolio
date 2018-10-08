/**
 * 
 * @param {xs.Div} module 
 */
xs.init = function (module) {
    module.selectDiv("sideMenuBox")
        .load("/popupMenu", xs.COMPONENT, {
            menu: [
                {
                    text: "basic",
                    initOpen: true,
                    submenu: [
                        { path: "/content/basic/codeArea", text: "code area" },
                        { path: "/content/basic/emptyPage2", text: "empty page2" },
                    ]
                },
                {
                    text: "svg",
                    initOpen: true,
                    submenu: [
                        { path: "/content/svg/animation", text: "animate Gradient",initActive: true },
                        { path: "/content/svg/simplePieChart", text: "simple Pie Chart" },
                        { path: "/content/svg/realPieChart", text: "real Pie Chart" },
                        { path: "/content/svg/animatedLine", text: "animated line" },
                    ]
                },
                {
                    text: "webgl",
                    submenu: [
                        { path: "/content/webgl/pickObj", text: "pickObj" },
                    ]
                },
                {
                    text: "game",
                    submenu: [
                        { path: "/content/game/TicTacToa", text: "TicTacToe" },
                    ]
                }
            ],
            content: module.selectDiv("content")
        });

    // let buttonData = [
    //     // "basic"
    //     "/content/basic/codeArea",
    //     "/content/basic/emptyPage2",
    //     //"svg",
    //     "/content/svg/animation",
    //     "/content/svg/simplePieChart",
    //     "/content/svg/realPieChart",
    //     "/content/svg/animatedLine",


    //     //"webgl",
    //     "/content/webgl/pickObj",
    //     //game
    //     "/content/game/TicTacToa"
    // ];

    // let namedata = ["basic", "svg", "webgl"];


};