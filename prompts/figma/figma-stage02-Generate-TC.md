## Task: Generate Test Cases from Figma Design Analysis

### Inputs Available
- The Figma node JSON tree fetched from node-id `1-368`
- The generated `locatorMap.ts` from Stage 1

### Step 1 — Infer User Flows
From the Figma design, identify logical user flows by analyzing:
- **Screen/frame names** (e.g., "Login Screen", "Empty State", "Error State")
- **Interactive element groupings** (buttons near input fields suggest a form flow)
- **Variant names** in components (e.g., "state=error", "state=disabled", "state=hover")
- **Prototype connections** (`interactions[].navigation`) if present in the JSON

### Step 2 — Generate Test Cases
For each identified flow, generate test cases covering:

| Category | What to look for in Figma |
|---|---|
| Happy path | Default/enabled state of all inputs filled, primary button active |
| Validation errors | Component variants named "error", "invalid", or red-colored border styles |
| Empty / disabled states | Variants named "disabled", "empty", or buttons with `opacity < 1` |
| Boundary conditions | Placeholder text hints (e.g., "Max 100 chars"), numeric steppers |
| Accessibility | Missing labels, low contrast text nodes, unlabeled icon-only buttons |

### Step 3 — Output Format
Produce a structured test case document in this format:
```markdown
## Test Suite: [Frame/Screen Name]

### TC-001: [Test Case Title]
- **Type**: Happy Path | Negative | Edge Case | Accessibility
- **Preconditions**: e.g., user is on the login screen
- **Steps**:
  1. ...
  2. ...
- **Expected Result**: ...
- **Figma Reference**: node-id `1-402`, variant `state=error`
- **Locator Keys Used**: `emailInput`, `submitButton` (from locatorMap.ts)
```

Generate test cases for: Happy Path, Validation/Error states, Disabled states, and at least one Accessibility check per form.