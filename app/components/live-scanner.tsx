"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Finding, ScanResponse, Severity } from "../vendor/vibeguard-core";
import styles from "./live-scanner.module.css";

/* The real VibeGuard engine, running in this tab. Nothing here is a
   recording: the textarea is editable, every keystroke is re-scanned by the
   same analyzer-core the extensions and the CLI ship, and no request leaves
   the page. The samples are files from the repository's samples/vulnerable
   directory. */

type Sample = { file: string; code: string };

const SAMPLES: readonly Sample[] = [
  {
    file: "auth_bypass.py",
    code: `DEBUG = False


def is_authorised(user):
    if DEBUG:
        return True  # AI-prone: debug bypass left in
    if user.token == "changeme":
        return True
    # TODO: add proper auth validation here
    return user.is_admin


def fetch(url):
    import requests
    return requests.get(url, verify=False)
`,
  },
  {
    file: "sql_injection.py",
    code: `import sqlite3


def get_user(conn, user_id):
    query = "SELECT * FROM users WHERE id = " + str(user_id)
    cur = conn.cursor()
    cur.execute(query)
    return cur.fetchone()


def delete_session(conn, sid):
    cur = conn.cursor()
    cur.execute("DELETE FROM sessions WHERE id = " + sid)
`,
  },
  {
    file: "xss.js",
    code: `function render(userInput) {
  const el = document.getElementById("out");
  el.innerHTML = userInput;
}

function evalUser(input) {
  return eval(input);
}

function token() {
  const sessionId = Math.random().toString(36).slice(2);
  return sessionId;
}
`,
  },
];

const SEVERITY_ORDER: readonly Severity[] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

type Engine = typeof import("../vendor/vibeguard-core");

export function LiveScanner() {
  const [engine, setEngine] = useState<Engine | null>(null);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [file, setFile] = useState(SAMPLES[0].file);
  const [code, setCode] = useState(SAMPLES[0].code);
  const [result, setResult] = useState<ScanResponse | null>(null);
  const [elapsed, setElapsed] = useState<number | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  // the engine is a lazy chunk: it is fetched once, after first paint
  useEffect(() => {
    let cancelled = false;
    import("../vendor/vibeguard-core").then((mod) => {
      if (!cancelled) setEngine(mod);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!engine) return;
    const id = window.setTimeout(() => {
      const started = performance.now();
      const response = engine.scan({
        targetType: "file",
        content: code,
        filePath: file,
        mode: "standard",
      });
      setElapsed(performance.now() - started);
      setResult(response);
    }, 120);
    return () => window.clearTimeout(id);
  }, [engine, code, file]);

  const lines = useMemo(() => code.split("\n"), [code]);
  const longest = useMemo(
    () => lines.reduce((n, line) => Math.max(n, line.length), 0),
    [lines],
  );

  const findings: Finding[] = useMemo(() => {
    if (!result) return [];
    return [...result.findings].sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity) ||
        (a.startLine ?? 0) - (b.startLine ?? 0),
    );
  }, [result]);

  // worst severity per line, for the gutter
  const lineSeverity = useMemo(() => {
    const map = new Map<number, Severity>();
    for (const f of findings) {
      if (!f.startLine) continue;
      const end = f.endLine ?? f.startLine;
      for (let n = f.startLine; n <= end; n += 1) {
        const current = map.get(n);
        if (
          !current ||
          SEVERITY_ORDER.indexOf(f.severity) < SEVERITY_ORDER.indexOf(current)
        ) {
          map.set(n, f.severity);
        }
      }
    }
    return map;
  }, [findings]);

  const selectSample = (index: number) => {
    setSampleIndex(index);
    setFile(SAMPLES[index].file);
    setCode(SAMPLES[index].code);
    setActiveLine(null);
  };

  const jumpTo = (line: number | undefined) => {
    if (!line) return;
    setActiveLine(line);
    const area = areaRef.current;
    if (!area) return;
    const offset = lines.slice(0, line - 1).join("\n").length + (line > 1 ? 1 : 0);
    area.focus({ preventScroll: true });
    area.setSelectionRange(offset, offset + (lines[line - 1]?.length ?? 0));
  };

  return (
    <section className={styles.scanner} aria-label="VibeGuard のライブ診断">
      <div className={styles.bar}>
        <div className={styles.tabs} role="tablist" aria-label="サンプル">
          {SAMPLES.map((sample, index) => (
            <button
              key={sample.file}
              type="button"
              role="tab"
              aria-selected={index === sampleIndex}
              className={index === sampleIndex ? styles.tabActive : styles.tab}
              onClick={() => selectSample(index)}
            >
              {sample.file}
            </button>
          ))}
        </div>
        <p className={styles.meter} aria-live="polite">
          {engine ? (
            <>
              <b>{result?.summary.total ?? 0}</b> 件
              {elapsed !== null && <> · {elapsed.toFixed(1)} ms</>} ·
              analyzer-core {engine.ENGINE_VERSION}
            </>
          ) : (
            "解析エンジンを読み込んでいます。"
          )}
        </p>
      </div>

      <div className={styles.body}>
        <div className={styles.editor}>
          <div className={styles.sheet}>
            <ol className={styles.gutter} aria-hidden="true">
              {lines.map((_, index) => {
                const n = index + 1;
                return (
                  <li
                    key={n}
                    data-severity={lineSeverity.get(n)}
                    data-active={activeLine === n || undefined}
                  >
                    {n}
                  </li>
                );
              })}
            </ol>
            <div className={styles.codeWrap}>
              <div className={styles.marks} aria-hidden="true">
                {lines.map((_, index) => {
                  const n = index + 1;
                  return (
                    <i
                      key={n}
                      data-severity={lineSeverity.get(n)}
                      data-active={activeLine === n || undefined}
                    />
                  );
                })}
              </div>
              <textarea
                ref={areaRef}
                className={styles.area}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setActiveLine(null);
                }}
                rows={lines.length}
                style={{ width: `${longest + 4}ch` }}
                wrap="off"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label={`${file} のコード。編集すると再診断します`}
              />
            </div>
          </div>
        </div>

        <ol className={styles.findings}>
          {findings.length === 0 && (
            <li className={styles.empty}>
              {engine ? "検出はありません。" : ""}
            </li>
          )}
          {findings.map((finding) => (
            <li key={finding.findingId}>
              <button
                type="button"
                className={styles.finding}
                data-severity={finding.severity}
                onClick={() => jumpTo(finding.startLine)}
              >
                <span className={styles.findingHead}>
                  <i aria-hidden="true" />
                  {finding.ruleId}
                  <em>{finding.severity}</em>
                  {finding.startLine && <u>L{finding.startLine}</u>}
                </span>
                <strong>{finding.title}</strong>
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
