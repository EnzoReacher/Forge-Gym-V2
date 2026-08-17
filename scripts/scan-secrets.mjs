import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const forbiddenNames = [/^\.env(?:\.|$)/, /\.pem$/i, /\.p12$/i, /id_rsa$/];
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /(?:sk|rk)-[A-Za-z0-9_-]{24,}/,
  /gh[pousr]_[A-Za-z0-9]{30,}/,
  /AKIA[0-9A-Z]{16}/,
];
for (const file of files) {
  if (file === ".env.example") continue;
  if (forbiddenNames.some((p) => p.test(file))) throw new Error(`Forbidden tracked secret-like file: ${file}`);
  let text; try { text = readFileSync(file, "utf8"); } catch { continue; }
  for (const pattern of patterns) if (pattern.test(text)) throw new Error(`Potential credential pattern in tracked file: ${file}`);
}
console.log("Tracked-source secret scan passed.");
