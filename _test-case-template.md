# _test-case-template.md
# PARTIAL — Do not use standalone. Included via @include in main prompts.
# Defines the universal test case structure and step writing rules.

## Test Case Structure

Use this exact structure for every test case without exception:

---
**TC-[NNN]: [Component/Feature] — [Category: Happy Path | Validation |
Error Handling | Boundary | Disabled State | Accessibility | Cross-screen]**

- **Priority:** {{priorities.critical.label}} | {{priorities.high.label}} | {{priorities.medium.label}} | {{priorities.low.label}}
- **Test Type:** {{jira.default_test_type}} | Generic
- **X-ray Folder:** `{{jira.test_repo_folder}}`
- **Figma Reference:** Screen-[N], [component name or screen position]
- **Labels:** `{{jira.labels[0]}}`, `{{jira.labels[1]}}`, `{{jira.labels[2]}}`, `{{jira.labels[3]}}`

**Pre-conditions:**
> State of the system before this test begins.
> Example: "User is on the Login screen at `/login`. No active session exists."

**Test Steps:**
| Step | Action | Test Data | Expected Result |
|:-----|:-------|:----------|:----------------|
| 1 | [Verb + target element] | [Explicit value or N/A] | [Observable UI outcome] |

**Post-conditions:**
> State of the system after this test passes.
> Example: "User session is active. Browser redirects to `/dashboard`."

---

## Test Step Writing Rules (strictly enforce these)

**Actions** must begin with a verb:
Click, Enter, Select, Clear, Navigate, Verify, Upload, Focus, Tab, Hover, Submit

**Test Data** must be concrete and explicit:
- ✅ `user@example.com` — not "a valid email"
- ✅ `abc@` — not "an invalid email"
- ✅ `P@ssw0rd!` — not "a strong password"
- ✅ 256 characters of `a` — not "text exceeding the limit"

**Expected Results** must describe observable UI outcomes:
- ✅ `Error message "Email is required" appears below the email field`
- ✅ `Submit button becomes enabled and changes colour to blue`
- ❌ `Validation triggers` — too vague, not acceptable
- ❌ `System processes the request` — not observable in the UI

**Structure rules:**
- Each step must be atomic — one action per row, no compound steps
- Test Data column must never be empty — use `N/A` if no data applies
- Expected Result must always describe something visible or measurable

## Coverage Requirements

Generate test cases across ALL categories below. Do not omit a category
unless there are genuinely zero applicable components in the design.

| Category | Minimum Cases | Notes |
|---|---|---|
| Happy Path (end-to-end) | {{coverage.min_happy_path}} per distinct user flow | Full flow from entry to success state |
| Input Validation | {{coverage.min_validation}} per input field | Required + format rules |
| Error / Negative States | {{coverage.min_error}} per error state | Visible or inferred |
| Boundary Conditions | {{coverage.min_boundary}} per constrained field | Length, numeric limits |
| Disabled / Conditional UI | {{coverage.min_disabled_state}} per conditional element | Greyed states, prerequisites |
| Accessibility (basic) | {{coverage.min_accessibility}} per screen | Keyboard nav + label presence |
| Cross-screen Flow | {{coverage.min_cross_screen}} per transition | Multi-image inputs only |

## Complexity Scoring Reference

| Complexity | Steps | Description |
|---|---|---|
| {{complexity.low.label}} | {{complexity.low.steps}} steps | {{complexity.low.description}} |
| {{complexity.medium.label}} | {{complexity.medium.steps}} steps | {{complexity.medium.description}} |
| {{complexity.high.label}} | {{complexity.high.steps}} steps | {{complexity.high.description}} |

## Priority Assignment Rules

| Priority | When to Apply |
|---|---|
| `{{priorities.critical.label}}` | {{priorities.critical.scope}} |
| `{{priorities.high.label}}` | {{priorities.high.scope}} |
| `{{priorities.medium.label}}` | {{priorities.medium.scope}} |
| `{{priorities.low.label}}` | {{priorities.low.scope}} |