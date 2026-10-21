import { readFileSync } from "node:fs";

const files = process.argv.slice(2);
if (files.length !== 2)
  throw new Error("Expected exactly two platform candidates");
const architectures = ["amd64", "arm64"];
const digests = files.map((file, index) => {
  const candidate = JSON.parse(readFileSync(file, "utf8"));
  if (
    candidate === null ||
    typeof candidate !== "object" ||
    Array.isArray(candidate)
  )
    throw new Error("Candidate must be a JSON object");
  const { manifest, image } = candidate;
  if (image?.os !== "linux" || image.architecture !== architectures[index])
    throw new Error("Candidate platform does not match the native build");
  const labels = image.config?.Labels;
  if (
    !process.env.EXPECTED_SHA ||
    labels?.["org.opencontainers.image.revision"] !== process.env.EXPECTED_SHA
  )
    throw new Error("Candidate revision does not match the release commit");
  if (
    !process.env.VERSION ||
    labels?.["org.opencontainers.image.version"] !== process.env.VERSION
  )
    throw new Error("Candidate version does not match the release");
  if (!/^sha256:[a-f0-9]{64}$/.test(manifest?.digest ?? ""))
    throw new Error("Candidate manifest digest is invalid");
  return manifest.digest;
});
if (digests[0] === digests[1])
  throw new Error("Platform candidates must have distinct digests");
process.stdout.write(`${digests.join("\n")}\n`);
