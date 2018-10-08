/** @param {xs.Div} module @param  */
xs.init = function (module, data) {
    let { text, code } = data;
    let headTextElement = module.div.getElementsByClassName("codeHeadText")[0];
    headTextElement.innerHTML = text;

    let codeDiv = module.selectDiv("codeContent");
    loadCode.call(codeDiv, code);


    function loadCode(name) {
        this.runA([loadCodeA, name, null]);
        function loadCodeA() {
            this.sendRequest(`/readCodeFile/${name}`, loadCodeOk,xs.CODE);
            function loadCodeOk(code) {
                this.div.innerHTML = code;
                this.operating = null;
                xs.Debug.log("loadCode " + name);
                xs.Task.next();
            }
        }
    }

};
