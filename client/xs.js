
window.xs = {};
xs.Debug = {};
xs.Debug.redAlert = function (msg) {
    console.trace();
    throw new Error(msg);

};
xs.Debug.yellowAlert = function (msg) {
    console.log(`%c${msg}`, 'background: #000000; color: #ffff00');

};
xs.Debug.greenAlert = function (msg) {
    console.log(`%c ${msg}`, 'background: #222; color: #bada55');
};

xs.sendRequest = function (url, fun) {
    // url += "?data=" + encodeURIComponent(JSON.stringify(jsonObj));
    let xhttp = new XMLHttpRequest();
    xhttp.open("get", url, true);
    xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
    xhttp.setRequestHeader("Content-Type", "text/plain");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (fun != undefined)
                fun(this.responseText);
            if (this.readyState == 4 && this.status == 500) {
                window.stop();
            }
        }

    };
};

xs.Task = {};
xs.Task.queue = [];
xs.Task.next = function () {
    if (this.queue.length > 0) {
        let task = this.queue.shift();
        task.host[task.fun](task.p);
    }
    else{
        console.log("--- process ok---");
    }

};


xs.Div = function (option, param) {
    let div;
    if (option === "wrap") {
        if (param == null) {
            throw new Error("need input an object to wrap");
        }
        div = param;
    }
    else if (option === "new") {
        div = document.createElement("div");
        if (param == null) {
            throw new Error("need input a parent to append");
        }
        param.appendChild(div);
    }

    div.warper = this;
    this.get = () => {
        return div;
    };
    this.set = (d) => {
        div = d;
    };
    return this;
};
xs.Div.prototype.class = function (name) {
    this.get().classList.add(name);
    return this;
}
xs.viewFolder = "/client/views";
xs.Div.prototype.loadHtml = function (name) {
    this.loadHtmlOk = (html) => {
        this.get().innerHTML = html;
        this.operating = false;
        console.log("finish load html:" + name);
        xs.Task.next();
    };

    if (this.operating) {
        xs.Task.queue.push({ host: this, fun: "loadHtml", p: name });
    } else {
        //   let bind = recieveHtml.bind(this);
        xs.sendRequest(`/readHtmlFile${name}`, this.loadHtmlOk);
        this.operating = true;

    }


};

xs.Div.prototype.loadJs = function (name) {
    this.loadJsOk = (evt) => {
        console.log("finish load js:" + name);
        document.getElementsByTagName("head")[0].removeChild(evt.currentTarget);
        if (xs.init == null) {
            xs.Debug.yellowAlert("xs.init not define in file:" + name + ".js");
        } else {
            xs.load(this.get());
        }
     
        xs.Task.next();
    };

    if (this.operating) {
        xs.Task.queue.push({ host: this, fun: "loadJs", p: name });
    } else {
        let script = document.createElement('script');
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", xs.viewFolder + name + ".js");
        script.onload = this.loadJsOk;
        document.getElementsByTagName("head")[0].appendChild(script);
    }


};
xs.cssInfo = {};
xs.Div.prototype.loadCss = function (name) {
    this.loadCssOk = (evt) => {
        console.log("finish load css:" + name);
        xs.cssInfo[name].push(this);
        this.operating = false;
        xs.Task.next();
    };
    if (xs.cssInfo[name] == null) {
        xs.cssInfo[name] = [];
        let css = document.createElement("link");
        this.css = css;
        css.setAttribute("rel", "stylesheet");
        css.setAttribute("type", "text/css");
        css.setAttribute("href", xs.viewFolder + name + ".css");
        css.onload = this.loadCssOk;
        document.getElementsByTagName("head")[0].appendChild(css);
        this.operating = true;
    } else {
        xs.cssInfo[name].push(this);
    }

};
xs.Div.prototype.load = function (name) {
    this.name = name;
    this.build = (info) => {
        if (info[0] === "0" && info[1] === "0") {
            throw new Error("both js and html no found");
        } else {
            if (info[2] === "1") this.loadCss(name);
            if (info[0] === "1") this.loadHtml(name);
            if (info[1] === "1") this.loadJs(name);
        }


    };
    xs.sendRequest(`/loadNew${name}`, this.build);
    return this;
};
xs.Div.prototype.clear = function () {
    let arr = xs.cssInfo[this.name];
    arr.splice(arr.indexOf(this), 1);
    if (arr.length == 0) {
        this.css.parentNode.removeChild(this.css);
        delete xs.cssInfo[this.name];
    }
    return this;
};
xs.Div.prototype.collect=function (name){
    return new xs.Collection(name,this.get());
};
xs.selectDiv = function (name,parent ) {
    let div = parent.getElementsByClassName(name)[0];
    if(div.warper==null)
    new xs.Div("wrap",div);
    return div.warper;
};
xs.init = function () {
    new xs.Div("new", document.body).class("main")
        .load("/index");

};
xs.load = function (parent) {
    xs.init(parent);
    xs.init = null;
};

xs.Collection = function (className, parent) {
    this.group = parent.getElementsByClassName(className);

};

xs.Collection.prototype.addData = function (arr, fun) {
    for (let i = 0; i < this.group.length; i++) {
        if (fun != null)
            fun(this.group[i], arr[i]);
        else
            this.group[i].data = arr[i];
    }
};
