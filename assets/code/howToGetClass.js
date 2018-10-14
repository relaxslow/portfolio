function Foo() {} 
var foo = new Foo();
typeof Foo; // == "function"
typeof foo; // == "object"
foo instanceof Foo; // == true
foo.constructor.name; // == "Foo"
Foo.name // == "Foo" 
Foo.prototype.isPrototypeOf(foo); // == true
Foo.prototype.bar = function (x) {return x+x;};
foo.bar(21); // == 42