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
                        { path: "/content/basic/Javascript", text: "Javascript", },
                        { path: "/content/basic/nodeJs", text: "Node.js" },
                    ]
                },
                {
                    text: "svg",
                    submenu: [
                        { path: "/content/svg/createSVG", text: "Create SVG" },
                        { path: "/content/svg/animation", text: "Animate Gradient" },
                        { path: "/content/svg/simplePieChart", text: "Simple Pie Chart" },
                        { path: "/content/svg/realPieChart", text: "Real Pie Chart" },
                        { path: "/content/svg/animatedLine", text: "Animated line" },
                        { path: "/content/svg/plotDot", text: "Plot dot", },
                    ]
                },
                {
                    initOpen: true,
                    text: "webgl",
                    submenu: [
                        { path: "/content/webgl/threeJsTest", text: "ThreeJs-start" },
                        { path: "/content/webgl/draw2d", text: "Visualization", initActive: true },
                        { path: "/content/webgl/loadModel", text: "ThreeJs-loadGLTF", },
                        { path: "/content/webgl/robotArm", text: "RobotArm", },


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