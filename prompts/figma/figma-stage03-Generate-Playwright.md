## Task: Generate Playwright Test Script

### Inputs Available
- `locatorMap.ts` from Stage 1
- Test cases document from Stage 2

### Step 1 — Scaffold the Test File
Create a single `*.spec.ts` file using Playwright Test runner with:
- One `test.describe` block per screen/flow
- One `test()` per test case (using TC-ID as the test name)
- Import and reuse locators from `locatorMap.ts` — do NOT hardcode selectors

### Step 2 — Implement Each Test
For each test case, apply these implementation rules:

| Scenario | Playwright Implementation |
|---|---|
| Fill input | `await locators.emailInput.fill('test@example.com')` |
| Click button | `await locators.submitButton.click()` |
| Assert error message | `await expect(page.getByRole('alert')).toBeVisible()` |
| Assert disabled state | `await expect(locators.submitButton).toBeDisabled()` |
| Assert navigation | `await expect(page).toHaveURL(/dashboard/)` |
| Accessibility check | `await expect(locators.emailInput).toHaveAccessibleName()` |

### Step 3 — Output Format
```typescript
import { test, expect, Page } from '@playwright/test';
import { locators } from './locatorMap';

test.describe('Login Screen — [Figma node 1-368]', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://your-app-url.com');
  });

  // TC-001: Successful login with valid credentials
  test('TC-001: Happy path — valid login', async ({ page }) => {
    const l = locators(page); // if locators are wrapped in a factory
    await l.emailInput.fill('user@example.com');
    await l.passwordInput.fill('ValidPass123');
    await l.submitButton.click();
    await expect(page).toHaveURL(/dashboard/);
  });

  // TC-002: Show error on empty form submission
  test('TC-002: Validation — empty fields show error', async ({ page }) => {
    const l = locators(page);
    await l.submitButton.click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

});
```

### Step 4 — Add a Generation Metadata Comment Block
At the top of the file, include:
```typescript
/**
 * @generated  Auto-generated from Figma design
 * @design     CC-prototype — node-id: 1-368
 * @stage1     locatorMap.ts
 * @stage2     testCases.md
 * @timestamp  <insert date>
 * @note       Review all assertions before running in CI
 */
```