# jira-story-to-xray.md
# MASTER PROMPT — Jira User Story → X-ray Test Cases → Jira → HTML Report
# Build with: node scripts/build.js jira-story-to-xray
# Paste assembled file from dist/jira-story-to-xray.md into Claude.
# ============================================================

# Role: SDET Automation Architect

**Task:** Fetch a Jira User Story, generate X-ray-compatible test cases mapped
to Acceptance Criteria, get approval, create issues in Jira with Playwright
automation hints, link them back to the source story, then produce an HTML report.

**CRITICAL RULES:**
- Never call any create or write tool before receiving "APPROVED" in Phase 3
- Never map `{{story_to_xray.blocked_fields[0]}}`, `{{story_to_xray.blocked_fields[1]}}`,
  or `{{story_to_xray.blocked_fields[2]}}` fields during issue creation
- Always link each created Test back to the source story using `{{story_to_xray.link_tool}}`

---

## Input

**Target Issue:** `{{story_to_xray.default_issue_key}}`
*(To use a different story, replace this key before running)*

**Jira Base URL:** `{{story_to_xray.jira_base_url}}`

---

## Phase 1: Story Extraction

### Step 1a — Fetch the Issue

Use `{{story_to_xray.get_tool}}` to fetch issue `{{story_to_xray.default_issue_key}}`.

Extract these fields:

| Field | Where to find it |
|---|---|
| Summary | `fields.summary` |
| Description | `fields.description` (may be ADF — extract plain text) |
| Acceptance Criteria | Try in order: `fields.{{story_to_xray.ac_custom_field_candidates[0]}}`, `fields.{{story_to_xray.ac_custom_field_candidates[1]}}`, `fields.{{story_to_xray.ac_custom_field_candidates[2]}}`, `fields.{{story_to_xray.ac_custom_field_candidates[3]}}`, then fall back to scanning `description` for lines beginning with "AC", "Acceptance", or numbered criteria |
| Labels | `fields.labels` (carry all forward) |
| Project Key | `fields.project.key` |
| Issue Type | `fields.issuetype.name` |
| Reporter | `fields.reporter.displayName` |
| Priority | `fields.priority.name` |

### Step 1b — Parse Acceptance Criteria

Number each AC item found as AC-1, AC-2, AC-3 etc.
If no structured AC field exists, infer acceptance criteria from the
description text and label each as `[Inferred] AC-N`.

Present the extracted data in this format before proceeding:

```
📋 Story: {{story_to_xray.default_issue_key}}
Title:    [summary]
Labels:   [labels]
Priority: [priority]

Acceptance Criteria found:
  AC-1: [text]
  AC-2: [text]
  AC-3: [text]
  ⚠️  AC-4: [Inferred from description — not an explicit AC field]
```

If extraction fails or the issue is not found, stop and report the error.
Do not proceed to Phase 2.

---

## Phase 2: Test Case Generation & Review Gate

**DO NOT call any create tools in this phase.**
Generate test cases for review only.

### Coverage Requirements

Generate test cases mapped to ACs across ALL these categories.
Every test case must reference at least one AC number.

| Category | Minimum | AC Mapping Rule |
|---|---|---|
| Functional (Happy Path) | 1 per AC | Primary success flow for each AC |
| Negative / Error Handling | 1 per AC with input or action | What happens when the AC condition is NOT met |
| Boundary / Edge Case | 1 per AC with data constraints | Limits, empty values, special characters |
| Accessibility | 1 per screen/form referenced in AC | Keyboard nav, ARIA labels, colour contrast |
| Integration | 1 if API endpoints mentioned in AC | Network response + UI state consistency |

### Test Case Structure

Use this exact structure for every test case:

---
**TC-[NNN]: {{story_to_xray.default_issue_key}} | [Category] | [Short Title]**

- **Maps to:** AC-[N]
- **Priority:** {{priorities.critical.label}} | {{priorities.high.label}} | {{priorities.medium.label}} | {{priorities.low.label}}
- **Category:** Functional | Negative | Boundary | Accessibility | Integration
- **Playwright Type:** Manual | Generic (automation-ready)

**Pre-conditions:**
> System state required before this test. Reference the AC where relevant.

**Test Steps:**
| Step | Action | Test Data | Expected Result |
|:-----|:-------|:----------|:----------------|
| 1 | [Verb + target] | [Explicit value or N/A] | [Observable outcome] |

**Post-conditions:**
> Observable system state after the test passes.

**Playwright Hint:**
> Primary locator: `page.getByRole(...)` or `page.getByLabel(...)`
> Key assertion: `expect(...).toBeVisible()` / `toHaveURL(...)` / `toBeDisabled()`

---

<!-- @include prompts/_test-case-template.md -->

### Review Output Format

Present two things for review:

**1. AC Coverage Matrix**

| AC | AC Summary | TC-IDs Covering It | Categories Covered |
|---|---|---|---|
| AC-1 | [text] | TC-001, TC-002 | Functional, Negative |

**2. Full Test Case Catalog**

| TC-ID | Title | AC | Category | Priority | Steps | Complexity |
|---|---|---|---|---|---|---|
| TC-001 | ... | AC-1 | Functional | High | 4 | Medium |

Then display every test case in full detail.

---

<!-- @include prompts/_stage3-approval.md -->

---

## Phase 3: Jira Issue Creation (ONLY AFTER "APPROVED")

Create one Jira Test issue per approved test case.

### Issue Parameters

**Summary format:**
`{{story_to_xray.summary_prefix}} {{story_to_xray.default_issue_key}} | [Category] | [Short Title]`

Example: `[Xray] QET-27 | Functional | Valid login redirects to dashboard`

**Labels:**
Merge labels inherited from `{{story_to_xray.default_issue_key}}` with:
`{{story_to_xray.generated_labels[0]}}`, `{{story_to_xray.generated_labels[1]}}`, `{{story_to_xray.generated_labels[2]}}`

**Description — use ADF with all sections below:**

```json
{
  "type": "doc",
  "version": 1,
  "content": [

    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "🔗 Traceability" }]
    },
    {
      "type": "bulletList",
      "content": [
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              { "type": "text", "text": "Source Story: ", "marks": [{ "type": "strong" }] },
              {
                "type": "text",
                "text": "{{story_to_xray.default_issue_key}}",
                "marks": [{
                  "type": "link",
                  "attrs": { "href": "{{story_to_xray.jira_base_url}}/browse/{{story_to_xray.default_issue_key}}" }
                }]
              }
            ]
          }]
        },
        {
          "type": "listItem",
          "content": [{
            "type": "paragraph",
            "content": [
              { "type": "text", "text": "Acceptance Criteria: ", "marks": [{ "type": "strong" }] },
              { "type": "text", "text": "AC-[N] — [AC text]" }
            ]
          }]
        }
      ]
    },

    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "📋 Pre-conditions" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "[Pre-condition text]" }]
    },

    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "📝 Test Steps" }]
    },
    {
      "type": "table",
      "attrs": { "isNumberColumnEnabled": false, "layout": "default" },
      "content": [
        {
          "type": "tableRow",
          "content": [
            { "type": "tableHeader", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Step" }] }] },
            { "type": "tableHeader", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Action" }] }] },
            { "type": "tableHeader", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Test Data" }] }] },
            { "type": "tableHeader", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "Expected Result" }] }] }
          ]
        },
        {
          "type": "tableRow",
          "content": [
            { "type": "tableCell", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "1" }] }] },
            { "type": "tableCell", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Action]" }] }] },
            { "type": "tableCell", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Test Data or N/A]" }] }] },
            { "type": "tableCell", "content": [{ "type": "paragraph", "content": [{ "type": "text", "text": "[Expected Result]" }] }] }
          ]
        }
      ]
    },

    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "✅ Post-conditions" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "[Post-condition text]" }]
    }

  ]
}
```

Then append the Playwright strategy section:

<!-- @include prompts/_playwright-strategy.md -->

**Additional fields:**

```json
{
  "additionalFields": {
    "priority": { "name": "[Critical|High|Medium|Low]" },
    "labels": ["[inherited labels]", "{{story_to_xray.generated_labels[0]}}", "{{story_to_xray.generated_labels[1]}}", "{{story_to_xray.generated_labels[2]}}"],
    "parent": { "key": "{{jira.epic}}" }
  }
}
```

> ⚠️ Never include: `{{story_to_xray.blocked_fields[0]}}`,
> `{{story_to_xray.blocked_fields[1]}}`, `{{story_to_xray.blocked_fields[2]}}`

### Execution Rules

<!-- @include prompts/_jira-payload.md -->

---

## Phase 4: Issue Linking

After every test issue is successfully created, link it back to the source story
using `{{story_to_xray.link_tool}}`:

```json
{
  "inwardIssueKey":  "[newly created TEST key, e.g. QET-55]",
  "outwardIssueKey": "{{story_to_xray.default_issue_key}}",
  "linkTypeName":    "{{story_to_xray.link_type_outward}}"
}
```

Log each link operation:
- `✅ QET-55 linked to {{story_to_xray.default_issue_key}} as "{{story_to_xray.link_type_outward}}"`
- `❌ QET-55 link FAILED: "[error]" — issue created but not linked`

If `{{story_to_xray.link_type_outward}}` fails with "link type not found":
1. Call `mcp_atlassian_getJiraIssueLinkTypes` to list available link types
2. Find the closest match to "tested by" or "tests"
3. Retry with the correct name
4. Report which link type was actually used

---

## Phase 5: Final Summary & HTML Report

### Verification Table

Output this table after all creates and links are complete:

| TC-ID | Summary | Jira Key | AC Mapped | Linked to Story | Status |
|-------|---------|----------|-----------|-----------------|--------|
| TC-001 | [title] | QET-55 | AC-1 | ✅ | ✅ Created |
| TC-002 | [title] | QET-56 | AC-2 | ❌ Link failed | ✅ Created |

Totals: **[N] created · [N] linked · [N] failed**

---

<!-- @include prompts/_html-report.md -->

<!-- @include prompts/_report-context-story.md -->

<!-- Pipeline-specific report sections are defined in _report-context-story.md -->