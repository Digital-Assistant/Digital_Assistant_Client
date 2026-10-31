// Lets `node --test` load the extension's TypeScript sources (Node strips the types itself):
// the sources import "./buildConfig" without an extension, Node needs "./buildConfig.ts".
import { register } from "node:module";

register("./ts-resolve-hook.mjs", import.meta.url);
