// Resolve hook: a relative import without extension that exists as .ts resolves to the .ts file.
export async function resolve(specifier, context, nextResolve) {
    if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
        try {
            return await nextResolve(`${specifier}.ts`, context);
        } catch {
            // fall through to the default resolution
        }
    }
    return nextResolve(specifier, context);
}
