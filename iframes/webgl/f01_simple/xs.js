
let xs = {};
xs.Events = [];
xs.Event = function (conditions, fun) {
    this.conditions = conditions;
    this.undoneNum = Object.keys(conditions).length;
    this.fun = fun;
    xs.Events.push(this);
    this.index = xs.Events.length - 1;
}
xs.Event.prototype.remove = function () {
    xs.Events.splice(this.index, 1);
}
xs.Event.prototype.ok = function (name,value) {
    this.conditions[name] = value;
    this.undoneNum--;
    if (this.undoneNum == 0) {
        this.fun();
        this.remove();
    }
}
function loadHtml(div, name, fun) {
    if (!name) {
        div.innerHTML = "";
        return;
    }
    sendRequest(`/loadHtml${name}`, loadOk, null, div);
    function loadOk(html) {
        this.innerHTML = html;
        if (fun) fun();
    }
}


function sendRequest(url, fun, data, owner) {
    url += "?data=" + encodeURIComponent(data);//parsedUrl.query.data
    let xhttp = new XMLHttpRequest();
    xhttp.open("get", url, true);
    xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
    xhttp.setRequestHeader("Content-Type", "text/plain");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (fun != undefined) {
                fun.call(owner, this.responseText,data);
            }
            if (this.readyState == 4 && this.status == 500) {
                window.stop();
                console.trace();
                throw new Error("internal server error");
            }
        }

    };
};
