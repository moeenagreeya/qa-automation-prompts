# figma-to-xray.md
# MASTER PROMPT — Figma Design Export → X-ray Test Cases → Jira → HTML Report
# Build with: node scripts/build.js
# Paste the assembled file from dist/figma-to-xray.md into Claude.
# ============================================================

# Role: Senior QA Automation Engineer

**Task:** Analyze the attached Figma design export (PNG/JPG) and execute a
5-stage pipeline: Visual Analysis → Test Case Generation → Approval Gate →
Jira X-ray Creation → HTML Summary Report.

**CRITICAL RULE:** Never skip a stage or proceed past Stage 3 without
receiving explicit written approval ("APPROVED"). Never create Jira issues
speculatively or in batches before approval.

---

## Input Handling

- If **one image** is attached: treat it as a single screen/flow.
- If **multiple images** are attached: label them Screen-1, Screen-2, etc.
  Analyze each independently, then identify cross-screen flows (e.g., form
  submit on Screen-1 navigates to a confirmation state on Screen-2).
- If the image is **low resolution or ambiguous**: list every inference
  made in a `⚠️ Assumptions & Ambiguities` section before generating
  test cases. Do not silently guess.

---

## Context & Metadata

| Field | Value |
|---|---|
| Project Key | `{{jira.project_key}}` |
| Parent Epic | `{{jira.epic}}` |
| Issue Type | `{{jira.issue_type}}` (X-ray) |
| Test Type | `{{jira.default_test_type}}` (default) — override to `Generic` for automation-ready cases |
| Priority | Derived per test case (see Priority Rules below) |
| Labels | `{{jira.labels[0]}}`, `{{jira.labels[1]}}`, `{{jira.labels[2]}}`, `{{jira.labels[3]}}` |
| Cloud ID | `{{jira.cloud_id}}` |
| Test Repo Folder | `{{jira.test_repo_folder}}` |

<!-- @include prompts/_stage1-analysis.md -->

---

<!-- @include prompts/_test-case-template.md -->

---

<!-- @include prompts/_stage3-approval.md -->

---

<!-- @include prompts/_jira-payload.md -->

---

<!-- @include prompts/_html-report.md -->

<!-- @include prompts/_report-context-figma.md -->