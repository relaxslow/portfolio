xs.Div.prototype.collect = function (name, task) {
    if (this.operating) {
        if (task) {
            xs.Task.add(task);
            xs.Task.next();
        }
        else {
            let collection = new xs.Collection();
            collection.name = "collection " + name + " under " + this.name;
            collection.operating = "waiting for Div " + name + " ready!";
            xs.Task.add({ host: this, fun: "collect", p: name, r: collection });
            return collection;
        }
    }
    else {
        let collection;
        if (task) {
            collection = task.r;
        } else {
            collection = new xs.Collection();
        }
        collection.init(name, this.div);
        xs.Debug.log("collect : " + name);

        if (task) {
            collection.operating = null;
            xs.Task.next();
        } else {
            return collection;
        }



    }
};


xs.Div.prototype.selectDiv = function (name, task) {
    if (this.operating) {
        if (task) {
            xs.Task.add(task);
            xs.Task.next();
        }
        else {
            let wrapper = new xs.Div();
            wrapper.name = name;
            wrapper.operating = "waiting for module " + name + " ready!";
            xs.Task.add({ host: this, fun: "selectDiv", p: name, r: wrapper });
            return wrapper;
        }
    }
    else {
        let div = this.div.getElementsByClassName(name)[0];
        xs.Debug.log("selectDiv : " + name);
        if (task) {
            div.wrapper = task.r;
            task.r.div = div;
            div.wrapper.operating = null;
            xs.Task.next();

        } else {
            if (div.wrapper == null)
                div.wrapper = new xs.Div("wrap", div);
            return div.wrapper;
        }
    }

};

xs.Collection.prototype.createPopupMenu = function (initStatus, task) {
    if (this.operating) {
        if (task) {
            xs.Task.add(task);
            xs.Task.next();
        }
        else {
            let collection = new xs.Collection();
            collection.name = "popupMenu for " + this.name;
            xs.Task.add({ host: this, fun: "createPopupMenu", p: initStatus, r: collection });
            return collection;
        }
    }
    else {
        let menuCollection = null;
        if (task) {
            menuCollection = task.r;
        }
        else {
            menuCollection = new xs.Collection();
            menuCollection.name = "popupMenu for " + this.name;
        }
        wrapMenu(this, menuCollection);
        xs.Debug.log("create : " + menuCollection.name);
        if (task) xs.Task.next();
        else return menuCollection;
    }

    function wrapMenu(elementCollection, menuCollection) {
        for (let i = 0; i < elementCollection.group.length; i++) {
            const element = elementCollection.group[i];
            if (element.tagName === "DIV") {
                let popupMenu = new xs.PopUpMenu(element, initStatus);
                menuCollection.add(popupMenu);
            }
            else
                xs.Debug.taskError("element is not a div");
        }
    }

};

xs.Collection.prototype.click = function (fun, task) {
    if (this.operating) {
        xs.Task.add({ host: this, fun: "click", p: fun });
        return this;
    }
    else {
        addClickToAll(this);
        xs.Debug.log("addClickTo : " + this.name);
        if (task) {
            xs.Task.next();
        }
        else {
            return this;
        }
    }

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

xs.Collection.prototype.addData = function (param, task) {
    let [name, data] = param;//name: the name of property that stored in element
    if (this.operating) {
        xs.Task.add({ host: this, fun: "addData", p: param });
        return this;
    } else {
        xs.attachData(this.group, name, data);
        xs.Debug.log("addData:" + name);
        if (task) {
            xs.Task.next();
        } else {
            return this;
        }
    }

};
xs.Div.prototype.load = function (name, task) {
    if (this.operating) {
        if (task) {
            xs.Task.add(task);
            xs.Task.next();
        }
        else {
            xs.Task.add({ host: this, fun: "load", p: name });
            return this;
        }

    } else {
        this.name = name;
        this.sendRequest(`/loadNew${name}`, build);
        if (task) xs.Task.next();
        else return this;
    }


    function build(info) {
        if (info[0] === "0" && info[1] === "0") {
            xs.Debug.taskError("error loading module " + name + ", both js and html no found ");
        } else {

            if (info[2] === "1") this.loadCss(name);
            if (info[0] === "1") this.loadHtml(name);
            if (info[1] === "1") this.loadJs(name);
            // xs.control.cover(this);
        }
    }

};

xs.Div.prototype.loadCss = function (name, task) {
    let taskName = this.STR_LOAD_CSS + name;
    if (this.operating) {
        xs.Task.add({ host: this, fun: "loadCss", p: name });
        return this;
    } else {
        if (xs.cssInfo[name] == null) {
            xs.cssInfo[name] = [];
            let css = document.createElement("link");
            css.name = name;
            this.css.push(css);
            css.setAttribute("rel", "stylesheet");
            css.setAttribute("type", "text/css");
            css.setAttribute("href", xs.viewFolder + name + ".css");

            css.Div = this;
            css.onload = function (evt) {
                loadCssOk.call(evt.currentTarget.Div);
            };

            this.operating = "waiting " + taskName;
            document.getElementsByTagName("head")[0].appendChild(css);
        } else {
            xs.cssInfo[name].push(this);
        }
        return this;
    }

    function loadCssOk() {
        xs.cssInfo[name].push(this);
        this.operating = taskName;
        xs.Debug.log(taskName);
        xs.Task.next();
    }


};