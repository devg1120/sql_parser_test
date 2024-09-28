//import { parse, deparse } from "pgsql-parser";
import Module from "pg-query-emscripten";

import * as util from "node:util";
import * as fs from "node:fs/promises";

let P = true;

function print(str) {
  if (P) {
    process.stdout.write(str);
  }
}

function print_(str) {
    process.stdout.write(str);
}
function print_dir(...obj) {
  if (P) {
    console.log(obj[0],obj[1]);
  }
}

function print_dir_(...obj) {
    console.log(obj[0],obj[1]);
}

function print_dir2(...obj) {
  if (P) {
    console.log(obj[0],obj[1],obj[2]);
  }
}
function print_json(stmts) {
  if (P) {
    process.stdout.write(JSON.stringify(stmts, null, 2));
    console.log("");
  }
}
function getname() {
  var e = new Error('dummy');
  var stack = e.stack
                .split('\n')[2]
                // " at functionName ( ..." => "functionName"
                .replace(/^\s+at\s+(.+?)\s.+/g, '$1' );
                return stack
}

function json(stmts) {
  var e = new Error('dummy');
  var stack = e.stack
                .split('\n')[2]
                // " at functionName ( ..." => "functionName"
                .replace(/^\s+at\s+(.+?)\s.+/g, '$1' );
  console.log(stack);
  process.stdout.write(JSON.stringify(stmts, null, 2));
  console.log("");
}
function CreateTrigStmt(stmt_d) {
  //json(stmt_d);
  print_dir("   trigname:" , stmt_d["trigname"] );
  print_dir("   funcname:" , stmt_d["funcname"] );
}

function CreateFunctionStmt(stmt_d) {
  //json(stmt_d);
  print_dir("   funcname:" , stmt_d["funcname"] );
  print_dir("   parameters:" , stmt_d["parameters"] );
  print_dir("   returnType:" , stmt_d["returnType"] );
  print_dir("   options:"    , stmt_d["options"] );

}

function CreateSeqStmt(stmt_d) {
  //json(stmt_d);
  print_dir("   sequence:"   , stmt_d["sequence"] );
  print_dir("   options:"    , stmt_d["options"] );
}
function VariableSetStmt(stmt_d) {
  console.log("    not imprement");
}
function DefineStmt(stmt_d) {
  console.log("    not imprement");
}
function AlterOwnerStmt(stmt_d) {
  console.log("    not imprement");
}
function SelectStmt(stmt_d) {
  console.log("    not imprement");
}
function CreateEnumStmt(stmt_d) {
  console.log("    not imprement");
}
function CreateDomainStmt(stmt_d) {
  console.log("    not imprement");
}
function ViewStmt(stmt_d) {
  //json(stmt_d);
  print_dir("   view:"    , stmt_d["view"] );
  print_dir("   query:"   , stmt_d["query"] );
}
function IndexStmt(stmt_d) {
  //json(stmt_d);
  print_dir("   idxname:"    , stmt_d["idxname"] );
  print_dir("   relation:"   , stmt_d["relation"] );
}
function CreateStmt(stmt_d) {
  for (let key in stmt_d) {
    let ele = stmt_d[key];
    switch (key) {
      case "relation":
        print("<" + key + ">\n");
        print(" table name:"+ ele["relname"]+ "\n");
        break;
      case "tableElts":
        print("<" + key + ">\n");
        for (let i in ele) {
          for (let key in ele[i]) {
             switch(key) {
                case "ColumnDef":
                    let colname = ele[i]["ColumnDef"]["colname"];
                    let typeName_a = ele[i]["ColumnDef"]["typeName"]["names"];
                    print(" [" + i + "]\n");
                    print("  " + key +"\n");
                    print("   colname:" + colname + "\n");
                    print("      type:");
                    for (let i in typeName_a) {
                      print(typeName_a[i]["String"]["str"] + ", ");
                    }
                    print("\n");
                    break;
                case "Constraint":
                    let contype = ele[i]["Constraint"]["contype"];
                    let pktable_schemaname = null;
                    let pktable_relname = null;
                    if (ele[i]["Constraint"]["pktable"]) {
                     pktable_schemaname = ele[i]["Constraint"]["pktable"]["schemaname"];
                     pktable_relname    = ele[i]["Constraint"]["pktable"]["relname"];
		    }

                    let fk_attrs = null;
                    if (ele[i]["Constraint"]["fk_attrs"]) {
                     fk_attrs = ele[i]["Constraint"]["fk_attrs"];
		    }
                    let pk_attrs = null;
                    if (ele[i]["Constraint"]["pk_attrs"]) {
                     pk_attrs = ele[i]["Constraint"]["pk_attrs"];
		    }
                    print(" [" + i + "]\n");
                    print("  " + key +"\n");
                    print("   contype:" + contype + "\n");
                    print("   pktable schemaname :" + pktable_schemaname + "\n");
                    print("   pktable relname    :" +  pktable_relname + "\n");
	            if (P) {
                        print_dir("   fk_attrs:" , fk_attrs );
                        print_dir("   pk_attrs:" , pk_attrs );
		    }
                    break;
                default:
                    console.log("create table unKnown:",key);
             }
          }
        }
        break;
      case "oncommit":
        print("<" + key + ">\n");
        print(" "+ ele +"\n");
        break;
      default:
        console.log("*** Not *** ", key);
    }
  }
}
function AlterTableStmt(stmt_d) {
  for (let key in stmt_d) {
    let ele = stmt_d[key];
    switch (key) {
      case "relation":
        print("<" + key + ">\n");
        print(" table name:"+ ele["relname"]+ "\n");
        break;
      case "cmds":
        print("<" + key + ">\n");
        for (let i in ele) {
          let cmd = ele[i]["AlterTableCmd"]
          for ( let key2 in cmd) {
             switch(key2){
               case "def":
                    let constraint = cmd["def"]["Constraint"];
                    print(" contype:"+constraint["contype"]+"\n");
                    print_dir(" pktable:",constraint["pktable"]);
                    print_dir(" fk_attrs:",constraint["fk_attrs"]);
                    print_dir(" pk_attrs:",constraint["pk_attrs"]);
		    break;
               case "subtype":
		    print_dir(" subtype:", cmd["subtype"]);
		    break;
               case "behavior":
		    print_dir(" behavior:", cmd["behavior"]);
		    break;
               case "newowner":
		    print_dir(" newowner:", cmd["newowner"]);
		    break;
	       default:
		     console.log("alter table unknow cmd:",key2);
	     }
	  }
        }
        break;
      case "relkind":
        print("<" + key + ">\n");
        print(" "+ ele +"\n");
        break;
      default:
        console.log("*** Not *** ", key);
    }
  }
}

function stmt_filter(array, filters) {
  let stmts = [];
  for (let i in array) {
    for (let key in array[i]["stmt"]) {
       for (let x in filters) {
              if ( key.includes(filters[x])) {
                stmts.push(array[i]);
                break;
	      }
       }
    }
  }
  return stmts
}

function stmt_print(array) {
  for (let i in array) {
    for (let key in array[i]["stmt"]) {
      let stmt_d = array[i]["stmt"][key];
      console.log("-------------------------");
      switch (key) {
        case "CreateStmt":
          console.log(key);
          CreateStmt(stmt_d);
          break;
        case "AlterTableStmt":
          console.log(key);
          AlterTableStmt(stmt_d);
          break;
        case "CreateTrigStmt":
          console.log(key);
          CreateTrigStmt(stmt_d);
          break;
	case "CreateFunctionStmt":
          console.log(key);
          CreateFunctionStmt(stmt_d);
          break;
	case "CreateSeqStmt":
          console.log(key);
          CreateSeqStmt(stmt_d);
          break;
	case "VariableSetStmt":
          console.log(key);
          VariableSetStmt(stmt_d);
          break;
	case "DefineStmt":
          console.log(key);
          DefineStmt(stmt_d);
          break;
	case "AlterOwnerStmt":
          console.log(key);
          AlterOwnerStmt(stmt_d);
          break;
	case "SelectStmt":
          console.log(key);
          SelectStmt(stmt_d);
          break;
	case "SelectStmt":
          console.log(key);
          SelectStmt(stmt_d);
          break;
	case "CreateEnumStmt":
          console.log(key);
          CreateEnumStmt(stmt_d);
          break;
	case "CreateDomainStmt":
          console.log(key);
          CreateDomainStmt(stmt_d);
          break;
	case "ViewStmt":
          console.log(key);
          ViewStmt(stmt_d);
          break;
	case "IndexStmt":
          console.log(key);
          IndexStmt(stmt_d);
          break;



        default:
          console.log("*** Not *** ", key);
      }
    }
  }
}

function stmt_print__(array) {
  for (let i in array) {
    console.log(array[i]["stmt"]);
  }
}
function walk(element, indent) {
  let base = "    ";
  let spc = base.repeat(indent);

  if (typeof element == "object") {
    if (Array.isArray(element)) {
      console.log(spc, "*** Array ***");
      console.log(spc, "[");
      for (let key in element) {
        walk(element[key], indent + 1);
      }
      console.log(spc, "]");
    } else {
      console.log(spc, "*** Dict ***");
      console.log(spc, "{");
      for (let key in element) {
        console.log(spc, " ", key, ":");
        walk(element[key], indent + 1);
      }
      console.log(spc, "}");
    }
  } else if (typeof element == "string") {
    console.log(spc, "*** string:", element);
  } else if (typeof element == "number") {
    console.log(spc, "*** number:", element);
  } else if (typeof element == "boolean") {
    console.log(spc, "*** boolean:", element);
  } else {
    console.log("$$$", typeof element);
  }
}

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
	    P = false;
    } else if (positionals[1] == "json") {
	    mode = "json"
    } else if (positionals[1] == "walk") {
	    mode = "walk"
    }
    filePath = positionals[0];
} else if (positionals.length == 3) {
    if (positionals[1] == "np") {
	    P = false;
    } else if (positionals[1] == "json") {
	    mode = "json"
    } else if (positionals[1] == "walk") {
	    mode = "walk"
    }
    filePath = positionals[0];
    targets = positionals[2];
}

let pgQuery;

(async () => {
  pgQuery = await new Module();
})();


fs.readFile(filePath, { encoding: "utf8" })
  .then((file) => {
    //console.log(file);
    const result = pgQuery.parse(file);
    let stmts = result["parse_tree"]["stmts"]
    let stderr_buffer = result["stderr_buffer"]
    let error = result["error"]
    //console.log(stmts);
    //print_json(stmts);
/*
    console.log("json ============================");
    //print_json(stmts);
    console.log("walk ============================");
    //walk(stmts, 0);
    console.log("stmt ============================");
    stmt_print(stmts);
*/

   let target_stmts = stmts;
   let filters = ["CreateStmt", "Trig"];

   if ( targets != "all") {
       filters = targets.split(':')
       target_stmts = stmt_filter(stmts, filters) 
   }

   switch(mode) {
          case "json":
                  console.log("json ============================");
                  print_json(target_stmts);
                  break
          case "walk":
                  console.log("walk ============================");
                  walk(target_stmts, 0);
                  break
          case "stmt":
                  console.log("stms ============================");
                  stmt_print(target_stmts);
                  break
          default:
                   console.log("unknown mode:",mode);
   }

  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

