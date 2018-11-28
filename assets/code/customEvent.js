function doSomething(e) {
    alert("Event is called: " + e.type);
}
document.body.addEventListener("myEventName", doSomething, false);
var myEvent = new CustomEvent("myEventName");
document.body.dispatchEvent(myEvent);