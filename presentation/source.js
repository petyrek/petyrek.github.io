// EcmaScript 5
// 1) strict mode
//Variables must be declared in strict mode
function sloppyFunc(){
	sloppyVar = 5;
}// creates a global variable 'sloppyVar'

function strictFunc(){
	'use strict';
	strictVar = 5;
}// ReferenceError: strictVar is not defined


// this is undefined in nonmethod functions
function sloppyFunc() {
    console.log(this === window);  // true
}
function strictFunc() {
    'use strict';
    console.log(this === undefined);  // true
}


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
    console.log(str.length);  // 3
}
function strictFunc() {
    'use strict';
    str.length = 7; // TypeError: Cannot assign to read only property 'length' of abc
}


// Cannot delete unqualified identifiers like this
delete foo;
// in strict mode you must use
delete window.foo;


// In strict mode variables declared inside evaluated string by eval()
// are not added to the scope sourrounding eval
eval()


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
        return 'getter';
    },
    set foo(value) {
        console.log('setter: '+value);
    }
};

//Defining Accessors via Property Descriptors
var obj = Object.create(
    Object.prototype, {  // object with property descriptors
        foo: {  // property descriptor
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
	console.log("the value of this in add function: ", this);
	return a + b;
}
var adderOfTwo = add.bind(5, 2);
console.log("Adder of two given 5: ", adderOfTwo(5));