export interface IJsDocTagInfo {
    name: string;
    text?: IJsDocTagInfo.IText[];
}
export declare namespace IJsDocTagInfo {
    interface IText {
        text: string;
        kind: string;
    }
}
