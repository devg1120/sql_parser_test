const peg = require("pegjs");
const fs = require('fs');
const util = require('node:util');

//let PEGJS = fs.readFileSync("sql1.pegjs", 'utf-8');
//let PEGJS = fs.readFileSync("sql2.pegjs", 'utf-8');
//let PEGJS = fs.readFileSync("postgresql.pegjs", 'utf-8');
let PEGJS = fs.readFileSync("postgresql_gs.pegjs", 'utf-8');

//console.log(PEGJS);

var parser = peg.generate(PEGJS);





const { positionals } = util.parseArgs({
  allowPositionals: true,
});

if (positionals.length != 1) {
  console.log("arg: filepath");
  process.exit(1);
}


const filePath = positionals[0];
//console.log(filePath);

let file_data = fs.readFileSync(filePath, 'utf-8');

//console.log(file_data);
let ast = parser.parse(file_data);
console.log(ast);


