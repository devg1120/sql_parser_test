{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
}

start
  = additive

additive
  = __ left:multiplicative __ "+" __ right:additive { return left + right; }
  / multiplicative

multiplicative
  = __ left:primary __ "*" __ right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return makeInteger(digits); }

// separator
__
  = (whitespace / comment)*

___
  = (whitespace / comment)+
  

char = .


whitespace =
  [ \t\n\r]
  

comment
  = block_comment
  / line_comment

block_comment
  = "/*" (!"*/" !"/*" char / block_comment)* "*/"

line_comment
  = "--" (!EOL char)*

EOL
  = EOF
  / [\n\r]+

EOF = !.

