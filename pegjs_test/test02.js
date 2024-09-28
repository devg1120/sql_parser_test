var peg = require("pegjs");


let PEGJS = `
{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
}

start
  = additive

additive
  = left:multiplicative  "+" right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary  "*"  right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return makeInteger(digits); }


`;

var parser = peg.generate(PEGJS);


let result = 0;
result= parser.parse("1+9"); 
console.log(result);

result = parser.parse("2*9"); 
console.log(result);


