/**
 *
 * @param textMessage
 * @param algorithm
 * @returns {Promise<ArrayBuffer>}
 * @constructor
 *
 * This is used for encrypting text messages as specified in the docs
 * https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
 *
 */
export const UDADigestMessage = async (textMessage, algorithm) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(textMessage);
  const hash = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hash));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}
