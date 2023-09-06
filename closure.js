function outer() {
    var count = 0
    function inner(v) {
        var c = 100
        return function inner1(params) {
            return c + count
        }
    }
    return inner()
}
var fn = outer()

fn(1)

function foo(a) {
    var x = { n: 10 };
    return function bar() {
        return a
    };
}

var returnedFunction = foo();

var x = returnedFunction()

function baz() {
    var x = 1;
    return {
        foo: function foo() { return ++x; },
        bar: function bar() { return --x; },
        to: function to(params) {
            setTimeout(() => {
                console.log(x)
            }, 3000);
        }
    };
}

var closures = baz();

closures.foo(), // 2
    closures.bar()  // 1

setTimeout(function () { console.log(1); }, 0); new Promise(function (reslove) { console.log(2); reslove('p1'); new Promise(function (reslove) { console.log(3); setTimeout(function () { reslove('setTimeout2'); console.log(4); }, 0); reslove('p2'); }).then(function (data) { console.log(data); }); setTimeout(function () { reslove('setTimeout1'); console.log(5); }, 0); }).then(function (data) { console.log(data); }); console.log(6);//打印结果：// 2,3,6,p2,p1,1,4,5


