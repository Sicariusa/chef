import { importSPKI, exportJWK } from "jose";
import fs from "fs";

const publicPem = fs.readFileSync("public.pem", "utf8");
const publicKey = await importSPKI(publicPem, "RS256");
const jwk = await exportJWK(publicKey);
jwk.use = "sig";
const jwks = { keys: [jwk] };

console.log(JSON.stringify(jwks, null, 2));

