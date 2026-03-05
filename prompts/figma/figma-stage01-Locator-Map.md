## Task: Generate a Playwright Locator Map from a Figma Design

### Step 1 — Fetch the Figma Design
Use the Figma MCP tool to fetch the node at this URL:
`https://www.figma.com/design/NzsmnwWGrjdBEbm7PN1OMN/CC-prototype?node-id=1-368&t=RK97hQM37N0kncSq-0`

Extract the full JSON node tree for node-id `1-368`. If child nodes are paginated or nested, recurse into them until all descendants are retrieved.

---

### Step 2 — Identify Interactive Elements
From the JSON node tree, identify every node that is one of the following types:
- **Buttons**: nodes whose `type` is `COMPONENT` or `INSTANCE` with a name containing "button", "btn", or "cta" (case-insensitive), OR nodes with an interaction/click trigger defined
- **Input fields**: nodes whose name contains "input", "field", "text field", "search", or "textarea" (case-insensitive), OR nodes with a visible text placeholder child

For each matched node, extract:
| Property | Figma JSON field |
|---|---|
| Node ID | `id` |
| Layer name | `name` |
| Node type | `type` |
| Bounding box | `absoluteBoundingBox` or `relativeTransform` + `size` |
| Visible text / placeholder | text content of child `TEXT` nodes |
| ARIA role hint | `componentPropertyDefinitions` or `description` if present |
| Interactions | `interactions[].trigger.type` |

---

### Step 3 — Generate the Playwright Locator Map

Output a TypeScript file (`locatorMap.ts`) using the following rules:

**Locator priority (in order):**
1. Use `page.getByRole('button', { name: '...' })` for buttons where the visible label is unambiguous
2. Use `page.getByRole('textbox', { name: '...' })` for inputs that have an associated label (derived from nearby `TEXT` nodes or `componentPropertyDefinitions`)
3. Use `page.getByLabel('...')` when an explicit label relationship is implied by layer grouping or description
4. Fall back to `page.getByTestId('...')` using the node-id (formatted as `figma-node-{id}`) only if no semantic selector is derivable

**Output format:**
```typescript
// Auto-generated from Figma node 1-368
// Design: CC-prototype
// Fetched: <timestamp>

export const locators = {
  // Buttons
  submitButton: page.getByRole('button', { name: 'Submit' }),       // node-id: 1-402
  cancelButton: page.getByRole('button', { name: 'Cancel' }),       // node-id: 1-405

  // Input Fields
  emailInput:   page.getByRole('textbox', { name: 'Email' }),       // node-id: 1-410
  passwordInput: page.getByLabel('Password'),                       // node-id: 1-412
} as const;

export type LocatorMap = typeof locators;
```

---

### Step 4 — Output a Summary Table

After the TypeScript block, include a markdown table listing every identified element:

| Key Name | Locator Strategy | Visible Text / Label | Node ID | Fallback Used? |
|---|---|---|---|---|
| submitButton | getByRole | "Submit" | 1-402 | No |
| emailInput | getByRole | "Email" | 1-410 | No |

---

### Edge Case Handling
- If two elements share the same visible label, append a numeric suffix (e.g., `submitButton_1`, `submitButton_2`) and add a comment noting the ambiguity
- If a node has no visible text or label, use the cleaned layer name as the key and mark `Fallback Used? = Yes`
- Do not include purely decorative nodes (icons, dividers, background shapes) unless they have an interaction trigger