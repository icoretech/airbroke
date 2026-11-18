import type { ReactNode } from "react";

// A small build-time highlighter for the page's short snippets: comments,
// strings, numbers, keywords and Ruby symbols. It runs in server components
// only, so it adds nothing to the client bundle.

export type Lang = "ruby" | "js" | "python" | "toml" | "sh";

const KEYWORDS: Record<Lang, string[]> = {
  ruby: ["do", "end", "if", "def", "true", "false", "nil"],
  js: ["import", "from", "const", "new", "true", "false", "await", "export"],
  python: ["import", "from", "True", "False", "None"],
  toml: ["true", "false"],
  sh: ["helm", "docker", "install", "run"],
};

const COMMENT: Record<Lang, RegExp> = {
  ruby: /#[^\n]*/y,
  js: /\/\/[^\n]*/y,
  python: /#[^\n]*/y,
  toml: /#[^\n]*/y,
  sh: /#[^\n]*/y,
};

const STRING = /'[^'\n]*'|"[^"\n]*"/y;
const NUMBER = /\b\d+(?:\.\d+)?\b/y;
const SYMBOL = /:[a-z_]+\b/y;
const WORD = /[A-Za-z_][\w]*/y;
const TABLE = /^\[[^\]\n]+\]/my;

function at(re: RegExp, code: string, index: number): string | null {
  re.lastIndex = index;
  const match = re.exec(code);
  return match ? match[0] : null;
}

export function highlight(code: string, lang: Lang): ReactNode[] {
  const out: ReactNode[] = [];
  const keywords = new Set(KEYWORDS[lang]);
  let plain = "";
  let i = 0;
  const flush = () => {
    if (plain) out.push(plain);
    plain = "";
  };
  const push = (cls: string, text: string) => {
    flush();
    out.push(
      <span key={out.length} className={cls}>
        {text}
      </span>,
    );
    i += text.length;
  };

  while (i < code.length) {
    const startOfLine = i === 0 || code[i - 1] === "\n";
    const comment = at(COMMENT[lang], code, i);
    if (comment) {
      push("tok-c", comment);
      continue;
    }
    if (lang === "toml" && startOfLine) {
      const table = at(TABLE, code, i);
      if (table) {
        push("tok-k", table);
        continue;
      }
    }
    const string = at(STRING, code, i);
    if (string) {
      push("tok-s", string);
      continue;
    }
    if (lang === "ruby") {
      const symbol = at(SYMBOL, code, i);
      if (symbol && (i === 0 || !/[\w:]/.test(code[i - 1]))) {
        push("tok-p", symbol);
        continue;
      }
    }
    const word = at(WORD, code, i);
    if (word && (i === 0 || !/[\w.]/.test(code[i - 1]) || lang !== "sh")) {
      if (keywords.has(word)) {
        push("tok-k", word);
      } else {
        plain += word;
        i += word.length;
      }
      continue;
    }
    const number = at(NUMBER, code, i);
    if (number) {
      push("tok-n", number);
      continue;
    }
    plain += code[i];
    i += 1;
  }
  flush();
  return out;
}
