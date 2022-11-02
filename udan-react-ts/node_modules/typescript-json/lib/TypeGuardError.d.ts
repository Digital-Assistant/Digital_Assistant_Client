export declare class TypeGuardError extends Error {
    readonly method: string;
    readonly path: string | undefined;
    readonly expected: string;
    readonly value: any;
    constructor(props: TypeGuardError.IProps);
}
export declare namespace TypeGuardError {
    interface IProps {
        method: string;
        path?: string;
        expected: string;
        value: any;
        message?: string;
    }
}
