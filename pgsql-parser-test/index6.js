import { parse, deparse } from "pgsql-parser";
//import Module from "pg-query-emscripten";

import * as util from "node:util";
import * as fs from "node:fs/promises";

import * as QC from "./query_common.js";

const { positionals } = util.parseArgs({
  allowPositionals: true,
});

if (positionals.length == 0) {
  console.log("arg: <filepath>");
  console.log("     <filepath> <mode> <PTN:PTN:...>");
  console.log("                     mode: np json walk stmt");
  console.log("    node ./index4.js sql/dvdrental.sql np CreateTrigStmt:CreateStmt");
  process.exit(1);
}

let filePath = null;
let mode = "stmt";
let targets = "all";

if (positionals.length == 1) {
    filePath = positionals[0];
} else if (positionals.length == 2) {
    if (positionals[1] == "np") {
	    QC.setp(false);
    } else if (positionals[1] == "json") {
	    mode = "json"
    } else if (positionals[1] == "walk") {
	    mode = "walk"
    }
    filePath = positionals[0];
} else if (positionals.length == 3) {
    if (positionals[1] == "np") {
	    QC.setp(false);
    } else if (positionals[1] == "json") {
	    mode = "json"
    } else if (positionals[1] == "walk") {
	    mode = "walk"
    }
    filePath = positionals[0];
    targets = positionals[2];
}









fs.readFile(filePath, { encoding: "utf8" })
  .then((file) => {

   //********************************************
   const stmts = parse(file);
   let stmts2 = [];
   for (let i in stmts) {
      stmts2.push(stmts[i]["RawStmt"] )
   }
   let target_stmts = stmts2;
   //********************************************

   let filters = ["CreateStmt", "Trig"];

   if ( targets != "all") {
       filters = targets.split(':')
       target_stmts = QC.stmt_filter(stmts2, filters) 
   }

   switch(mode) {
          case "json":
                  console.log("json ============================");
                  QC.print_json(target_stmts);
                  break
          case "walk":
                  console.log("walk ============================");
                  QC.walk(target_stmts, 0);
                  break
          case "stmt":
                  console.log("stms ============================");
                  QC.stmt_print(target_stmts);
                  break
          default:
                   console.log("unknown mode:",mode);
   }

  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

