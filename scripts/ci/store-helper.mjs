#!/usr/bin/env node
// Small helpers for scripts/ci/store-release.sh that are awkward in bash. No network.
//
//   node scripts/ci/store-helper.mjs extension-id   < base64 public key   -> 32-letter extension id
//   node scripts/ci/store-helper.mjs assertion      < service-account JSON -> signed JWT assertion
//
// extension-id: the id Chrome derives from a public key (manifest "key", or the "publicKey" that the
//   Chrome Web Store API fetchStatus returns): SHA-256 of the DER public key, first 16 bytes, each hex
//   digit 0-f mapped to a-p.
// assertion: the JWT bearer assertion for Google's OAuth token endpoint (RFC 7523), signed RS256 with
//   the service account's private key, scope chromewebstore, valid 10 minutes. The key is read from
//   stdin only (never from a file or an argument) and is never written anywhere. The caller masks the
//   assertion (it is a short-lived credential) and exchanges it for an access token.
//   On a bad key it prints a fixed message, never the input.
import { createHash, createSign } from "node:crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/chromewebstore";

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on("data", (c) => chunks.push(c));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

function fail(message) {
  process.stderr.write(`store-helper: ${message}\n`);
  process.exit(1);
}

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

export function extensionId(publicKeyBase64) {
  const der = Buffer.from(publicKeyBase64.replace(/\s+/g, ""), "base64");
  if (der.length < 64) throw new Error("public key too short");
  const hex = createHash("sha256").update(der).digest("hex").slice(0, 32);
  return [...hex].map((c) => String.fromCharCode("a".charCodeAt(0) + parseInt(c, 16))).join("");
}

export function assertion(serviceAccountJson, nowSeconds = Math.floor(Date.now() / 1000)) {
  let sa;
  try {
    sa = JSON.parse(serviceAccountJson);
  } catch {
    throw new Error("the service account key is not JSON");
  }
  if (sa.type !== "service_account" || typeof sa.client_email !== "string" || typeof sa.private_key !== "string") {
    throw new Error("the service account key lacks type=service_account, client_email or private_key");
  }
  const header = { alg: "RS256", typ: "JWT" };
  if (typeof sa.private_key_id === "string") header.kid = sa.private_key_id;
  const claims = { iss: sa.client_email, scope: SCOPE, aud: TOKEN_URL, iat: nowSeconds, exp: nowSeconds + 600 };
  const unsigned = `${b64url(JSON.stringify(header))}.${b64url(JSON.stringify(claims))}`;
  let signature;
  try {
    signature = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key);
  } catch {
    throw new Error("could not sign with the service account private key");
  }
  return `${unsigned}.${b64url(signature)}`;
}

const cmd = process.argv[2];
if (cmd === "extension-id") {
  const input = (await readStdin()).trim();
  try {
    process.stdout.write(`${extensionId(input)}\n`);
  } catch {
    fail("not a base64 DER public key");
  }
} else if (cmd === "assertion") {
  const input = await readStdin();
  try {
    process.stdout.write(assertion(input));
  } catch (e) {
    fail(e.message);
  }
} else {
  fail("usage: store-helper.mjs extension-id|assertion  (input on stdin)");
}
