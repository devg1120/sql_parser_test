@lexer lexerAny
@include "base.ne"


#alterfunction_statement -> kw_alter kw_function qualified_name lparen data_type_list rparen  (
#         alterfunction_enum_owner
#        ) {% x => track(x, {
#            name: x[2],
#            ...unwrap(x[3]),
#        }) %}


array_of[EXP] -> $EXP (%comma $EXP {% last %}):* {% ([head, tail]) => {
    return [unwrap(head), ...(tail.map(unwrap) || [])];
} %}

alterfunction_statement -> kw_alter kw_function qualified_name 
       (lparen array_of[func_argdef]:? rparen {% get(1) %})
        (
         alterfunction_enum_owner
        ) {% x => track(x, {
            name: x[2],
            ...unwrap(x[3]),
        }) %}


#func_argdef -> func_argopts:?
#                    data_type
#                    func_argdefault:?
#                    {% x => track(x, {
#                        default: x[2],
#                        type: x[1],
#                        ...x[0],
#                    }) %}
#
#
#func_argdefault -> %kw_default expr {%
#                     x => x[1]
#                   %}
#                   | %op_eq expr {% x => x[1] %}
#
#func_argopts -> func_argmod:? word {% x => track(x, {
#                        mode: toStr(x[0]),
#                        ...x[1] && { name: asName(x[1]) },
#                    }) %}
#                | word {% (x, rej) => {
#                    const name = asName(x);
#                    if (name === 'out' || name === 'inout' || name === 'variadic') {
#                        return rej; // avoid ambiguous syntax
#                    }
#                    return track(x, {name});
#                } %}
#
#func_argmod -> %kw_in | kw_out | kw_inout | kw_variadic


# ==== OWNER ENUM    append
alterfunction_enum_owner -> kw_owner %kw_to word {% x => track(x, {
    type: 'alter enum',
    change: {
      type: 'owner',
      to: asName(last(x))
    }
}) %}

