/* VibeGuard analyzer-core, browser entry, bundled into one ES module.

   Built from https://github.com/YUTAKONDO1205/VibeGuard (MIT) with:
     npx esbuild packages/analyzer-core/dist/browser.js \
       --bundle --format=esm --minify --platform=browser \
       --outfile=vibeguard-core.js

   This is the same engine the VS Code extension, the Chrome extension, the
   CLI and the GitHub Action run. It has no network or filesystem access: a
   string goes in, findings come out. */

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type Finding = {
  findingId: string;
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  confidence: string;
  category: string;
  startLine?: number;
  endLine?: number;
  snippet?: string;
};

export type ScanResponse = {
  summary: Record<Severity | "total", number>;
  findings: Finding[];
  executionTimeMs: number;
};

export function scan(request: {
  targetType: "file" | "snippet";
  content: string;
  filePath?: string;
  language?: string;
  mode: "fast" | "standard" | "deep";
}): ScanResponse;

export const ENGINE_VERSION: string;
