/**
 * FigmaMake — Title Generator (Rules + Logic)
 * - Impersonal (no "I/my/we")
 * - Max 6 words
 * - Title Case with small words lowercase (for/with/and/of/in/to/a/the…)
 * - Modes: Technical, Realism, Soft Satire, Conceptual, Future-2033, Plausible-But-Odd
 * - Weighted phrase clusters + boring-title filter + “interesting token” bias
 */

type Mode = "technical" | "realism" | "satire" | "conceptual" | "future2033" | "odd";

type Options = {
  seed?: number;
  count?: number;
  aiRatio?: number; // 0..1 probability to ensure an AI-ish token
  modeWeights?: Partial<Record<Mode, number>>;
  allowDuplicates?: boolean;
};

const DEFAULTS: Required<Options> = {
  seed: Date.now(),
  count: 1,
  aiRatio: 0.45,
  modeWeights: {},
  allowDuplicates: false,
};

// ---------- Deterministic RNG ----------
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function rng() {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickWeighted<T>(items: Array<[T, number]>, rng: () => number): T {
  const total = items.reduce((s, [, w]) => s + w, 0);
  let roll = rng() * total;
  for (const [item, w] of items) {
    roll -= w;
    if (roll <= 0) return item;
  }
  return items[items.length - 1][0];
}

// ---------- Title Case (smart) ----------
const SMALL_WORDS = new Set([
  "a","an","the","and","or","but","for","nor","as","at","by","from","in","into","of","on","onto","over","to","up","with","via"
]);
const ACRONYMS = new Set(["AI","LLM","GPT","UX","UI","API"]);

function smartTitleCase(input: string): string {
  const words = input.trim().replace(/\s+/g, " ").split(" ");
  return words
    .map((w, idx) => {
      const lead = w.match(/^[“"‘'(\[]+/)?.[0] ?? "";
      const tail = w.match(/[”"’')\].,:;!?]+$/)?.[0] ?? "";
      const core = w.slice(lead.length, w.length - tail.length);

      const upper = core.toUpperCase();
      if (ACRONYMS.has(upper)) return `${lead}${upper}${tail}`;

      const lower = core.toLowerCase();
      const first = idx === 0;
      const last = idx === words.length - 1;

      // Handle Human–AI / Human-AI compounds
      if (core.includes("–") || core.includes("-")) {
        const parts = core.split(/([–-])/);
        const cased = parts
          .map(p => {
            if (p === "–" || p === "-") return p;
            const up = p.toUpperCase();
            if (ACRONYMS.has(up)) return up;
            const lo = p.toLowerCase();
            return lo ? lo[0].toUpperCase() + lo.slice(1) : lo;
          })
          .join("");
        // Apply small-words rule to whole compound is messy; keep compound cased as-is
        return `${lead}${cased}${tail}`;
      }

      if (!first && !last && SMALL_WORDS.has(lower)) return `${lead}${lower}${tail}`;
      return `${lead}${lower ? lower[0].toUpperCase() + lower.slice(1) : core}${tail}`;
    })
    .join(" ");
}

function wc(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

// ---------- Guardrails ----------
const FIRST_PERSON = /\b(i|i'm|im|i’ve|i've|me|my|mine|we|our|us)\b/i;
const CRINGE = /\b(synergy|rockstar|ninja|guru|unicorn)\b/i;

const boringTitles = new Set([
  "AI Product Designer",
  "Product Designer",
  "UX Designer",
  "AI Strategist",
  "Product Design Lead",
  "AI Consultant",
]);

const interestingTokens = [
  "Human–AI",
  "Generative",
  "Synthetic",
  "Autonomous",
  "Model",
  "Prompt",
  "Workflow",
  "Systems",
  "Hybrid",
  "Governance",
];

function hasInterestingToken(s: string): boolean {
  return interestingTokens.some(t => s.includes(t));
}

function enforceMaxWords(s: string, maxWords = 6): string | null {
  let out = s.trim().replace(/\s+/g, " ");

  // Compress common phrases
  out = out
    .replace(/\bHuman\s*-\s*AI\b/gi, "Human–AI")
    .replace(/\bHuman\s+and\s+AI\b/gi, "Human–AI");

  if (wc(out) <= maxWords) return out;

  // Drop leading AI-ish prefix if needed
  out = out.replace(/^(Generative AI|Applied AI|AI-Powered|AI|LLM|Prompt)\s+/i, "");
  if (wc(out) <= maxWords) return out;

  // Drop trailing "for X"
  out = out.replace(/\s+for\s+.+$/i, "");
  if (wc(out) <= maxWords) return out;

  return null;
}

// ---------- Vocabulary (curated) ----------
const roles = [
  "Designer","Product Designer","UX Designer","Interaction Designer","Visual Designer","Interface Designer",
  "Design Strategist","Product Strategist","Brand Strategist","Experience Strategist",
  "UX Researcher","Design Researcher","Model Behavior Researcher",
  "Architect","Systems Architect","Interaction Architect",
  "Creative Technologist","Design Technologist","AI Technologist",
  "Consultant","AI Consultant",
  "Design Systems Lead","Product Lead","AI Product Lead",
  "Automation Designer","AI Experience Designer","Human–AI Workflow Designer",
  "AI Interaction Architect","AI Governance Designer","Synthetic Media Strategist",
];

const phraseClusters = [
  "AI Product Designer",
  "Human–AI Workflow Designer",
  "AI Interaction Architect",
  "Design Systems Lead",
  "Creative Technologist",
  "Model Behavior Researcher",
  "Automation Experience Designer",
  "Synthetic Media Strategist",
  "Hybrid Workflow Strategist",
  "AI Governance Design Lead",
];

const areas = ["UX","Product","Brand","Visual","Interface","Design Systems","Content"];
const aiTerms = ["AI","Generative AI","LLM","Prompt"];
const contexts = ["Intelligent Systems","Hybrid Workflows","Adaptive Interfaces","Generative Tools","Synthetic Interfaces","AI-Native Products"];
const constraints = ["Uncertainty","Consistency","Trust","Latency","Edge Cases","Bias"];
const techNouns = ["Feedback Loops","Model Behavior","Prompt Drift","Evaluation","Inference"];
const satireThings = ["Robot Expectations","Robot Manners","Model Moods","Prompt Chaos","Synthetic Confidence"];
const humanAiThings = ["Human–AI Conversations","Human–AI Misunderstandings","Human–Machine Arguments"];
const concepts = ["Meaning","Ambiguity","Intuition","Ethics","Attention","Taste","Culture","Judgment"];
const oddConcepts = ["Machine Personality","Synthetic Taste","Algorithmic Culture","Digital Mood","Model Intuition","Prompt Memory","Machine Habits"];

// ---------- Mode templates ----------
type Template = (rng: () => number) => string;

const templates: Record<Mode, Array<[Template, number]>> = {
  technical: [
    [(r) => `${pick(roles, r)} Optimizing for ${pick(constraints, r)}`, 2.2],
    [(r) => `${pick(roles, r)} Managing ${pick(techNouns, r)}`, 2.0],
    [(r) => `${pick(["Systems","Interface","Product","UX"], r)} ${pick(["Architect","Designer","Lead"], r)} for ${pick(["Scale","Reliability","Evaluation"], r)}`, 1.2],
  ],
  realism: [
    [(r) => `${pick(aiTerms, r)} ${pick(areas, r)} ${pick(["Designer","Strategist","Researcher","Lead"], r)}`, 2.2],
    [(r) => `${pick(areas, r)} ${pick(["Designer","Strategist","Researcher","Lead"], r)} for ${pick(contexts, r)}`, 1.8],
    [(r) => `${pick(phraseClusters, r)}`, 1.4],
  ],
  satire: [
    [(r) => `${pick(roles, r)} Managing ${pick(satireThings, r)}`, 2.2],
    [(r) => `${pick(roles, r)} Moderating ${pick(humanAiThings, r)}`, 1.8],
    [(r) => `${pick(["Design Systems","UX","Product","Brand"], r)} ${pick(["Lead","Designer","Strategist"], r)} Keeping Robots Polite`, 1.2],
  ],
  conceptual: [
    [(r) => `${pick(roles, r)} Exploring ${pick(concepts, r)}`, 2.2],
    [(r) => `${pick(roles, r)} Translating Chaos Into Clarity`, 1.6],
    [(r) => `${pick(["Visual","Experience","Interface","Brand"], r)} ${pick(["Designer","Architect","Strategist"], r)} Shaping ${pick(concepts, r)}`, 1.0],
  ],
  future2033: [
    [(r) => `Human–AI Workflow Designer`, 1.2],
    [(r) => `AI Governance Design Lead`, 1.1],
    [(r) => `Autonomous Workflow Architect`, 1.0],
    [(r) => `Synthetic Interface Product Lead`, 0.9],
    [(r) => `AI Operations Design Lead`, 0.9],
    [(r) => `${pick(["AI","Hybrid","Synthetic","Autonomous"], r)} ${pick(["Workflow","Interface","Systems","Media"], r)} ${pick(["Designer","Strategist","Architect","Lead"], r)}`, 1.6],
  ],
  odd: [
    [(r) => `${pick(roles, r)} Studying ${pick(oddConcepts, r)}`, 2.0],
    [(r) => `${pick(roles, r)} for ${pick(oddConcepts, r)}`, 1.2],
    [(r) => `${pick(roles, r)} Measuring ${pick(["Digital Mood","Synthetic Taste","Model Intuition"], r)}`, 1.2],
  ],
};

// ---------- Mode weights ----------
const BASE_WEIGHTS: Record<Mode, number> = {
  realism: 0.40,
  satire: 0.25,
  technical: 0.15,
  conceptual: 0.10,
  future2033: 0.15,
  odd: 0.05,
};

// ---------- Generator ----------
function generateOne(seed: number, opts: Options): string {
  const rng = mulberry32(seed);
  const weights: Record<Mode, number> = { ...BASE_WEIGHTS, ...(opts.modeWeights ?? {}) };

  const mode = pickWeighted<Mode>(
    [
      ["technical", weights.technical],
      ["realism", weights.realism],
      ["satire", weights.satire],
      ["conceptual", weights.conceptual],
      ["future2033", weights.future2033],
      ["odd", weights.odd],
    ],
    rng
  );

  // Retry loop to satisfy constraints
  for (let attempt = 0; attempt < 40; attempt++) {
    const tpl = pickWeighted(templates[mode], rng);
    let raw = tpl(rng);

    // Impersonal + no cringe
    if (FIRST_PERSON.test(raw) || CRINGE.test(raw)) continue;

    // AI ratio bias (avoid forcing on satire/odd too much)
    if (rng() < (opts.aiRatio ?? DEFAULTS.aiRatio) && !/\b(AI|LLM|GPT|Generative|Prompt)\b/i.test(raw)) {
      if (mode === "realism" || mode === "technical" || mode === "future2033") {
        raw = `${pick(["AI","Generative AI","LLM"], rng)} ${raw}`;
      }
    }

    // Boring title filter: allow only ~20%
    const maybeCased = smartTitleCase(raw);
    if (boringTitles.has(maybeCased) && rng() < 0.8) continue;

    // Interesting token bias: if none, reroll ~70%
    if (!hasInterestingToken(maybeCased) && rng() < 0.7) continue;

    // Enforce max words
    const capped = enforceMaxWords(maybeCased, 6);
    if (!capped) continue;

    const final = smartTitleCase(capped);

    if (wc(final) > 6) continue;
    if (FIRST_PERSON.test(final)) continue;

    return final;
  }

  // Fallback
  return "AI Product Designer";
}

export function generateTitles(options: Options = {}): string[] {
  const o = { ...DEFAULTS, ...options };
  const out: string[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < o.count; i++) {
    const title = generateOne((o.seed + i) >>> 0, o);
    if (!o.allowDuplicates) {
      if (seen.has(title)) {
        // quick extra attempt
        const alt = generateOne((o.seed + i + 999) >>> 0, o);
        if (!seen.has(alt)) {
          seen.add(alt);
          out.push(alt);
          continue;
        }
      }
      seen.add(title);
    }
    out.push(title);
  }

  return out;
}

// ---- Example usage (FigmaMake):
// const titles = generateTitles({ count: 20, seed: 123 });
// figma.notify(titles.join("\n"));
// Or render them in a text node, list, etc.