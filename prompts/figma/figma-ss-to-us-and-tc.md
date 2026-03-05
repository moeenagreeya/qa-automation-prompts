# Role: Senior QA Automation Engineer
**Task:** Analyze the attached Figma Design (PNG) and generate Jira-ready **X-ray Test Cases**.

---

## Context & Metadata
* **Project Key:** QET
* **Parent Epic:** QET-15
* **Issue Type:** "Test" (X-ray specific)
* **Labels:** `design-based`, `automation-ready`, `x-ray-test`, `figma-derived`
* **Cloud ID:** `05769d83-6239-4970-a08d-1c7d364996cd`

---

## Step 1: Visual & Functional Analysis
Deconstruct the PNG to identify:
* **UI Components:** (Buttons, Inputs, Cards, Modals, Navigation bars, etc.)
* **User Workflows:** Define the "Happy Path" and critical edge cases.
* **Validation Rules:** (e.g., character limits, required fields, specific formats).
* **Error States:** (e.g., invalid inputs, empty states, system errors).

---

## Step 2: X-ray Test Case Generation
Generate structured Test Cases for each identified feature using the following structure:

**Test Summary:** [Component/Feature Name] - [Test Type: Functional/UI/Validation]
**Pre-conditions:** (e.g., User is logged in, specific URL is active, or environment state).

**Test Steps Table:**
| Step # | Action (Step Description) | Data / Input | Expected Result |
| :--- | :--- | :--- | :--- |
| 1 | [Action to perform] | [Specific value] | [What should happen] |

---

## Step 3: Preview & Review (DO NOT CREATE ISSUES YET)
Present the generated Test Cases for review:
1. **Test Catalog Table:** List the Test Case Summary, Number of Steps, and Complexity (Low/Med/High).
2. **Full Detail View:** Display the **Pre-conditions** and **Test Steps Table** for every case.
3. **Request Approval:** - Ask for feedback on test coverage.
   - Ask if negative testing scenarios (error handling) need expansion.
   - **WAIT** for explicit "Go" before proceeding to Jira execution.

---

## Step 4: Jira Execution (ONLY AFTER APPROVAL)
**Tool:** `mcp_atlassian_createJiraIssue`

**Parameters:**
* **cloudId:** "05769d83-6239-4970-a08d-1c7d364996cd"
* **projectKey:** "QET"
* **issueTypeName:** "Test"
* **summary:** [Test Summary from Step 2]
* **description:** [Formatted Pre-conditions and Test Steps Table]
* **additionalFields:**
```json
{
  "labels": ["design-based", "automation-ready", "x-ray-test"],
  "parent": {
    "key": "QET-15"
  }
}