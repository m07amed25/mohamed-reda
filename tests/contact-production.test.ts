import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

test("the compiled contact function loads and handles requests", async () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const { config, error } = ts.readConfigFile(join(root, "tsconfig.json"), ts.sys.readFile);
  assert.equal(error, undefined);
  const { options, errors } = ts.convertCompilerOptionsFromJson(config.compilerOptions, root);
  assert.deepEqual(errors, []);

  // Vercel ships the emitted JavaScript files in the function bundle.
  const output = await mkdtemp(join(root, "node_modules", ".contact-test-"));
  try {
    for (const folder of ["api", "server"]) await mkdir(join(output, folder));
    await writeFile(join(output, "package.json"), '{"type":"module"}');
    for (const source of ["api/contact.ts", "server/contact.ts", "server/contact-mail.ts"]) {
      const fileName = join(root, source);
      const { outputText } = ts.transpileModule(await readFile(fileName, "utf8"), {
        fileName,
        compilerOptions: { module: ts.ModuleKind.ESNext, ...options },
      });
      await writeFile(join(output, source.replace(/\.ts$/, ".js")), outputText);
    }

    const { default: handler } = await import(pathToFileURL(join(output, "api/contact.js")).href);
    const response = await handler.fetch(new Request("https://portfolio.example/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    }));
    assert.equal(response.status, 400);
    assert.match((await response.json()).error, /check your contact details/i);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
