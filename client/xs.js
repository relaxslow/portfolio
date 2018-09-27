
window.xs = {};
xs.Debug = {};
xs.Debug.redAlert = function (msg) {
    window.stop();
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
                xs.Debug.redAlert("internal server error");
            }
        }

    };
};


xs.Task = {};
xs.Task.queue = [];
xs.Task.next = function () {
    if (this.queue.length > 0) {
        let task = this.queue.shift();
        task.host[task.fun](task.p, task);
    }
    else {
        console.log("--- process ok---");
    }

};

xs.Div = function (option, param) {
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
            // param = xs.curParent;
            xs.Debug.redAlert("need input a parent to append");
        }
        param.appendChild(this.div);
        this.div.wrapper = this;
    }
    this.operating = null;
};
// xs.Div.prototype.noOperating = function () {
//     if (this.operating.length == 0)
//         return true;
//     else
//         return false;
// }
// xs.Div.prototype.addOperating = function (name) {
//     this.operating.push(name);
// }
// xs.Div.prototype.removeOperating = function (name) {
//     xs.removeOperating(this.operating, name);
// }
xs.Div.prototype.class = function (name) {
    this.div.classList.add(name);
    return this;
};
xs.viewFolder = "/client/views";
xs.Div.prototype.loadHtml = function (name) {
    this.loadHtmlOk = (html) => {
        this.div.innerHTML = html;
        this.operating = null;
        console.log("finish load html:" + name);
        xs.Task.next();
    };

    if (this.operating) {
        xs.Task.queue.push({ host: this, fun: "loadHtml", p: name });
    } else {
        //   let bind = recieveHtml.bind(this);
        xs.sendRequest(`/readHtmlFile${name}`, this.loadHtmlOk);
        this.operating = "loadHtml " + name;

    }


};

xs.Div.prototype.loadJs = function (name) {
    this.loadJsOk = (evt) => {
        console.log("finish load js:" + name);
        document.getElementsByTagName("head")[0].removeChild(evt.currentTarget);
        if (xs.init == null) {
            xs.Debug.yellowAlert("xs.init not define in file:" + name + ".js");
        } else {
            xs.load(this);

        }
        this.div.style = null;
        this.operating = null;
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
        this.operating = "loadJs " + name;
    }


};
xs.cssInfo = {};
xs.Div.prototype.loadCss = function (name) {
    this.loadCssOk = (evt) => {
        console.log("finish load css:" + name);
        xs.cssInfo[name].push(this);
        this.operating = null;
        xs.Task.next();
    };
    if (xs.operating) {
        xs.Task.queue.push({ host: this, fun: "loadCss", p: name });
    } else {
        if (xs.cssInfo[name] == null) {
            xs.cssInfo[name] = [];
            let css = document.createElement("link");
            this.css = css;
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("href", xs.viewFolder + name + ".css");
            css.onload = this.loadCssOk;
            document.getElementsByTagName("head")[0].appendChild(css);
            this.operating = "loadCss " + name;
        } else {
            xs.cssInfo[name].push(this);
        }
    }


};
xs.Div.prototype.load = function (name) {
    if (this.operating) {
        xs.Task.queue.push({ host: this, fun: "load", p: name });
        return this;
    } else {
        this.name = name;
        this.build = (info) => {
            if (info[0] === "0" && info[1] === "0") {
                xs.Debug.redAlert("error loading module " + name + ", both js and html no found ");
            } else {
                if (info[2] === "1") this.loadCss(name);
                if (info[0] === "1") this.loadHtml(name);
                if (info[1] === "1") this.loadJs(name);
            }


        };
        xs.sendRequest(`/loadNew${name}`, this.build);
        xs.Task.next();
        return this;
    }

};
xs.Div.prototype.clear = function () {
    this.div.style.visibility = "hidden";
    removeSingleCss(this.div);
    xs.iteratechild(this.div, removeSingleCss);
    /**
     * 
     * @param {Element} node 
     */
    function removeSingleCss(node) {
        let wrapper = node.wrapper;
        if (node.tagName === "DIV" &&
            wrapper != null &&
            wrapper.css != null) {
            let arr = xs.cssInfo[wrapper.name];
            arr.splice(arr.indexOf(node), 1);
            if (arr.length == 0) {
                wrapper.css.parentNode.removeChild(wrapper.css);
                delete xs.cssInfo[wrapper.name];
            }
        }

    }
    return this;
};
/**
 * 
 * @param {*} name 
 * @return {xs.Collection}
 */
xs.Div.prototype.collect = function (name, task) {
    let result;
    if (this.operating) {
        if (task != null) xs.Task.queue.push(task);
        else result = new xs.Collection();
        xs.Task.queue.push({ host: this, fun: "collect", p: name, r: result });
        result.operating = "collect " + name;
        return result;
    }
    else {
        if (task != null) result = task.r;
        else result = new xs.Collection();
        result.init(name, this.div);
        result.operating = null;
        xs.Task.next();
        return result;
    }
};

/**
 * 
 * @param {string} name 
 * @return {xs.Div}
 */
xs.Div.prototype.selectDiv = function (name, task) {
    if (this.operating) {
        if (task) {
            xs.Task.queue.push(task);
        } else {
            let result = new xs.Div();
            result.operating = "selectDiv" + name;
            xs.Task.queue.push({ host: this, fun: "selectDiv", p: name, r: result });
            return result;
        }

    } else {
        let div = this.div.getElementsByClassName(name)[0];
        if (task) {
            div.wrapper = task.r;
            task.r.div = div;
            div.wrapper.operating = null;
        } else {
            if(div.wrapper==null)
            new xs.Div("wrap", div);
            
        }

        console.log("select Div " + name);
        xs.Task.next();
        return div.wrapper;
    }

};

// xs.selectDiv = function (name, parent) {
//     if (parent == null)
//         xs.Debug.redAlert("parent not specified");
//     let div = parent.getElementsByClassName(name)[0];
//     if (div.wrapper == null)
//         new xs.Div("wrap", div);
//     return div.wrapper;
// };

//collection
xs.Collection = function () {
    this.group = null;
    this.name = null;
};
xs.Collection.prototype.init = function (className, parent) {
    this.name = "collection " + className;
    this.group = parent.getElementsByClassName(className);
};
xs.attachData = function (group, name, data) {
    if (group.length != data.length)
        xs.Debug.redAlert("data number(" + data.length + ") not equal to element number(" + group.length + ")!");
    for (let i = 0; i < group.length; i++) {
        group[i][name] = data[i];
    }

};
xs.Collection.prototype.addData = function (param) {
    let [name, data] = param;//name: the name of property that stored in element
    if (this.operating) {
        xs.Task.queue.push({ host: this, fun: "addData", p: param });
    } else {
        xs.attachData(this.group, name, data);
        xs.Task.next();

    }
    return this;
};
xs.Collection.prototype.createPopupMenu = function (initStatus, task) {
    let newGroup;
    if (this.operating) {
        if (task != null) xs.Task.queue.push(task);
        else {
            newGroup = [];
            newGroup.operating = "wait for collection " + this.name + " ready";
            xs.Task.queue.push({ host: this, fun: "createPopupMenu", p: initStatus, r: newGroup });
        }
    }
    else {
        if (task != null) newGroup = task.r;
        else newGroup = [];

        for (let i = 0; i < this.group.length; i++) {
            const element = this.group[i];
            if (element.tagName === "DIV") {
                let popupMenu = new xs.PopUpMenu(element, initStatus);
                popupMenu.pullback();
                newGroup.push(popupMenu);
            }
            else
                xs.Debug.redAlert("element is not a div");
        }
        xs.Task.next();

    }
    return newGroup;
};
xs.Collection.prototype.click = function (fun) {
    if (this.operating) {
        xs.Task.queue.push({ host: this, fun: "click", p: fun });
    }
    else {
        for (let i = 0; i < this.group.length; i++) {
            const element = this.group[i];
            element.addEventListener("click", clickfun);
        }
        xs.Task.next();
    }
    function clickfun(evt) {
        fun(evt.currentTarget);
    }
};
//popup menu
xs.PopUpMenu = function (div, openOrClose) {
    this.div = div;
    div.menu = this;
    this.status = openOrClose;
    if (openOrClose == xs.PopUpMenu.CLOSE) {
        div.style.height = "0px";
    }
};
xs.PopUpMenu.CLOSE = "close";
xs.PopUpMenu.OPEN = "open";
xs.PopUpMenu.prototype.transitionend = function (evt) {
    let element = evt.currentTarget;
    element.removeEventListener('transitionend', arguments.callee);
    element.style.height = null;
};
xs.PopUpMenu.prototype.popup = function () {
    let element = this.div;
    var sectionHeight = element.scrollHeight;
    element.style.height = sectionHeight + 'px';
    element.addEventListener('transitionend', this.transitionend);
    element.menu.status = xs.PopUpMenu.OPEN;
};
xs.PopUpMenu.prototype.pullback = function () {
    let element = this.div;
    element.removeEventListener('transitionend', this.transitionend);
    var sectionHeight = element.scrollHeight;
    var elementTransition = element.style.transition;
    element.style.transition = '';
    requestAnimationFrame(function () {
        element.style.height = sectionHeight + 'px';
        element.style.transition = elementTransition;
        requestAnimationFrame(function () {
            element.style.height = 0 + 'px';
        });
    });

    this.status = xs.PopUpMenu.CLOSE;
};

xs.system = {};
xs.system.operating = null;
xs.loadGoogleFont = function (name) {
    this.loadFontOk = () => {
        console.log("finsh load font " + name);
        xs.system.operating = null;
        xs.Task.next();
    };
    let css = document.createElement("link");
    css.setAttribute("rel", "stylesheet");
    css.setAttribute("href", 'https://fonts.googleapis.com/css?family=' + name);
    css.onload = loadOk;
    document.getElementsByTagName("head")[0].appendChild(css);
    xs.system.operating = "loadGoogleFont";
};

xs.selectModule = function (name) {
    function isNodeWanted(node) {
        if (node.tagName === "DIV" &&
            node.wrapper != null &&
            node.wrapper.name === name) {
            return node.wrapper;
        }
        return null;
    }
    let result = xs.iteratechild(document.body, isNodeWanted);
    return result;
};
xs.iteratechild = function (node, fun) {
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


xs.init = function () {
    new xs.Div("new", document.body).class("main")
        .load("/index");

};
xs.load = function (parent) {
    xs.init(parent);
    xs.init = null;
};