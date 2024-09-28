//import { parse, Statement } from 'pgsql-ast-parser';

// node.js
import pkg from 'pgsql-ast-parser';
const { parse, Statement } = pkg;


// parse multiple statements
const ast1 = parse(`BEGIN TRANSACTION;
                                insert into my_table values (1, 'two')`);




console.log(ast1);

