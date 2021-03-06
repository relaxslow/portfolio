window.xs = {};
xs.control = {};
xs.control.waitingServer = 0;
xs.control.waitingLoad = 0;
xs.control.hidden = [];
xs.control.uncover = function () {
    for (let i = 0; i < this.hidden.length; i++) {
        let module = this.hidden[i];
        module.div.style = null;
        xs.Debug.log("uncover module " + module.name);
    }
    this.hidden.length = 0;
};
xs.control.cover = function (module) {
    xs.Debug.log("cover module " + module.name);
    this.hidden.push(module);
    module.div.style.visibility = "hidden";
};
xs.sendRequest = function (url, fun, owner, data) {
    url += "?data=" + encodeURIComponent(data);//parsedUrl.query.data
    let xhttp = new XMLHttpRequest();
    xhttp.owner = owner;
    xhttp.open("get", url, true);
    xhttp.setRequestHeader("x-requested-with", "XMLHttpRequest");
    xhttp.setRequestHeader("Content-Type", "text/plain");
    xhttp.send();
    xs.control.waitingServer++;
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (fun != undefined) {
                xs.control.waitingServer--;
                fun.call(this.owner, this.responseText);

            }
            if (this.readyState == 4 && this.status == 500) {
                xs.Debug.redAlert("internal server error");
            }
        }

    };
};

xs.Debug = {};
xs.Debug.log = function (msg) {
    console.log(msg);
};
xs.Debug.logWithColor = function (msg, fColor, bColor) {
    console.log(`%c${msg}`, "background: #" + bColor + "; color: #" + fColor);
};
xs.Debug.redAlert = function (msg) {
    window.stop();
    console.trace();
    throw new Error(msg);
};

xs.Debug.yellowAlert = function (msg) {
    xs.Debug.logWithColor(msg, "ffff00", "000000");
};
xs.Debug.greenAlert = function (msg) {
    xs.Debug.logWithColor(msg, "bada55", "222");
};


xs.clearTask = function () {
    this.queue.length = 0;
};
xs.Task = { name: "System Task" };
xs.Task.queue = [];
xs.Task.root = null;
xs.Task.next = function () {
    if (this.queue.length > 0) {
        let task = this.queue.shift();
        task.host[task.fun](task.p, task);
    }
    else {
        if (xs.control.waitingServer == 0 &&
            xs.control.waitingLoad == 0) {
            xs.control.uncover();
        }

    }

};
xs.Task.add = function (task) {
    // task.error = new Error();
    this.queue.push(task);
};

xs.AnimationTask = { name: "Animation Task" };
xs.AnimationTask.queue = [];

xs.AnimationTask.next = function () {
    if (this.queue.length > 0) {
        let task = this.queue.shift();
        task.host[task.fun](task.p, task);
    }
    else {
        xs.Debug.log("--- animation ---");
    }
};
xs.AnimationTask.add = function (task) {
    this.queue.push(task);
};
xs.getDiv = function getDiv(div) {
    if (div.wrapper == null) {
        let wrapper = new xs.Div("wrap", div);
        return wrapper;
    } else {
        return div.wrapper;
    }
};
xs.Div = function Div(option, param) {
    this.div = null;
    if (option === "wrap") {
        if (param == null) {
            xs.Debug.redAlert("need input an object to wrap");
        }
        this.div = param;
        this.div.wrapper = this;

    }
    else if (option === "new") {
        this.div = document.createElement("div");
        if (param == null) {
            xs.Debug.redAlert("need input a parent to append");
        }
        param.appendChild(this.div);
        this.div.wrapper = this;
    }
    this.operating = null;
    this.css = [];
    this.animationIDs = [];

};
xs.Div.prototype.loadSVG = function (name) {
    this.sendRequest("/loadSVG", function (svg) {
        this.innerHTML = svg;
    })
}
xs.Div.prototype.addClass = function divAddClass(name) {
    this.name = name;
    this.div.classList.add(name);
    xs.Debug.log("addClass " + name);
    return this;
};
xs.Div.prototype.removeClass = function divRomoveClass(name) {
    this.div.classList.remove(name);
    xs.Debug.log("removeClass " + name);
    return this;
};
xs.Div.prototype.sendRequest = function sendRequest(url, fun, data) {
    xs.sendRequest(url, fun, this, data);
};
xs.Div.prototype.STR_LOAD_HTML = "loadHtml : ";
xs.Div.prototype.STR_LOAD_JS = "loadJS : ";
xs.Div.prototype.STR_LOAD_CSS = "loadCSS : ";

xs.Div.prototype.loadHtml = function divLoadHtml(name) {
    let taskName = this.STR_LOAD_HTML + name;
    this.sendRequest(`/readHtml${name}/page`, loadHtmlOk, this.currentFolder);
    this.operating = "waiting " + taskName;
    function loadHtmlOk(html) {
        this.div.innerHTML = html;
        this.operating = taskName;
        xs.Debug.log(taskName);
        xs.Task.next();
    }

};

xs.loadJs = function loadJs(name, fun) {
    let script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", name + ".js");
    script.setAttribute("defer", "defer");
    script.onload = function (evt) {
        let script = evt.currentTarget;
        document.getElementsByTagName("head")[0].removeChild(script);
        fun.call(script.Div);
    };
    script.Div = this;
    document.getElementsByTagName("head")[0].appendChild(script);
};
xs.Div.prototype.loadJs = function divLoadJs(name) {
    let taskName = this.STR_LOAD_JS + name;
    this.operating = "waiting " + taskName;
    xs.control.waitingLoad++;
    xs.loadJs.call(this, this.currentFolder + name + "/page", loadJsOk);

    function loadJsOk() {
        if (this.isDeath) return;
        xs.control.waitingLoad--;

        xs.Debug.log(taskName);

        if (xs.init == null) xs.Debug.yellowAlert("xs.init not define in file:" + name + ".js");
        else this.loadModuleOk(this);
        this.operating = null;
        xs.Task.next();

    }


};
xs.cssInfo = {};
xs.cssRef = {};
xs.loadCss = function loadCss(name, loadOkfun) {
    let css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("type", "text/css");
    css.setAttribute("href", name + ".css");
    css.Div = this;
    css.onload = function (evt) {
        let css = evt.currentTarget;
        loadOkfun.call(css.Div, css);
    };
    document.getElementsByTagName("head")[0].appendChild(css);

};

xs.Div.prototype.loadCss = function divLoadCss(name) {
    if (xs.cssInfo[name] == null) {
        xs.cssInfo[name] = [];
        this.operating = "waiting " + this.STR_LOAD_CSS + name;
        xs.control.waitingLoad++;
        xs.loadCss.call(this, this.currentFolder + name + "/page", loadCssOk);
    } else {
        this.css.push(name);//
        xs.cssInfo[name].push(this);
        this.operating = this.STR_LOAD_CSS + name;
        xs.Task.next();
    }
    return this;
    function loadCssOk(css) {
        if (this.isDeath) return;
        xs.control.waitingLoad--;
        this.css.push(name);

        css.name = name;
        xs.cssInfo[name].push(this);
        xs.cssRef[name] = css;
        let taskName = this.STR_LOAD_CSS + name;
        this.operating = taskName;
        xs.Debug.log(taskName);
        xs.Task.next();
    }
};

// xs.currentFolder = null;
xs.VIEW = "/client/views";
xs.COMPONENT = "/client/component";
xs.CODE = "/assets/code";
xs.Div.prototype.load = function divLoad(name, folder, data) {
    if (folder == null) {
        this.currentFolder = xs.VIEW;
    }
    else {
        this.currentFolder = folder;
    }
    this.name = name;
    this.loadModuleOk = loadModuleOk;
    this.sendRequest(`/loadNew${this.name}/page`, build, this.currentFolder);
    return this;

    function build(info) {
        if (info[0] === "0" && info[1] === "0") {
            xs.Debug.redAlert("error loading module " + this.name + ", both js and html no found ");
        } else {

            if (info[2] === "1") this.runA([this.loadCss, this.name, null]);
            if (info[0] === "1") this.runA([this.loadHtml, this.name, this.STR_LOAD_CSS + this.name]);
            if (info[1] === "1") this.runA([this.loadJs, this.name, this.STR_LOAD_HTML + this.name]);
        }
    }

    /**@param {xs.Div} parent */
    function loadModuleOk(parent) {
        parent.runA([xs.init, parent, null, data]);
        xs.init = null;
        xs.Task.root = null;
    }
};


xs.Div.prototype.clear = function divClear() {
    xs.Task.root = this;
    this.operating = null;
    xs.clearTask.call(xs.Task);
    xs.clearTask.call(xs.AnimationTask);
    xs.control.waitingServer = 0;
    xs.control.waitingLoad = 0;
    xs.control.cover(this);
    xs.iteratechild(this.div, clean);


    xs.Debug.log("clear " + this.name);

    function clean(div) {
        if (div.tagName == 'IFRAME')
            div.isDeath = true;
        let wrapper = div.wrapper;
        if (wrapper != null) {
            removeCss(wrapper);
            if (wrapper != xs.Task.root)
                wrapper.isDeath = true;
            clearTimer.call(wrapper);
        }

    }

    function removeCss(wrapper) {
        if (wrapper.css.length != 0) {
            for (let i = 0; i < wrapper.css.length; i++) {
                let css = xs.cssRef[wrapper.css[i]];
                let arr = xs.cssInfo[css.name];
                arr.splice(arr.indexOf(wrapper.div), 1);

                if (arr.length == 0) {
                    css.parentNode.removeChild(css);
                    delete xs.cssInfo[css.name];
                    delete xs.cssRef[css.name];
                }

            }
            wrapper.css.length = 0;
        }
    }

    function clearTimer() {
        if (this.timers) {
            for (let i = 0; i < this.timers.length; i++) {
                let timer = this.timers[i];
                clearTimeout(timer);
            }
            this.timers = null;
        }
    }

    return this;
};


xs.init = null;
xs.begin = function () {
    // xs.initThreeJs();
    new xs.Div("new", document.body).addClass("main")
        .clear()
        .load("/entry");
};
xs.Div.prototype.runA = function divRunA(param, task) {
    let [fun, p, signal, data] = param;
    if (this.operating !== signal) {
        if (task) {
            xs.Task.add(task);
        } else {
            xs.Task.add({ host: this, fun: "runA", p: param });
            return this;
        }
    } else {
        fun.call(this, p, data);
        if (task) {
            xs.Task.next();
        }
        else {
            return this;
        }

    }
};

xs.Div.prototype.collect = function divCollect(name) {
    let collection = new xs.Collection();
    collection.module = this;
    collection.init(name, this.div);
    xs.Debug.log("collect : " + name);
    return collection;

};


xs.Div.prototype.selectDiv = function divSelect(name) {
    let div = this.div.getElementsByClassName(name)[0];
    if (div == null) {
        xs.Debug.redAlert("can't find element with class name" + name);
    }
    xs.Debug.log("selectDiv : " + name);
    if (div.wrapper == null)
        div.wrapper = new xs.Div("wrap", div);
    return div.wrapper;

};

xs.Div.prototype.buildFrame = function buildThreeJsCanvas(wid, hei, name, data) {
    this.operating = "waiting loadiframe";
    xs.control.waitingLoad++;
    let iframe = document.createElement("iframe");
    iframe.src = name;
    iframe.width = wid;
    iframe.height = hei;
    iframe.frameBorder = 0;
    iframe.style.backgroundColor = "#9c9c9c";
    iframe.onload = iframeLoadOk;
    this.div.appendChild(iframe);

    function iframeLoadOk(evt) {
        if (this.isDeath)
            return;
        xs.control.waitingLoad--;

        let frame = evt.currentTarget;
        frame.contentWindow.addEventListener("click", focus);
        if (frame.contentWindow.start)
            frame.contentWindow.start(data);

        this.operating = null;
        xs.Task.next();
    }
    function focus(evt) {
        let window = evt.currentTarget;
        window.focus();
    }
}
//collection
xs.Collection = function Collection() {
    this.group = null;
    this.name = null;
    this.operating = null;
};
xs.Collection.prototype.add = function collectionAdd(any) {
    if (this.group == null)
        this.group = [];
    this.group.push(any);
};
xs.Collection.prototype.init = function collectionInit(className, parent) {
    this.name = "collection " + className;
    this.group = parent.querySelectorAll(className);

};
xs.attachData = function attachData(group, name, obj) {
    let data;
    if (Array.isArray(obj)) data = obj;
    else if (obj instanceof xs.Collection) data = obj.group;
    if (group.length != data.length) {
        xs.Debug.taskError("data number(" + data.length + ") not equal to element number(" + group.length + ")!");
    }
    for (let i = 0; i < group.length; i++) {
        group[i][name] = data[i];
    }

};
xs.Collection.prototype.addData = function collectionAddData(param, task) {
    let [name, data] = param;//name: the name of property that stored in element
    xs.attachData(this.group, name, data);
    xs.Debug.log("addData:" + name);
    return this;
};

xs.Collection.prototype.run = function collectionRun(fun) {

    for (let i = 0; i < this.group.length; i++) {
        const element = this.group[i];
        fun(element);
    }
    return this;


};


xs.Collection.prototype.runOneByOne = function collectionRunOneByOne(startTime, fun) {
    if (startTime.length != this.group.length)
        xs.Debug.redAlert("data in startTime(" + startTime.length + ") mismatch element number(" + group.length + ")");
    if (this.module.timers == null) {
        this.module.timers = [];
    }
    start.call(this, 0);
    function start(i) {
        this.over = false;
        fun(this.group[i]);
        let timer = setTimeout(() => {
            i++;
            if (i < startTime.length)
                start.call(this, i);
            else {
                if (this.nextTask) {
                    this.nextTask.host.operating = null;
                    this.nextTask.taskManager.next();
                }


            }

        }, startTime[i]);
        this.module.timers.push(timer);
    }
    return this;
};
//Asynchronize run function
xs.Collection.prototype.runA = function collectionRunA(fun, task) {
    if (this.operating) {
        if (task) {
            xs.Task.add(task);
        }
        return this;
    } else {
        this.run(fun);
    }
};
xs.Collection.prototype.then = function collectionThen(taskManager, collection, fun) {
    collection.operating = "waiting signal to run";
    this.nextTask = {};
    this.nextTask.host = collection;
    this.nextTask.taskManager = taskManager;
    xs.AnimationTask.add({ host: collection, fun: "runA", p: fun });
};

xs.Collection.prototype.click = function collectionClick(fun, task) {
    addClickToAll(this);
    xs.Debug.log("addClickTo : " + this.name);
    return this;

    function addClickToAll(collection) {
        for (let i = 0; i < collection.group.length; i++) {
            const element = collection.group[i];
            element.addEventListener("click", clickfun);
        }
    }
    function clickfun(evt) {
        fun(evt.currentTarget);
    }
};

xs.selectModule = function selectModule(name) {
    let result = xs.iteratechild(document.body, isModule);
    return result;

    function isModule(node) {
        if (node.tagName === "DIV" &&
            node.wrapper != null &&
            node.wrapper.name === name) {
            return node.wrapper;
        }
        return null;
    }

};
xs.iteratechild = function (node, fun) {
    fun(node);
    for (let i = 0; i < node.childNodes.length; i++) {
        const child = node.childNodes[i];
        let result = fun(child);
        if (result == null)
            result = xs.iteratechild(child, fun);
        if (result != null)
            return result;
    }
    return null;
};

//responsiveData
xs.Data = {

}
