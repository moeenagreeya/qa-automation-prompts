# QA Automation Prompts

Prompt management system for the **Figma → X-ray Test Cases → Playwright** pipeline.

## Structure

```
qa-prompts/
│
├── config.yaml                      ← ALL variable values live here only
│
├── prompts/
│   ├── _stage1-analysis.md          ← Partial: visual analysis instructions
│   ├── _test-case-template.md       ← Partial: TC structure + step writing rules
│   ├── _stage3-approval.md          ← Partial: approval gate logic
│   ├── _jira-payload.md             ← Partial: Jira API field structure
│   ├── _html-report.md              ← Partial: Stage 5 HTML report spec
│   │
│   ├── figma-to-xray.md             ← Master: Figma PNG → X-ray → Jira → HTML Report
│   └── figma-to-playwright.md       ← Master: Figma MCP → Locators → TC → Playwright
│
├── dist/                            ← Built output — paste these into Claude
│   ├── figma-to-xray.md
│   └── figma-to-playwright.md
│
├── scripts/
│   └── build.js                     ← Assembles prompts from partials + config
│
├── .env.example                     ← Template for secrets (never commit .env)
├── .gitignore
├── package.json
└── README.md
```

**Key rule:** Files prefixed with `_` are partials — never paste them directly 
into Claude. Always use assembled files from `dist/`.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env template (fill in real values — do NOT commit this file)
cp .env.example .env

# 3. Update config.yaml with your project values
#    (Jira Cloud ID, project key, epic, environments, etc.)

# 4. Build all prompts
npm run build

# 5. Copy dist/figma-to-xray.md and paste into Claude with your PNG attached
```

---

## Commands

| Command | Description |
|---|---|
| `npm run build` | Build all master prompts into `dist/` |
| `npm run build:xray` | Build `figma-to-xray.md` only |
| `npm run build:playwright` | Build `figma-to-playwright.md` only |
| `npm run build:story` | Build `jira-story-to-xray.md` only |
| `npm run check` | Validate config completeness without writing files |

---

## Pipelines

### Pipeline 1: Figma PNG → X-ray Test Cases → Jira → HTML Report

**Use when:** You have a Figma design exported as PNG or JPG and want to 
generate X-ray test cases and push them to Jira.

**File:** `dist/figma-to-xray.md`

**Stages:**
1. Visual & Functional Analysis
2. Test Case Generation
3. Preview & Approval Gate ← human review required
4. Jira X-ray Issue Creation
5. HTML Summary Report

**How to use:**
1. Run `npm run build:xray`
2. Open `dist/figma-to-xray.md` and copy the full contents
3. In Claude: paste the prompt, attach your Figma PNG/JPG, and send

---

### Pipeline 2: Figma MCP → Locator Map → Test Cases → Playwright

**Use when:** You have access to the Figma MCP and want to generate 
a fully typed Playwright test suite from a Figma design node.

**File:** `dist/figma-to-playwright.md`

**Stages:**
1. Fetch design via Figma MCP + generate `locatorMap.ts`
2. Generate `testCases.md`
3. Generate `[screen].spec.ts` Playwright test file

**How to use:**
1. Run `npm run build:playwright`
2. Copy `dist/figma-to-playwright.md`
3. In Claude (with Figma MCP connected): paste and send

---

## Updating Config

All variable values are centralised in `config.yaml`. To update:

1. Edit the relevant value in `config.yaml`
2. Run `npm run build` to rebuild all prompts
3. The updated `dist/` files are ready to use

**Never edit variable values directly inside `prompts/` files.** 
Always change `config.yaml` and rebuild.

---

### Pipeline 3: Jira Story → X-ray Test Cases → Playwright

**Use when:** You have a Jira User Story with Acceptance Criteria and want to
generate X-ray test cases mapped to each AC, with Playwright automation hints,
linked back to the source story.

**File:** `dist/jira-story-to-xray.md`

**Phases:**
1. Fetch story + parse Acceptance Criteria from Jira
2. Generate test cases mapped to each AC (all categories)
3. Preview + Approval Gate ← human review required
4. Create X-ray Test issues in Jira
5. Link each Test back to the source story
6. HTML Summary Report with AC coverage heatmap

**How to use:**
1. Update `config.yaml` → `story_to_xray.default_issue_key` to your story key
2. Update `story_to_xray.jira_base_url` to your Jira domain
3. Run `npm run build:story`
4. Copy `dist/jira-story-to-xray.md` and paste into Claude (with Atlassian MCP connected)

**To run against a different story without rebuilding:**
Simply change the issue key in the pasted prompt before sending, or tell
Claude: "Use QET-45 instead of the default issue key."

---

## Adding a New Prompt

1. Create `prompts/my-new-prompt.md` (no leading underscore = master prompt)
2. Use `<!-- @include prompts/_partial-name.md -->` to include partials
3. Use `{{config.key}}` syntax to reference config values
4. Run `npm run build` — output appears in `dist/my-new-prompt.md`

## Adding a New Partial

1. Create `prompts/_my-partial.md` (leading underscore = partial)
2. Include it in any master prompt with `<!-- @include prompts/_my-partial.md -->`
3. Run `npm run build`

---

## Variable Syntax

In prompt files, reference config values with double curly braces:

```
{{jira.cloud_id}}          → 05769d83-6239-4970-a08d-1c7d364996cd
{{jira.project_key}}       → QET
{{jira.labels[0]}}         → design-based
{{report.colors.primary}}  → #0052CC
```

Run `npm run check` to catch any `[MISSING: ...]` variables before using 
a built prompt.

---

## Secrets Management

- Real credentials (API tokens, Cloud IDs) should go in `.env` — never in `config.yaml`
- `.env` is git-ignored
- `.env.example` shows the expected variables — commit this as documentation
- Extend `build.js` to read `process.env` values if you need runtime secret injection