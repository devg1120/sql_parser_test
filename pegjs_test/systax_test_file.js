const peg = require("pegjs");
const fs = require('fs');
const path = require('path');
const util = require('node:util');






function info(fp, stat) {
   console.log(fp, stat);
}

function print_json(stmts) {
    process.stdout.write(JSON.stringify(stmts, null, 2));
    console.log("");
}

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

let file_data = null;

try {
 file_data = fs.readFileSync(filePath, 'utf-8');

} catch (e) {
  console.log(path.basename(filePath));
  console.log("msg:",e.message);
  process.exit(1);
}

//console.log(file_data);
//let ast = parser.parse(file_data);
//console.log(ast);

let result = null;
try {
   result = parser.parse(file_data);
} catch (e) {
  console.log(path.basename(filePath));
  console.log("msg:",e.message);
  //console.log("   ","expext",e.expected);
  console.log("   ","found:",e.found);
  console.log("   ","loc:",e.location);
  process.exit(1);

}

let ast = result["ast"];
//print_json(ast);
if (Array.isArray(ast)) {
     for (let i in ast) {
        console.log("   ",i, ast[i]["type"]);
     }
} else {
    console.log("   ",ast["type"]);
}


