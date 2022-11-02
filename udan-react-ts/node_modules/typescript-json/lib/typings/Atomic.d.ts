export declare namespace Atomic {
    type Type = boolean | number | string | bigint;
    type Literal = "boolean" | "integer" | "number" | "string" | "bigint";
    type Mapper = {
        boolean: boolean;
        integer: number;
        number: number;
        string: string;
        bigint: bigint;
    };
}
