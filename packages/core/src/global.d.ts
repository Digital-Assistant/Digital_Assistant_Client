/**
 * Declares the 'domjson' module.
 * This is necessary because the 'domjson' library does not provide its own
 * TypeScript type definitions. By declaring it, we tell TypeScript to
 t * rust that this module exists and to type its contents as 'any'.
 */
declare module "domjson";

/**
 * Augments the global scope with custom variables.
 * This allows you to access these variables anywhere in your application
 * without causing TypeScript errors.
 */
declare global {
    var clickedNode: HTMLElement | null;
    var udanSelectedNodes: any;
    var udaSpecialNodes: any;
    var chrome: any;
    var UDAPluginSDK: any;
    interface Window {
        UDAClickObjects: any[];
        UDARemovedClickObjects: any[];
        UDAGlobalConfig: any;
        udaSpecialNodes: any;
        onDomChange: any;
        clickedNode: any;
        // udanSelectedNodes: any;
        // clickedNode: any;
    }
}

// This export statement ensures this file is treated as a module,
// which is required for `declare global` to work correctly.
export {};
