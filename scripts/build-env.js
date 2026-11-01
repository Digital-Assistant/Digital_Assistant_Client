/**
 * Build-time environment for the extension (public values only).
 *
 * One place for the rules, used by webpack.config.js and scripts/ci/*.sh:
 * - the schema (allowlist) is environments/env.example: only its keys are inlined;
 * - values come from environments/<build>.env (default local.env), or from the file
 *   named by UDAN_ENV_FILE;
 * - an environment variable with the same name as a key overrides the file (for CI).
 *
 * CLI (used by the CI scripts):
 *   node scripts/build-env.js <build> --file        prints the env file path
 *   node scripts/build-env.js <build> --schema      prints the schema keys, one per line
 *   node scripts/build-env.js <build> --non-empty   prints the names of keys with a value (JSON)
 *   node scripts/build-env.js <build> --hash        prints the config hash (8 hex, see configHash)
 * It never prints values.
 */
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SCHEMA_FILE = path.join(ROOT, "environments", "env.example");

function parseEnv(text) {
    const out = {};
    for (const raw of text.split(/\r?\n/)) {
        const line = raw.trim();
        if (!line || line.startsWith("#")) continue;
        const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(line);
        if (!m) continue;
        let value = m[2];
        if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/\\(["\\])/g, "$1");
        } else if (value.length >= 2 && value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
        }
        out[m[1]] = value;
    }
    return out;
}

function schemaKeys() {
    return Object.keys(parseEnv(fs.readFileSync(SCHEMA_FILE, "utf8")));
}

function envFilePath(build) {
    if (process.env.UDAN_ENV_FILE) return path.resolve(process.env.UDAN_ENV_FILE);
    const name = build || "local";
    if (!/^[A-Za-z0-9_-]+$/.test(name)) throw new Error(`invalid build name: ${name}`);
    return path.join(ROOT, "environments", `${name}.env`);
}

function loadBuildEnv(build) {
    const keys = schemaKeys();
    const file = envFilePath(build);
    const exists = fs.existsSync(file);
    const fromFile = exists ? parseEnv(fs.readFileSync(file, "utf8")) : {};
    const values = {};
    for (const key of keys) {
        const fromProcess = process.env[key];
        values[key] = fromProcess !== undefined ? fromProcess : (fromFile[key] ?? "");
    }
    const nonEmpty = keys.filter((k) => values[k] !== "");
    return { file, exists, keys, values, nonEmpty };
}

/** DefinePlugin definitions: exactly one `process.env.<key>` per schema key. */
function defineEntries(build) {
    const env = loadBuildEnv(build);
    const defs = {};
    for (const key of env.keys) defs[`process.env.${key}`] = JSON.stringify(env.values[key]);
    return { env, defs };
}

/**
 * Short fingerprint of the configuration a build inlines: sha256 over the sorted
 * `key=value` lines of the schema keys (what DefinePlugin gets, so env-var overrides count),
 * first 8 hex. Any changed value or newly set key changes it; the values stay private.
 */
function configHash(build) {
    const { keys, values } = loadBuildEnv(build);
    const text = [...keys].sort().map((k) => `${k}=${JSON.stringify(values[k])}\n`).join("");
    return crypto.createHash("sha256").update(text).digest("hex").slice(0, 8);
}

module.exports = { parseEnv, schemaKeys, envFilePath, loadBuildEnv, defineEntries, configHash };

if (require.main === module) {
    const [build, flag] = process.argv.slice(2);
    if (!build || !flag) {
        console.error("usage: node scripts/build-env.js <build> --file|--schema|--non-empty|--hash");
        process.exit(2);
    }
    if (flag === "--file") console.log(envFilePath(build));
    else if (flag === "--schema") console.log(schemaKeys().join("\n"));
    else if (flag === "--non-empty") console.log(JSON.stringify(loadBuildEnv(build).nonEmpty));
    else if (flag === "--hash") console.log(configHash(build));
    else {
        console.error(`unknown flag: ${flag}`);
        process.exit(2);
    }
}
