const peg = require("pegjs");
const fs = require('fs');

let PEGJS = fs.readFileSync("test04.pegjs", 'utf-8');

//console.log(PEGJS);

var parser = peg.generate(PEGJS);


let result = 0;
result= parser.parse(" 1 + 9"); 
console.log(result);

result = parser.parse("2 * 9"); 
console.log(result);



