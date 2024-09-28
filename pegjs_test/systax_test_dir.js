
const peg = require("pegjs");
const fs = require('fs');
const path = require('path');
const util = require('node:util');
//import * as util from "node:util";
//import * as fs from "node:fs/promises";
//import * as fs2 from "fs";
//import * as path from "path";



function info(fp, stat) {
   console.log(fp, stat);
}

function print_json(stmts) {
    process.stdout.write(JSON.stringify(stmts, null, 2));
    console.log("");
}



//let PEGJS = fs.readFileSync("sql1.pegjs", 'utf-8');
//let PEGJS = fs.readFileSync("sql2.pegjs", 'utf-8');
let PEGJS = fs.readFileSync("postgresql.pegjs", 'utf-8');
//let PEGJS = fs.readFileSync("postgresql_gs.pegjs", 'utf-8');

//console.log(PEGJS);

var parser = peg.generate(PEGJS);

function parse( filePath, file_data ) {
    let ast = null;
    try {
       ast = parser.parse(file_data);
    } catch (e) {
      console.log(path.basename(filePath));
      console.log("msg:",e.message);
      //console.log("   ","expext",e.expected);
      //console.log("   ","found:",e.found);
      //console.log("   ","loc:",e.location);
      process.exit(1);

    }
    //console.log(ast);
    return ast;
}

function read( filePath ) {
    let file_data = fs.readFileSync(filePath, 'utf-8');
    console.log(path.basename(filePath));
    let result = parse(filePath, file_data);
    let ast = result["ast"];
    //print_json(ast);
    if (Array.isArray(ast)) {
         for (let i in ast) {
            console.log("   ",i, ast[i]["type"]);
	 }
    } else {
        console.log("   ",ast["type"]);
    }
}

function walkSync(dir, suffix) {
  let results = [];
  let list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    let stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      /* Recurse into a subdirectory */
      results = results.concat(walkSync(file, suffix));
    } else {
      // NOTE: append files with specified suffix:
      if (!suffix || suffix.length <= 0 || _hasSuffix(file, suffix)) {
        results.push(file);
      }
    }
  });
  return results;

  function _hasSuffix(filename, list) {
    if (typeof list === "string") {
      return filename.endsWith(list);
    } else if (Array.isArray(list)) {
      for (let len = list.length, i = 0; i < len; i++) {
        const suffix = list[i];
        if (filename.endsWith(suffix)) {
          return true;
        }
      }
    }
    return false;
  }
}

const { positionals } = util.parseArgs({
  allowPositionals: true,
});

if (positionals.length != 1) {
  console.log("arg: filepath");
  process.exit(1);
}

let dir = positionals[0];


//let ext = "sql,txt";
let ext = "sql";
let filePaths = walkSync(dir, ext.split(","));

let c = 0;
let max = 3;
for (let i in filePaths) {
   c += 1;
   //if ( c > max ) { break; }
  //console.log(filePaths[i]);
  //console.log(path.basename(filePaths[i]));
  read(filePaths[i]);
    
}

