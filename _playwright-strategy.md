# _playwright-strategy.md
# PARTIAL — Do not use standalone. Included via @include in main prompts.
# Defines Playwright automation strategy hints embedded in Jira test descriptions.

## Playwright Automation Strategy Block

For every test case created in Jira, append this section to the ADF description
after the Test Steps table. Populate it based on the actions and expected results
identified for each test case.

### ADF Structure for Automation Strategy Section

Add these nodes to the `description.content` array after the Post-conditions section:

```json
{
  "type": "heading",
  "attrs": { "level": 3 },
  "content": [{ "type": "text", "text": "🤖 Automation Strategy (Playwright)" }]
},
{
  "type": "paragraph",
  "content": [
    { "type": "text", "text": "Goal: ", "marks": [{ "type": "strong" }] },
    { "type": "text", "text": "Ensure resilient execution using best-practice locators." }
  ]
},
{
  "type": "heading",
  "attrs": { "level": 4 },
  "content": [{ "type": "text", "text": "Recommended Locators" }]
},
{
  "type": "bulletList",
  "content": [
    {
      "type": "listItem",
      "content": [{
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Primary: ", "marks": [{ "type": "strong" }] },
          { "type": "text", "text": "page.getByRole('button', { name: 'Submit' })",
            "marks": [{ "type": "code" }] }
        ]
      }]
    },
    {
      "type": "listItem",
      "content": [{
        "type": "paragraph",
        "content": [
          { "type": "text", "text": "Fallback: ", "marks": [{ "type": "strong" }] },
          { "type": "text", "text": "page.getByTestId('element-test-id')",
            "marks": [{ "type": "code" }] }
        ]
      }]
    }
  ]
},
{
  "type": "heading",
  "attrs": { "level": 4 },
  "content": [{ "type": "text", "text": "Assertion Logic" }]
},
{
  "type": "bulletList",
  "content": [
    {
      "type": "listItem",
      "content": [{
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Verify HTTP 200 response for the relevant API endpoint" }]
      }]
    },
    {
      "type": "listItem",
      "content": [{
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Validate visibility of success state element after action completes" }]
      }]
    }
  ]
}
```

### Locator Selection Rules

When populating the Recommended Locators for each test case, apply this priority:

| Priority | Locator | When to use |
|---|---|---|
| 1st | `page.getByRole('button', { name: '...' })` | Any button with visible label |
| 2nd | `page.getByRole('textbox', { name: '...' })` | Input with associated label |
| 3rd | `page.getByLabel('...')` | Input with nearby label element |
| 4th | `page.getByText('...')` | Unique visible text content |
| 5th | `page.getByTestId('...')` | Only if data-testid is specified in AC |

Always provide:
- One **primary locator** for the main interactive element
- One **fallback locator** using a different strategy
- The relevant **API endpoint** from the AC if network assertion is needed

### Assertion Templates by Test Category

| Category | Assertion to include |
|---|---|
| Happy Path | `expect(page).toHaveURL(/expected-path/)` + success element visible |
| Validation | `expect(page.getByRole('alert')).toBeVisible()` + error text match |
| Error Handling | `expect(page.getByText('error message')).toBeVisible()` |
| Boundary | `expect(locator).toHaveValue(boundaryValue)` |
| Accessibility | `expect(locator).toHaveAccessibleName()` + keyboard nav check |