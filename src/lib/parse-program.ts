/**
 * Texto livre do programa de uma cadeira (Fénix) → lista ordenada de tópicos.
 * Suporta: uma linha por tópico, listas numeradas (1., 1.1, I., a)), bullets,
 * ou um único parágrafo com frases.
 */

const NUM_PREFIX = /^\s*(?:(\d+(?:\.\d+)*)[.)]?|[IVXLC]+[.)]|[a-z][.)]|[-–•*·])\s+/;

export function parseProgram(raw: string, maxTitle = 160): string[] {
  const text = decodeEntities(raw).replace(/<[^>]+>/g, "\n").replace(/\r/g, "");
  let lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // Parágrafo único (ou quase): partir por numeração inline ou por frases
  if (lines.length <= 2) {
    const joined = lines.join(" ");
    const numbered = joined.split(/\s+(?=\d+\.\s+[A-ZÀ-Ý])/);
    lines =
      numbered.length >= 3
        ? numbered
        : joined.split(/(?<=[.;])\s+(?=[A-ZÀ-Ý])/).filter((s) => s.length > 3);
  }

  const topics: string[] = [];
  for (const line of lines) {
    const m = line.match(NUM_PREFIX);
    const num = m?.[1];
    const title = clean(line.replace(NUM_PREFIX, ""));
    if (title.length < 3) continue;
    // sub-tópico numerado (1.1, 2.3.1) agrega no tópico-pai
    if (num && num.includes(".") && topics.length > 0) {
      const prev = topics[topics.length - 1];
      topics[topics.length - 1] = prev.endsWith(":") ? `${prev} ${title}` : `${prev}; ${title}`;
      continue;
    }
    topics.push(title);
  }
  return topics.map((t) => truncate(t.replace(/:$/, ""), maxTitle));
}

function clean(s: string) {
  return s.replace(/\s+/g, " ").replace(/[\s.;,]+$/, "").trim();
}

function truncate(s: string, n: number) {
  return s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…";
}

function decodeEntities(s: string) {
  const map: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', nbsp: " ", apos: "'" };
  const marks: Record<string, string> = { acute: "\u0301", grave: "\u0300", tilde: "\u0303", circ: "\u0302", uml: "\u0308", cedil: "\u0327" };
  return s
    .replace(/&([A-Za-z])(acute|grave|tilde|circ|uml|cedil);/g, (_, l, k) => (l + marks[k]).normalize("NFC"))
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    .replace(/&([a-z]+);/gi, (m, n) => map[n.toLowerCase()] ?? m);
}

/**
 * Acrónimo legível a partir do do Fénix:
 * "IAED23610" → "IAED", "ESof23610-" → "ESof", "CDI18" + "Cálculo … I" → "CDI-I",
 * "PEstatisticad103610" + "Probabilidade e Estatística" → "PE".
 */
export function cleanAcronym(a: string, name = "") {
  let base = a.replace(/[-\d]+$/, "") || a;
  if (base.length > 6 && name) {
    base = name
      .split(/\s+/)
      .filter((w) => /^[A-ZÀ-Ý]/.test(w))
      .map((w) => w[0])
      .join("");
  }
  const roman = name.match(/\s(I{1,3}|IV|V)$/)?.[1];
  return roman ? `${base}-${roman}` : base;
}
