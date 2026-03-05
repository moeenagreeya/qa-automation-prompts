# _stage1-analysis.md
# PARTIAL — Do not use standalone. Included via @include in main prompts.
# Stage 1: Visual & Functional Analysis of Figma design exports (PNG/JPG).

## Stage 1: Visual & Functional Analysis

Deconstruct each screen systematically across all four dimensions below.
Do not proceed to Stage 2 until all four dimensions are fully documented.

### 1a. UI Component Inventory

Identify and list every detected component with its inferred type:

**Interactive components:**
- Buttons: primary, secondary, destructive, ghost, icon-only
- Text inputs, password fields, search bars, textarea
- Dropdowns, select menus, comboboxes
- Checkboxes, radio buttons, toggle switches
- Sliders, range inputs, steppers
- Date pickers, time pickers
- File upload zones

**Structural components:**
- Forms and field groups
- Modals, drawers, side panels, popovers
- Navigation bars, sidebars, tab bars
- Breadcrumbs, stepper/wizards, progress bars
- Accordions, expandable sections
- Cards, list items, data rows

**Feedback components:**
- Inline error messages and field-level validation text
- Toast / snackbar notifications
- Alert banners (info, warning, error, success)
- Empty states (illustration + CTA)
- Loading spinners, skeleton screens
- Progress indicators, upload progress bars

**Content components:**
- Tables, data grids
- Pagination controls
- Lists (ordered, unordered, icon-prefixed)
- Tags, chips, badges

### 1b. User Flows

For each form or interactive region, document all paths:

**Happy Path:**
All inputs contain valid data, the primary action button is active,
and the flow completes successfully (e.g., form submitted, user redirected).

**Negative Paths:**
- Invalid input format (e.g., malformed email, wrong date format)
- Missing required fields (submit attempted with empty required inputs)
- Value out of range (e.g., negative number, date in the past)
- Unauthorised or already-used value (e.g., duplicate email on registration)

**Edge Cases:**
- Special characters in text inputs (`<`, `>`, `'`, `"`, `&`, emoji)
- Maximum length input (paste text exceeding the character limit)
- Minimum length not met (submit with too-short password)
- Loading / timeout state (if spinner or skeleton is visible in the design)
- Slow network simulation (if retry or timeout message is shown)

### 1c. Validation Rules (infer from visual cues)

Actively look for and extract every visible constraint:

| Signal | What to Infer |
|---|---|
| Asterisk `*` next to label | Field is required |
| `"Required"` label text | Field is required |
| Placeholder `email@domain.com` | Email format enforced |
| Placeholder `DD/MM/YYYY` | Date format enforced |
| Placeholder `+1 (555) 000-0000` | Phone format enforced |
| Character counter `0/100` | Max 100 character limit |
| `Max 250` helper text | Max 250 character limit |
| Greyed / disabled button | Prerequisite not yet met |
| Greyed / read-only field | Field is dependent or non-editable |
| Password strength indicator | Complexity rules enforced |
| Visible rule checklist | Enumerate each rule as a separate validation test |

### 1d. Error & Empty States

**Visible error states:**
Note every red border, error icon (`!`), warning icon (`⚠️`), or error
message text visible anywhere in the design. Document the exact
message text if readable.

**Inferred error states:**
If error states are NOT visible in the PNG, tag them as
`[Inferred — not shown in design]` in the relevant test case.
Always infer at minimum: required field empty, invalid format.

**Empty states:**
Note any "no results", "nothing here yet", or empty list illustrations.
These are testable conditions (e.g., search returns zero results).

**Loading states:**
Note any spinner, skeleton screen, or progress bar. These represent
a testable intermediate state between action and result.