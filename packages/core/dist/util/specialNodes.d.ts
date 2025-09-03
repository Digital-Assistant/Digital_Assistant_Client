/**
 * Special nodes identifications for recording.
 * These will be used for identification of node elements during recording and will resolve the bugs for unwanted clicks.
 * @returns specialNodes
 */
export declare const specialNodes: {
    include: {
        tags: string[];
        classes: string[];
        attributes: string[];
    };
    exclude: {
        tags: string[];
        classes: string[];
        attributes: string[];
        ids: string[];
    };
    ignoreChildren: {
        tags: string[];
        classes: string[];
        attributes: string[];
    };
    ignoreClicksOnNodes: {
        tags: string[];
        classes: string[];
        attributes: string[];
        ids: string[];
    };
    ignoreDuringCompare: {
        tags: never[];
        classes: never[];
        attributes: string[];
        ids: never[];
    };
    personalNodeIgnoreAttributes: string[];
    textEditors: {
        tags: string[];
        classes: string[];
        attributes: never[];
    };
    dropDowns: {
        tags: string[];
        classes: string[];
        attributes: never[];
    };
    datePicker: {
        tags: string[];
        classes: string[];
        attributes: string[];
    };
    specialNodes: {
        tags: string[];
        classes: string[];
        attributes: never[];
    };
    preventDefault: {
        tags: string[];
        classes: never[];
        attributes: string[];
    };
    iconNodes: {
        tags: string[];
        classes: never[];
        attributes: never[];
    };
};
