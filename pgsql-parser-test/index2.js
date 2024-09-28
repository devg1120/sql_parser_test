import { parse, deparse } from "pgsql-parser";

import * as util from "node:util";
import * as fs from "node:fs/promises";

let P = true;

function print(str) {
  if (P) {
    process.stdout.write(str);
  }
}

function print_json(stmts) {
  if (P) {
    process.stdout.write(JSON.stringify(stmts, null, 2));
  }
}

function create__(stmt) {
  //console.log("create:" , stmt)
  console.log("create:", stmt["relation"]["relname"]);
  if (stmt["tableElts"]) {
    for (const e of stmt["tableElts"]) {
      console.log(e);
      // if (e["ColumnDef"]);
    }
  }
}

function create(stmt) {
  console.log("create:", stmt);
  console.log("create:", stmt["relation"]["relname"]);
  for (const key in stmt) {
    switch (key) {
      case "relation":
        for (const key2 in stmt[key]) {
          // dict
          console.log(key, key2);
        }
        break;
      case "tableElts":
        for (const dict of stmt[key]) {
          //array
          for (let key2 in dict) {
            switch (key2) {
              case "ColumnDef":
                for (const key3 in dict[key2]) {
                  // dict
                  console.log(key, key2, key3);
                }

                break;
              default:
                console.log("not reco key:", key);
            }
          }
        }
        break;
      default:
        console.log("not reco key:", key);
    }
  }
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
          let colname = ele[i]["ColumnDef"]["colname"];
          let typeName_a = ele[i]["ColumnDef"]["typeName"]["names"];
          print(" [" + i + "]\n");
          print("   colname:" + colname + "\n");
          print("      type:");
          for (let i in typeName_a) {
            print(typeName_a[i]["String"]["str"] + ", ");
          }
          print("\n");
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
          let constraint = cmd["def"]["Constraint"];
          print(" contype:"+constraint["contype"]+"\n");
          print(" pktable:"+constraint["pktable"]["relname"]+"\n");
          print(" fk_attrs:"+constraint["fk_attrs"][0]["String"]["str"]+"\n");
          print(" pk_attrs:"+constraint["pk_attrs"][0]["String"]["str"]+"\n");
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

function stmt_print(array) {
  console.log("");
  for (let i in array) {
    for (let key in array[i]["RawStmt"]["stmt"]) {
      let stmt_d = array[i]["RawStmt"]["stmt"][key];
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
        default:
          console.log("*** Not *** ", key);
      }
      //for (let key2 in array[i]["RawStmt"]["stmt"][key]) {
      //    console.log("    ",key2);
      //    let ele = array[i]["RawStmt"]["stmt"][key][key2];
      //}
    }
  }
}

function stmt_print__(array) {
  for (let i in array) {
    console.log(array[i]["RawStmt"]["stmt"]);
  }
}
function walk(element, indent) {
  let base = "    ";
  let spc = base.repeat(indent);

  //console.log(typeof(element));
  if (typeof element == "object") {
    if (Array.isArray(element)) {
      console.log(spc, "*** Array ***");
      console.log(spc, "[");
      for (let key in element) {
        //console.log(spc,element[key]);
        walk(element[key], indent + 1);
      }
      console.log(spc, "]");
    } else {
      console.log(spc, "*** Dict ***");
      console.log(spc, "{");
      for (let key in element) {
        //console.log(spc,key,":",element[key]);
        console.log(spc, " ", key, ":");
        walk(element[key], indent + 1);
      }
      console.log(spc, "}");
    }
    //for (let key in element) {
    //  console.log(element[key]);
    //  walk(element[key]);
    //}
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

function stmt(stmt) {
  //console.log(stmt)
  if (stmt["CreateStmt"]) {
    create(stmt["CreateStmt"]);
  } else {
    console.log("stmt not case");
  }
}

const { positionals } = util.parseArgs({
  allowPositionals: true,
});

if (positionals.length != 1) {
  console.log("arg: filepath");
  process.exit(1);
}

const filePath = positionals[0];

fs.readFile(filePath, { encoding: "utf8" })
  .then((file) => {
    //console.log(file);
    const stmts = parse(file);

    console.log("\njson ============================");
    print_json(stmts);
    //console.log("walk ============================");
    //walk(stmts, 0);
    console.log("\nstmt ============================");
    stmt_print(stmts);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

//const stmts = parse('SELECT * FROM test_table');

//stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

//console.log(deparse(stmts));
