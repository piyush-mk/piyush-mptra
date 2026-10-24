// Single source of truth for everything on the site.
// Do not add a phone number or personal email here; contact goes through the links below.

export const person = {
  name: "Piyush Mohapatra",
  first: "Piyush",
  last: "Mohapatra",
  role: "Software Engineer",
  location: "Delhi NCR, India",
  statement:
    "I build LLM agents that run in production, voice AI you can interrupt mid-sentence, and the data systems underneath them.",
  now: "Software Development Engineer at BlackRock",
  email: null as string | null, // reserved for hello@piyush-mptra.com once mail is set up
};

export const links = [
  { label: "GitHub", handle: "piyush-mk", href: "https://github.com/piyush-mk" },
  { label: "LinkedIn", handle: "mohapatra-piyush", href: "https://www.linkedin.com/in/mohapatra-piyush" },
  { label: "Kaggle", handle: "piyushmohapatra", href: "https://www.kaggle.com/piyushmohapatra" },
  { label: "LeetCode", handle: "piyush_moha", href: "https://leetcode.com/u/piyush_moha/" },
] as const;

export const portbot = {
  metrics: [
    { value: "1,500+", label: "users in production" },
    { value: "200+", label: "average concurrent sessions" },
    { value: "99.2%", label: "uptime" },
    { value: "16,640", label: "hours saved a year, about 8 FTE" },
  ],
  steps: [
    { name: "Parse", body: "Schema-constrained tool calling with Pydantic v2 pulls 23+ portfolio attributes out of a free-form request." },
    { name: "Resolve", body: "Edit-distance matching fixes misspelled benchmarks and tickers. Ambiguous input gets a question, not a guess: \"Dollar\", USD or AUD?" },
    { name: "Fill", body: "42 defaulting rules, static and conditional, complete whatever the user left out." },
    { name: "Validate", body: "Regex checks, allowed-value lists, SQL lookups across three enterprise databases and cross-field consistency, all before anything is written." },
    { name: "Submit", body: "Builds the request payload and submits it through the Portfolio Master API, then schedules follow-up work over an internal HTTP bridge." },
    { name: "Audit", body: "Every change keeps who asked, the full conversation and field-level diffs, exported daily." },
  ],
  stack: ["Python", "FastAPI", "Pydantic v2", "React 19", "TypeScript", "Vite", "SQL Server", "Pytest", "Azure Pipelines", "SonarQube", "uv"],
};

export type Role = {
  org: string;
  title: string;
  start: string;
  end: string;
  years: string;
  summary: string;
  points: string[];
};

export const experience: Role[] = [
  {
    org: "BlackRock",
    title: "Software Development Engineer",
    start: "Jul 2025",
    end: "Present",
    years: "2025 –",
    summary: "Agents, validation platforms and workflow automation for portfolio operations.",
    points: [
      "Built and own PortBot, an LLM agent that turns free-form portfolio requests into validated workflows. In production for 1,500+ users at 99.2% uptime, saving about 16,640 hours a year.",
      "Built AutoWebQC, a continuously running service that checks BlackRock's public web estate against regulatory and reputational rules and routes each finding, traced to its source, to engineering and compliance. Saves 1,500+ hours a year.",
      "Designed a validation framework over 60,000+ portfolios that catches start-date, attribute and month-end sign-off anomalies before they reach downstream analytics.",
      "Automated portfolio billing end to end, from request validation and approval routing to billing-code generation, with access-controlled handoffs. Removed 500+ manual hours a year.",
    ],
  },
  {
    org: "BlackRock",
    title: "Software Intern",
    start: "Jan 2025",
    end: "Jul 2025",
    years: "2025",
    summary: "Exception management and data-quality automation.",
    points: [
      "Built Contract 360, an exception-management platform that replaced Excel and macro reviews with generated exceptions, assignment tracking, live metrics and audit trails, keeping a human reviewer on every exception. Saved 50+ hours a month.",
      "Automated daily portfolio start-date and data-quality checks in Python, SQL and REST APIs, with provenance kept on every check.",
    ],
  },
  {
    org: "Georgia Tech, FSIL",
    title: "Research Assistant",
    start: "May 2024",
    end: "Jul 2024",
    years: "2024",
    summary: "Turning SEC filings into structured, searchable data.",
    points: [
      "Built pipelines that turn thousands of unstructured SEC filings into structured data, and improved Transformer NER models for a 5% lift in F1.",
      "Built Label Studio annotation tooling with hierarchical entity linking, raising label accuracy and throughput for model training.",
    ],
  },
  {
    org: "Ola",
    title: "Software Infrastructure Intern",
    start: "Jun 2023",
    end: "Jul 2023",
    years: "2023",
    summary: "Ride and EV data pipelines.",
    points: [
      "Optimised SQL and Python pipelines over 1M+ ride and EV records feeding live executive dashboards, saving 10+ hours a week of manual reporting.",
    ],
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
  window: string; // fake window title in the project desk
};

export const projects: Project[] = [
  {
    slug: "advaita",
    name: "Advaita",
    kind: "Real-time voice AI teacher",
    year: "2026",
    status: "Live · school pilot",
    window: "advaitalearn.com",
    line: "A teacher you can talk to, and interrupt, in Hindi, English or Gujarati.",
    body: [
      "It started with my younger cousins stuck on homework late at night with nobody to ask. Tutors cost too much, and chatbots meant typing a question and reading a wall of text. What they needed was someone they could stop and say \"wait, go back\" to.",
      "Advaita teaches out loud at a live board. A student can cut in mid-sentence and it stops and re-explains, or snap a photo of a problem and get walked through it step by step. Sarvam speech-to-text and text-to-speech run in both directions with an LLM in between, and the board animations are timed to the voice.",
      "Progress is computed in code, not by the model, so it can never tell a child they have mastered something they have not.",
      "Built, deployed and run solo. In pilot with 10 Class 8 students at a school in Mumbai.",
    ],
    stack: ["Next.js", "Tailwind CSS", "Node.js", "Express", "Sarvam ASR/TTS", "LLMs"],
    links: [{ label: "advaitalearn.com", href: "https://advaitalearn.com" }],
  },
  {
    slug: "agent-browser-layer",
    name: "Agent Browser Layer",
    kind: "Browser control for LLM agents",
    year: "2026",
    window: "agent://browser",
    line: "Lets an agent see a live web page and act on it.",
    body: [
      "A control layer over the Chrome DevTools Protocol. It serialises the DOM into a compact view a model can read, and exposes click, type, navigate and scroll as callable tools.",
      "Agents run a perceive, decide, act loop: read the page, call a tool, re-read, re-plan. Element targeting is built to survive dynamically rendered pages, so multi-step tasks like navigation, form filling and extraction run on their own.",
    ],
    stack: ["TypeScript", "Node.js", "Playwright", "Chrome DevTools Protocol", "LLM tool calling"],
    links: [],
  },
  {
    slug: "invoiceguard",
    name: "InvoiceGuard",
    kind: "Agent environment and eval harness",
    year: "2026",
    status: "Top 10 · Meta x PyTorch OpenEnv",
    window: "invoiceguard.env",
    line: "An environment where agents learn to resolve invoice exceptions, graded deterministically.",
    body: [
      "Built on Meta and PyTorch's open-source OpenEnv framework. A FastAPI tool surface lets LLM agents make multi-step calls across invoices, purchase orders, goods receipts, vendor records and policy rules, under partial observability, to approve, hold, reject or escalate.",
      "22 tool-use tasks with dense rewards and deterministic graders, so every run is reproducible. SFT and GRPO training runs on Qwen with LoRA are scored against the same suite. I built the evals before the agent.",
    ],
    stack: ["Python", "FastAPI", "OpenEnv", "Qwen", "LoRA", "SFT", "GRPO"],
    links: [
      { label: "Live demo", href: "https://piyush-mk.github.io/InvoiceGuard/" },
      { label: "Hugging Face Space", href: "https://huggingface.co/spaces/piyush-mk/invoice-guard" },
      { label: "Source", href: "https://github.com/piyush-mk/InvoiceGuard" },
    ],
  },
  {
    slug: "awaaz",
    name: "Awaaz",
    kind: "Voice layer for Paytm POS",
    year: "2026",
    status: "3rd · Paytm x Sarvam AI",
    window: "awaaz.pos",
    line: "Merchants run billing and inventory by speaking, in their own language.",
    body: [
      "A voice-first layer for Paytm point-of-sale. Speech recognition feeds an LLM tool-calling loop, so small merchants can drive billing, inventory and customer workflows through multilingual speech.",
    ],
    stack: ["React", "Python", "JavaScript", "ASR", "LLMs"],
    links: [{ label: "Source", href: "https://github.com/piyush-mk/Awaaz" }],
  },
  {
    slug: "finscope",
    name: "FinScope",
    kind: "SEC filings pipeline",
    year: "2024",
    window: "finscope.app",
    line: "10-K filings in, a queryable dataset with LLM insights out.",
    body: [
      "An end-to-end pipeline over SEC EDGAR 10-K filings that scrapes, parses, cleans, indexes and serves them, with LLM-generated insights layered on top so analysts can follow financial trends without reading raw filings.",
    ],
    stack: ["Python", "Scrapy", "BeautifulSoup", "Pandas", "Streamlit", "LLMs"],
    links: [
      { label: "finscope.streamlit.app", href: "https://finscope.streamlit.app" },
      { label: "Source", href: "https://github.com/piyush-mk/FinScope" },
    ],
  },
  {
    slug: "protocol-automation",
    name: "Protocol-level scraping",
    kind: "Legacy portal extraction",
    year: "2026",
    window: "postback.replay",
    line: "Getting data out of portals that standard scrapers cannot read.",
    body: [
      "Replayed undocumented request flows on regulated-utility portals (PJM GATS, FERC) by reconstructing ASP.NET WebForms __VIEWSTATE postbacks and decoding DevExpress grid callbacks.",
    ],
    stack: ["Python", "Selenium", "HTTP"],
    links: [],
  },
];

export const achievements = [
  { rank: "Top 10", event: "Meta x PyTorch OpenEnv Hackathon", date: "Jun 2026", note: "InvoiceGuard" },
  { rank: "3rd", event: "Paytm x Sarvam AI Hackathon", date: "Jul 2026", note: "Awaaz" },
  { rank: "Top 10", event: "Pocket FM x Sarvam x OpenAI Zero to One AI Hackathon", date: "Jul 2026", note: "Finale at IIM Bangalore" },
  { rank: "Finalist", event: "Goldman Sachs India Quant Hackathon", date: "Oct 2024", note: "Top 15 nationwide" },
  { rank: "Best Use of Data", event: "NASA Space Apps Challenge, Bengaluru", date: "Oct 2023", note: "Plus global nomination" },
  { rank: "Winner", event: "HackNITR 4.0, EarthHacks track", date: "Jan 2023", note: "NIT Rourkela" },
];

export const toolbox = [
  { group: "Languages", items: ["Python", "TypeScript", "JavaScript", "Java", "SQL", "C++"] },
  { group: "Backend", items: ["FastAPI", "Pydantic", "Node.js", "Express", "REST APIs", "SQL Server"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "Vite", "Streamlit"] },
  { group: "AI", items: ["LLM tool calling", "Voice (ASR/TTS)", "PyTorch", "Transformers", "LoRA", "SFT/GRPO", "OpenEnv"] },
  { group: "Data", items: ["Pandas", "PySpark", "Scrapy", "Playwright", "Selenium", "Label Studio"] },
  { group: "Delivery", items: ["Docker", "Azure Pipelines", "SonarQube", "Pytest", "Git", "uv"] },
];

export const education = {
  school: "Manipal Institute of Technology",
  degree: "B.Tech, Computer & Communication Engineering",
  grade: "CGPA 8.11",
  years: "2021 – 2025",
};

// Impact map: hours saved per year, as measured. Peaks on the contour map scale with these.
export const impact = [
  { name: "PortBot", hours: 16640, x: 0.68, y: 0.42 },
  { name: "AutoWebQC", hours: 1500, x: 0.3, y: 0.32 },
  { name: "Contract 360", hours: 600, x: 0.44, y: 0.72 },
  { name: "Billing", hours: 500, x: 0.16, y: 0.66 },
  { name: "Ola pipelines", hours: 520, x: 0.86, y: 0.76 },
];
