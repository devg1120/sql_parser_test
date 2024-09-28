var peg = require("pegjs");

var parser = peg.generate("start = ('a' / 'b')+");


let result = parser.parse("abba"); // returns ["a", "b", "b", "a"]

console.log(result);
