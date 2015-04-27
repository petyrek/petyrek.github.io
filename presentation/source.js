// EcmaScript 5
// 1) strict mode

//Variables must be declared in strict mode
function sloppyFunc(){
	sloppyVar = 5;
}
sloppyFunc();

function strictFunc(){
	'use strict';
	strictVar = 5;
}
strictFunc();


// this is undefined in nonmethod functions
function sloppyFunc()
{
    console.log(this);
}
sloppyFunc();

function strictFunc() {
    'use strict';
    console.log(this);
}
strictFunc();


// get a warning when you forget new
// in sloppy mode global variables x and y are created
function Point(x, y) {
    'use strict';
    this.x = x;
    this.y = y;
}


// Cannot change immutable types
var str = 'abc';
function sloppyFunc() {
    this.str.length = 7;  // no effect, silent failure
    console.log(str.length);
}
sloppyFunc();

function strictFunc() {
    'use strict';
    str.length = 7; // TypeError: Cannot assign to read only property 'length' of abc
}
strictFunc();


// with statement not allowed in strict
var a = {
	b : {
		c : {
			d : 1
		}
	}
}
with(a.b.c){
	console.log("with example: ", d);
}


// 2) Accessor properties
var obj = {
    get foo() {
        return 'getter called';
    },
    set foo(value) {
        console.log('setter called with value of : '+value);
    }
};


// Definign Data properties
var obj = Object.create(
    Object.prototype, {
        foo: {
            value: { string: "a" },
            configurable: false,
            writable: false,
            enumerable: false
        }
    }
);

//Defining Accessors via Property Descriptors
var obj = Object.create(
    Object.prototype, {
        foo: {
            get: function () {
                return 'getter';
            },
            set: function (value) {
                console.log('setter: '+value);
            }
        }
    }
);


// 3) New Function method bind
function add(a, b){
	console.log("the value of this:", this);
	return a + b;
}
var adderOfTwo = add.bind("yolo swag string", 2);
console.log("Adder of two given 5: ", adderOfTwo(5));