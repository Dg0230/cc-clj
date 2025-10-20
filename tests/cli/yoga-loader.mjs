import { fileURLToPath } from 'node:url';

export async function load(url, context, defaultLoad) {
  const result = await defaultLoad(url, context, defaultLoad);
  if (url.endsWith('/cli-origin.js')) {
    const sourceText = result.source.toString();
    const target = 'tN1 = await FqA(await FD9(VD9(import.meta.url).resolve("./yoga.wasm")))';
    const replacement = 'tN1 = globalThis.__CLAUDE_YOGA_STUB__ ?? await FqA(await FD9(VD9(import.meta.url).resolve("./yoga.wasm")))';
    const replaced = sourceText.includes(replacement)
      ? sourceText
      : sourceText.replace(target, replacement);
    return { ...result, source: replaced };
  }
  return result;
}
