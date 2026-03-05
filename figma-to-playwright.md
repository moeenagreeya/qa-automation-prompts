# figma-to-playwright.md
# MASTER PROMPT — Figma MCP → Locator Map → Test Cases → Playwright Script
# Build with: node scripts/build.js
# Paste the assembled file from dist/figma-to-playwright.md into Claude.
# ============================================================

# Role: Senior QA Automation Engineer

**Task:** Execute a 3-stage pipeline using the Figma MCP to generate a
fully typed Playwright test suite from a Figma design node.

**CRITICAL RULE:** Complete each stage fully before starting the next.
Output all three deliverables: `locatorMap.ts`, `testCases.md`, and
`[screen-name].spec.ts`.

---

## Input

Figma Design URL: `{{figma.design_url}}?node-id={{figma.node_id}}`
MCP Tool: `{{figma.mcp_tool}}`
Base URL for tests: `{{playwright.base_url}}`

---

## Stage 1: Fetch Design & Generate Locator Map

### Step 1a — Fetch the Figma Node

Use `{{figma.mcp_tool}}` to fetch node-id `{{figma.node_id}}`.
If child nodes are paginated or nested, recurse into all descendants
until the complete node tree is retrieved.

### Step 1b — Identify Interactive Elements

From the JSON node tree, identify every node matching:

**Buttons:**
- `type` is `COMPONENT` or `INSTANCE` with name containing
  "button", "btn", or "cta" (case-insensitive)
- OR any node with an `interactions[].trigger.type` of click

**Input fields:**
- Name contains "input", "field", "text field", "search", "textarea"
  (case-insensitive)
- OR nodes with a visible placeholder child `TEXT` node

For each matched node, extract:

| Property | Figma JSON Field |
|---|---|
| Node ID | `id` |
| Layer name | `name` |
| Node type | `type` |
| Bounding box | `absoluteBoundingBox` |
| Visible text / placeholder | Child `TEXT` node content |
| ARIA role hint | `componentPropertyDefinitions` or `description` |
| Interactions | `interactions[].trigger.type` |

### Step 1c — Generate locatorMap.ts

Output a TypeScript file using this priority order for locator strategy:

1. `page.getByRole('button', { name: '...' })` — buttons with unambiguous labels
2. `page.getByRole('textbox', { name: '...' })` — inputs with associated labels
3. `page.getByLabel('...')` — inputs with implied label relationship
4. `page.getByTestId('figma-node-{id}')` — fallback only, no semantic selector available

**Output format:**

```typescript
/**
 * @generated  Auto-generated from Figma design
 * @design     {{figma.design_url}}
 * @node-id    {{figma.node_id}}
 * @note       Review all locators before use in CI
 */

import { Page } from '@playwright/test';

export const locators = (page: Page) => ({
  // Buttons
  submitButton: page.getByRole('button', { name: 'Submit' }),     // node-id: 1-402
  cancelButton: page.getByRole('button', { name: 'Cancel' }),     // node-id: 1-405

  // Input Fields
  emailInput:    page.getByRole('textbox', { name: 'Email' }),    // node-id: 1-410
  passwordInput: page.getByLabel('Password'),                     // node-id: 1-412
} as const);

export type LocatorMap = ReturnType<typeof locators>;
```

**Edge cases:**
- Duplicate labels: append `_1`, `_2` suffix and add a comment noting the ambiguity
- No visible text/label: use cleaned layer name as key, note `[fallback]` in comment
- Decorative nodes (icons, dividers): exclude unless they have an interaction trigger

**Output a summary table after the code:**

| Key Name | Strategy | Visible Label | Node ID | Fallback? |
|---|---|---|---|---|
| submitButton | getByRole | "Submit" | 1-402 | No |

---

## Stage 2: Generate Test Cases

<!-- @include prompts/_stage1-analysis.md -->

<!-- @include prompts/_test-case-template.md -->

**Output file:** `testCases.md`

---

## Stage 3: Generate Playwright Script

### Step 3a — Scaffold the Spec File

Create a single `[screen-name].spec.ts` using Playwright Test runner:
- One `test.describe` block per screen or flow
- One `test()` per test case from Stage 2 (use TC-ID as the test name)
- Import locators from `{{playwright.locator_map_file}}` — do NOT hardcode selectors
- Base URL: `{{playwright.base_url}}`
- Default timeout: `{{playwright.default_timeout_ms}}ms`

### Step 3b — Implementation Reference

| Scenario | Playwright Implementation |
|---|---|
| Fill input | `await l.emailInput.fill('user@example.com')` |
| Click button | `await l.submitButton.click()` |
| Assert error visible | `await expect(page.getByRole('alert')).toBeVisible()` |
| Assert disabled | `await expect(l.submitButton).toBeDisabled()` |
| Assert URL change | `await expect(page).toHaveURL(/dashboard/)` |
| Assert text present | `await expect(page.getByText('Welcome')).toBeVisible()` |
| Assert accessible name | `await expect(l.emailInput).toHaveAccessibleName()` |
| Keyboard navigation | `await page.keyboard.press('Tab')` |

### Step 3c — Output Format

```typescript
/**
 * @generated  Auto-generated from Figma design + locatorMap.ts + testCases.md
 * @design     {{figma.design_url}}
 * @node-id    {{figma.node_id}}
 * @stage1     {{playwright.locator_map_file}}
 * @stage2     testCases.md
 * @note       Review all assertions before running in CI
 */

import { test, expect } from '@playwright/test';
import { locators } from './{{playwright.locator_map_file}}';

test.describe('[Screen Name] — Figma node {{figma.node_id}}', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('{{playwright.base_url}}');
  });

  // TC-001: [Summary]
  test('TC-001: Happy path — [description]', async ({ page }) => {
    const l = locators(page);
    await l.emailInput.fill('user@example.com');
    await l.passwordInput.fill('P@ssw0rd!');
    await l.submitButton.click();
    await expect(page).toHaveURL(/dashboard/);
  });

  // TC-002: [Summary]
  test('TC-002: Validation — empty fields show error', async ({ page }) => {
    const l = locators(page);
    await l.submitButton.click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

});
```

**Output file:** `{{playwright.spec_output_dir}}/[screen-name].spec.ts`

---

## Final Deliverables Summary

After all three stages are complete, confirm the three output files:

| File | Location | Description |
|---|---|---|
| `{{playwright.locator_map_file}}` | project root | Typed Playwright locators from Figma |
| `testCases.md` | project root | Structured test cases with Figma refs |
| `[screen].spec.ts` | `{{playwright.spec_output_dir}}/` | Ready-to-run Playwright test suite |