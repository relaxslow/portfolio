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
                    submenu: [
                        { path: "/content/basic/Javascript", text: "Javascript",},
                        { path: "/content/basic/nodeJs", text: "Node.js" },
                    ]
                },
                {
                    text: "svg",
                    submenu: [
                        { path: "/content/svg/animation", text: "animate Gradient" },
                        { path: "/content/svg/simplePieChart", text: "simple Pie Chart" },
                        { path: "/content/svg/realPieChart", text: "real Pie Chart" },
                        { path: "/content/svg/animatedLine", text: "animated line" },
                        {path:"/content/svg/plotDot",text:"plot dot", },
                    ]
                },
                {
                    initOpen: true,
                    text: "webgl",
                    submenu: [
                       
                        { path: "/content/webgl/threeJsTest", text: "threeJs-start",initActive: true  },
                        { path: "/content/webgl/drawLine", text: "threeJs-drawLine" },
                        { path: "/content/webgl/loadModel", text: "threeJs-loadGLTF", },
                        { path: "/content/webgl/pickObj", text: "pickObj", },

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