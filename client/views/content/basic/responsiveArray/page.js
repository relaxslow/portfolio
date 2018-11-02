xs.init = function (module) {
    let data = ["1", "2", "3"];
    module.selectId("abc")
        .listen(data, change);

    function change() {

    }

}
function Data(data) {
    this.data = data;
}
Data.prototype.attachElement = function dataAttachElement(element, fun) {

}