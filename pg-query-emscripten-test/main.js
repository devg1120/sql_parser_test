import Module from "pg-query-emscripten";

let pgQuery;

(async () => {
  pgQuery = await new Module();

  console.log(pgQuery.parse("select 1"));
})();

