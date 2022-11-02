import ts from "typescript";
export declare namespace ValueFactory {
    const NULL: () => ts.NullLiteral;
    const UNDEFINED: () => ts.Identifier;
    const BOOLEAN: (value: boolean) => ts.TrueLiteral | ts.FalseLiteral;
    const INPUT: (str?: string) => ts.Identifier;
    const TYPEOF: (input: ts.Expression) => ts.TypeOfExpression;
}
