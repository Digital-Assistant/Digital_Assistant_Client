// Run: npm test   (node --test, Node 22.18+ strips the types; see scripts/test/register-ts.mjs)
import { test } from "node:test";
import assert from "node:assert/strict";
import {
    allowedEnvironment,
    chooseEnvironment,
    parseTierStamp,
    applyBuildConfig,
} from "../src/config/runtimeEnvironment.ts";
import { readTierStamp } from "../src/config/tierStamp.ts";

test("parseTierStamp: the two valid stamps", () => {
    assert.equal(parseTierStamp('{"tier":"TEST"}'), "TEST");
    assert.equal(parseTierStamp('{"tier":"PROD"}'), "PROD");
    assert.equal(parseTierStamp(' {"tier": "PROD"}\n'), "PROD");
});

test("parseTierStamp: invalid content is no stamp", () => {
    for (const bad of [
        undefined, null, 42, {}, "", "TEST", "not json", "null", "[]", '["TEST"]', "{}",
        '{"tier":"test"}', '{"tier":"Prod"}', '{"tier":""}', '{"tier":null}', '{"tier":1}', '{"tier":["TEST"]}',
        '{"tier":"STAGING"}', '{"Tier":"TEST"}', '{"tier":"TEST","extra":1}', '{"tier":"TEST"',
    ]) {
        assert.equal(parseTierStamp(bad), undefined, JSON.stringify(bad));
    }
});

test("chooseEnvironment without a stamp is unchanged", () => {
    assert.deepEqual(chooseEnvironment("development"), { environment: "TEST", source: "install-type" });
    assert.deepEqual(chooseEnvironment("normal"), { environment: "PROD", source: "install-type" });
    assert.deepEqual(chooseEnvironment("sideload"), { environment: "PROD", source: "install-type" });
    assert.deepEqual(chooseEnvironment(undefined), { environment: "PROD", source: "default" });
    assert.deepEqual(chooseEnvironment("normal", "TEST"), { environment: "TEST", source: "override" });
    assert.deepEqual(chooseEnvironment("development", "PROD"), { environment: "PROD", source: "override" });
    assert.deepEqual(chooseEnvironment("development", "nonsense"), { environment: "TEST", source: "install-type" });
});

test("a missing or invalid stamp resolves as before (parse, then choose)", () => {
    const stamp = parseTierStamp("garbage");
    assert.deepEqual(chooseEnvironment("normal", undefined, stamp), { environment: "PROD", source: "install-type" });
    assert.deepEqual(chooseEnvironment("development", undefined, stamp), { environment: "TEST", source: "install-type" });
    assert.deepEqual(chooseEnvironment(undefined, undefined, stamp), { environment: "PROD", source: "default" });
});

test("stamp TEST: store install is TEST; a PROD override is ignored", () => {
    assert.deepEqual(chooseEnvironment("normal", undefined, "TEST"), { environment: "TEST", source: "stamp" });
    assert.deepEqual(chooseEnvironment(undefined, undefined, "TEST"), { environment: "TEST", source: "stamp" });
    assert.deepEqual(chooseEnvironment("normal", "PROD", "TEST"), { environment: "TEST", source: "stamp" });
    assert.deepEqual(chooseEnvironment("development", "prod", "TEST"), { environment: "TEST", source: "stamp" });
    assert.deepEqual(chooseEnvironment("normal", "TEST", "TEST"), { environment: "TEST", source: "override" });
});

test("stamp PROD: PROD by default; an override to TEST is accepted as today", () => {
    assert.deepEqual(chooseEnvironment("normal", undefined, "PROD"), { environment: "PROD", source: "stamp" });
    assert.deepEqual(chooseEnvironment("normal", "PROD", "PROD"), { environment: "PROD", source: "override" });
    assert.deepEqual(chooseEnvironment("normal", "TEST", "PROD"), { environment: "TEST", source: "override" });
});

test("stamp PROD beats the development install type (the stamped zip declares its tier)", () => {
    assert.deepEqual(chooseEnvironment("development", undefined, "PROD"), { environment: "PROD", source: "stamp" });
});

test("allowedEnvironment: a TEST stamp refuses PROD only", () => {
    assert.equal(allowedEnvironment("PROD", "TEST"), undefined);
    assert.equal(allowedEnvironment("prod", "TEST"), undefined);
    assert.equal(allowedEnvironment("TEST", "TEST"), "TEST");
    assert.equal(allowedEnvironment("PROD", "PROD"), "PROD");
    assert.equal(allowedEnvironment("PROD", undefined), "PROD");
    assert.equal(allowedEnvironment("x", undefined), undefined);
    assert.equal(allowedEnvironment(undefined, "TEST"), undefined);
});

test("readTierStamp: reads through getURL, any failure is no stamp", async () => {
    const urls: string[] = [];
    const getURL = (path: string) => `chrome-extension://id/${path}`;
    const ok = (text: string) => ({ getURL, fetchText: async (url: string) => (urls.push(url), text) });
    assert.equal(await readTierStamp(ok('{"tier":"TEST"}')), "TEST");
    assert.deepEqual(urls, ["chrome-extension://id/tier.json"]);
    assert.equal(await readTierStamp(ok('{"tier":"PROD"}')), "PROD");
    assert.equal(await readTierStamp(ok("<html>404</html>")), undefined);
    assert.equal(await readTierStamp({ getURL, fetchText: async () => { throw new Error("net::ERR_FILE_NOT_FOUND"); } }), undefined);
    assert.equal(await readTierStamp({ getURL: () => { throw new Error("no runtime"); }, fetchText: async () => "{}" }), undefined);
});

test("applyBuildConfig still gives the chosen environment's URLs", () => {
    const config = {
        PROD: { apiBaseUrl: "p-api", tokenUrl: "p-tok", llmUrl: "p-llm", keycloakUrl: "p-kc" },
        TEST: { apiBaseUrl: "t-api", tokenUrl: "t-tok", llmUrl: "t-llm", keycloakUrl: "t-kc" },
        keycloakRealm: "realm", keycloakClientId: "cid", keycloakPublicClientId: "", keycloakIdpHint: "",
    };
    const choice = chooseEnvironment("normal", "PROD", "TEST");
    let seen: Record<string, string> = {};
    applyBuildConfig((c) => { seen = c; }, choice.environment, { config });
    assert.equal(seen.environment, "TEST");
    assert.equal(seen.apiBaseUrl, "t-api");
});
