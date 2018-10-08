xs.init = function (module) {
    module.selectDiv("codeBox")
        .load("/code", xs.COMPONENT, { text: "JS", code: "howToGetClass" });
 
};