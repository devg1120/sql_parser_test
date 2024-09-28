import { parse, deparse } from 'pgsql-parser';

const stmts = parse('SELECT * FROM test_table');

// Assuming the structure of stmts is known and matches the expected type
stmts[0].RawStmt.stmt.SelectStmt.fromClause[0].RangeVar.relname = 'another_table';

console.log(deparse(stmts));

