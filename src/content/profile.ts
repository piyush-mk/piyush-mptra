// Single source of truth for everything on the site.
// Do not add a phone number or personal email here; contact goes through the links below.

export const person = {
  name: "Piyush Mohapatra",
  first: "Piyush",
  last: "Mohapatra",
  role: "Software Engineer",
  location: "Delhi NCR, India",
  statement: "I build software people rely on, from finance systems to classrooms.",
  email: "hello@piyush-mptra.com" as string | null, // Cloudflare Email Routing forwards this to Gmail
};

export const links = [
  { label: "GitHub", handle: "piyush-mk", href: "https://github.com/piyush-mk" },
  { label: "LinkedIn", handle: "mohapatra-piyush", href: "https://www.linkedin.com/in/mohapatra-piyush" },
  { label: "Kaggle", handle: "piyushmohapatra", href: "https://www.kaggle.com/piyushmohapatra" },
] as const;

export const portbot = {
  line: "An LLM agent that turns a plain-English request into a validated portfolio setup at BlackRock. The model proposes; code checks every value before anything is written.",
  metrics: [
    { value: "1,500+", label: "users" },
    { value: "99.2%", label: "uptime" },
    { value: "16,640", label: "hours saved a year" },
  ],
  steps: [
    { name: "Parse", body: "Schema-constrained tool calling pulls 23+ fields out of a free-form request." },
    { name: "Resolve", body: "Fixes typos in tickers and benchmarks, and asks instead of guessing: \"Dollar\", USD or AUD?" },
    { name: "Validate", body: "SQL lookups, allowed values and cross-field checks run before anything is written." },
    { name: "Audit", body: "Every change keeps who asked, the conversation and a field-level diff." },
  ],
  stack: ["Python", "FastAPI", "Pydantic v2", "React", "TypeScript", "SQL Server", "Pytest", "Azure Pipelines"],
};

// Second system for the "At work" section, next to PortBot
export const autowebqc = {
  line: "A service that keeps checking BlackRock's public websites against regulatory and reputational rules, and sends each finding, traced to its source, to the team that owns it.",
  metrics: [
    { value: "1,500+", label: "hours saved a year" },
  ],
};

// Experience points avoid repeating PortBot and AutoWebQC, which have their own section
export type Role = { org: string; title: string; years: string; points: string[] };

export const experience: Role[] = [
  {
    org: "BlackRock", title: "Software Development Engineer", years: "2025 – now",
    points: [
      "Built PortBot and AutoWebQC (see below).",
      "Designed a validation framework over 60,000+ portfolios that catches start-date and month-end anomalies before they reach analytics.",
      "Automated portfolio billing end to end, with approval routing and access-controlled handoffs. Removed 500+ manual hours a year.",
    ],
  },
  {
    org: "BlackRock", title: "Software Intern", years: "Jan – Jul 2025",
    points: [
      "Built Contract 360, which replaced Excel and macro reviews with generated exceptions, assignment tracking and audit trails. Saved 50+ hours a month.",
      "Automated daily portfolio data-quality checks in Python and SQL.",
    ],
  },
  {
    org: "Georgia Tech", title: "Research Assistant", years: "Summer 2024",
    points: [
      "Turned thousands of SEC filings into structured data and lifted a Transformer NER model's F1 by 5%.",
      "Built Label Studio annotation tooling with nested entity linking for model training.",
    ],
  },
  {
    org: "Ola", title: "Software Infrastructure Intern", years: "Summer 2023",
    points: ["Tuned SQL and Python pipelines over 1M+ ride and EV records that feed live dashboards. Saved 10+ hours a week of reporting."],
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  line: string;
  body: string[];
  stack: string[];
  links: { label: string; href: string }[];
  status?: string;
  shot?: "advaita" | "invoiceguard" | "agent" | "awaaz";
  illustration?: boolean; // true when the image is a drawn scene, not a screenshot
  featured: boolean;
};

export const projects: Project[] = [
  {
    slug: "advaita",
    name: "Advaita",
    kind: "Voice AI teacher",
    year: "2026",
    status: "Live · school pilot",
    shot: "advaita",
    featured: true,
    line: "A teacher you can talk to, and interrupt, in Hindi, English or Gujarati.",
    body: [
      "My younger cousins kept getting stuck on homework late at night with nobody to ask. Chatbots meant typing a question and reading a wall of text. They needed someone they could stop and say \"wait, go back\" to.",
      "Advaita teaches out loud at a live board. A student can cut in mid-sentence and it stops and re-explains, or snap a photo of a problem and get walked through it. Speech runs through Sarvam in both directions, and progress is tracked in code, not by the model.",
      "Built and run solo. In pilot with 10 Class 8 students at a school in Mumbai.",
    ],
    stack: ["Next.js", "Node.js", "Express", "Sarvam ASR/TTS"],
    links: [{ label: "advaitalearn.com", href: "https://advaitalearn.com" }],
  },
  {
    slug: "invoiceguard",
    name: "InvoiceGuard",
    kind: "Agent training environment",
    year: "2026",
    status: "Top 10 · Meta x PyTorch",
    shot: "invoiceguard",
    featured: true,
    line: "Agents learn to resolve invoice exceptions. Fine-tuning took the score from 0.14 to 0.73.",
    body: [
      "An OpenEnv environment where LLM agents work through invoices, purchase orders, goods receipts and policy rules to approve, hold, reject or escalate.",
      "22 tasks with deterministic graders, so every run is reproducible. SFT and GRPO runs on Qwen with LoRA are scored against the same suite.",
    ],
    stack: ["Python", "FastAPI", "OpenEnv", "Qwen", "SFT/GRPO"],
    links: [
      { label: "Live demo", href: "https://piyush-mk.github.io/InvoiceGuard/" },
      { label: "Source", href: "https://github.com/piyush-mk/InvoiceGuard" },
    ],
  },
  {
    slug: "agent-browser-layer",
    name: "Agent Browser Layer",
    kind: "Browser control for agents",
    shot: "agent",
    illustration: true,
    year: "2026",
    featured: true,
    line: "Lets an LLM agent read a live web page and click, type and navigate on it.",
    body: [
      "A layer over the Chrome DevTools Protocol that turns the DOM into a compact view a model can read and exposes browser actions as tools.",
      "Agents loop: read the page, act, re-read, re-plan. Targeting survives dynamically rendered pages, so multi-step tasks run on their own.",
    ],
    stack: ["TypeScript", "Playwright", "CDP"],
    links: [],
  },
  {
    slug: "awaaz",
    name: "Awaaz",
    kind: "Voice layer for Paytm POS",
    shot: "awaaz",
    illustration: true,
    year: "2026",
    status: "3rd · Paytm x Sarvam AI",
    featured: true,
    line: "Shopkeepers run billing and inventory by speaking, in their own language.",
    body: [
      "Speech recognition feeds an LLM tool-calling loop, so small merchants can run billing, inventory and customer tasks on a Paytm POS by voice.",
    ],
    stack: ["React", "Python", "ASR", "LLMs"],
    links: [{ label: "Source", href: "https://github.com/piyush-mk/Awaaz" }],
  },
  {
    slug: "finscope",
    name: "FinScope",
    kind: "SEC filings analysis",
    year: "2024",
    featured: true,
    line: "Pick a company and year; get an LLM read of its 10-K.",
    body: [
      "A pipeline that downloads, parses and indexes SEC 10-K filings, with LLM-written analysis on top so trends are readable without the raw filings.",
    ],
    stack: ["Python", "Scrapy", "Pandas", "Streamlit"],
    links: [
      { label: "finscope.streamlit.app", href: "https://finscope.streamlit.app" },
      { label: "Source", href: "https://github.com/piyush-mk/FinScope" },
    ],
  },
];

export const achievements = [
  { rank: "Top 10", event: "Meta x PyTorch OpenEnv Hackathon", date: "2026" },
  { rank: "3rd", event: "Paytm x Sarvam AI Hackathon", date: "2026" },
  { rank: "Top 10", event: "Pocket FM x Sarvam x OpenAI, Zero to One", date: "2026" },
  { rank: "Finalist", event: "Goldman Sachs India Quant Hackathon", date: "2024" },
  { rank: "Best Use of Data", event: "NASA Space Apps, Bengaluru", date: "2023" },
  { rank: "Winner", event: "HackNITR 4.0", date: "2023" },
];

export const stack = ["Python", "TypeScript", "Java", "SQL", "FastAPI", "Node.js", "React", "Next.js", "PyTorch", "Playwright", "Docker"];

export const education = {
  school: "Manipal Institute of Technology",
  degree: "B.Tech, Computer & Communication Engineering",
  years: "2021 – 2025",
};
