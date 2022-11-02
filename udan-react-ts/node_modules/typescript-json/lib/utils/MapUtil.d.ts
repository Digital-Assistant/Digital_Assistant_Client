export declare namespace MapUtil {
    function take<Key, T>(dict: Map<Key, T>, key: Key, generator: () => T): T;
}
