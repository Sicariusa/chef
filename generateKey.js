import { generateKeyPairSync, createPrivateKey, createPublicKey } from "crypto";
import fs from "fs";

// Generate RSA key pair
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048, // bits
});

// Export in PKCS#8 (private) and SPKI (public)
const privatePem = privateKey.export({
  type: "pkcs8",
  format: "pem",
});

const publicPem = publicKey.export({
  type: "spki",
  format: "pem",
});

// Save to files
fs.writeFileSync("private_key.pem", privatePem);
fs.writeFileSync("public_key.pem", publicPem);

console.log("✅ Keys generated successfully!");
console.log("Private key → private_key.pem");
console.log("Public key → public_key.pem");
