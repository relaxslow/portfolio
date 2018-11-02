
function monster1(disposition) {
    this.disposition = arguments[0];
    for (let i = 1; i < arguments.length; i++) {
        this.disposition += arguments[i];
    }
}

const handler1 = {
    construct(target, args) {
        console.log('monster1 constructor called');
        // expected output: "monster1 constructor called"

        return new target(...args);
    }
};

const proxy1 = new Proxy(monster1, handler1);

console.log(new proxy1('fierce', 'smile').disposition);

function wrap(obj) {
    return new Proxy(obj, {
        get: function (target, propKey) {
            console.log(`get property "${propKey}"`)
            return target[propKey];
        },
        set: function (obj, prop, value) {
            console.log(`set property"${prop}"`);
            return true;
        }
    });
}

let obj = { message: "hello propxy" };
let wrappedObj = wrap(obj);
console.log(wrappedObj.message);
wrappedObj.xxx = 10;

let arr = ["1", "2", "3"]
let wrappedArr = wrap(arr);
wrappedArr.push("4");


console.log("------------data------------")
function Data(data) {
    return new Proxy(data, {
        get: function (target, propKey, self) {
            console.log(`get "${propKey}"`)
            let result = target[propKey];
            if (propKey === "splice") {
                return function (...args){
                    target.splice(args[0],args[1]);
                }
            }
            if (propKey === "shift") {
               return function (...args){
                    target.shift();
                }
            }
            if (propKey === "pop") {
                return function (...args){
                     target.pop();
                 }
             }
            return result;
        },
        set: function (target, propKey, value) {
            console.log(`set  "${propKey}" : ${value}`);
            return true;
        },
        construct: function (target, args) {
            console.log(`new "${propKey}"`)

            return new target(...args);
        },
        deleteProperty(target, prop) {
            if (prop in target) {
                delete target[prop];
                console.log(`property removed: ${prop}`);
                // expected output: "property removed: texture"
            }
            return true;
        },
        apply: function (target, thisArg, argumentsList) {
            console.log(`Calculate sum: ${argumentsList}`);
            // expected output: "Calculate sum: 1,2"

            return target(argumentsList);
        }
    })
}
// Data.prototype.push=function (newdata){
//     this.data.push(newdata);
// }
let arr2=["a", "b", "c", "d"]
let data = new Data(arr2);
data.push("e");
console.log(data);
data.shift();
console.log(data);
let newArr = data.splice(1, 1);
console.log(data);
console.log(newArr);

let text = document.body.getElementsByClassName("test")[0];
let wrappedEle = wrap(text);
// wrappedEle.setAttribute("mydata", "hello");//TypeError: Illegal invocation
// wrappedEle.setAttribute("class","aaa");



