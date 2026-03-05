# MCP Prompt: Jira Story-to-Xray Test Suite (Jira-Optimized)

**Role:** You are an SDET Automation Architect using the Atlassian/Jira MCP toolset.

## Phase 1: Context Extraction

1. **Target Issue:** Use the `get_issue` tool for **QET-27**.
2. **Data Extraction:** Retrieve `Summary`, `Description`, `Acceptance Criteria` (check custom fields), `Labels`, and `Project Key`.
3. **Safety Constraint:** Do **not** map the `Sprint` or `Fix Versions` fields during creation to avoid `Field 'sprint' is not editable` or type-mismatch errors.

## Phase 2: Test Case Generation & Review (PAUSE HERE)

Generate a list of test cases in **Xray-compatible format** for my review. **Do NOT call any "create" tools yet.**

**Test Case Standards:**

* **Traceability:** Map every test case to a specific **AC#** from QET-27.
* **Structure:** Action vs. Expected Result.
* **Coverage:** Functional, Negative, Edge Case, and Accessibility.

**Output Format for Review:**
| ID | Category | Step: Action | Step: Expected Result |
| :--- | :--- | :--- | :--- |
| TC-01 | Functional | `Maps to Login` | `Login screen is visible` |

---

### Phase 3: Jira Interaction (Upon Approval)

Once I provide approval, use the `create_issue` tool for each test case using these parameters:

* **Project:** QET
* **Issue Type:** **Test**
* **Summary:** `[Xray] QET-27 | <Category> | <Title>`
* **Labels:** Carry over all labels from QET-27 and add `xray-automated`, `mcp-generated`.
* **Description:** Use the following template to ensure high readability:

```markdown
# 🔗 Traceability
* **Source Requirement:** [QET-27|https://your-domain.atlassian.net/browse/QET-27]
* **Acceptance Criteria:** AC# <AC#>

---

# 📝 Test Steps (Xray)
|| Step || Action || Expected Result ||
| 1 | <Action 1> | <Expected Result 1> |
| 2 | <Action 2> | <Expected Result 2> |

---

# 🤖 Automation Strategy (Playwright)
> **Goal:** Ensure resilient execution using best-practice locators.

### Recommended Locators
* **Target Element:** `page.getByRole('button', { name: 'Submit' })`
* **Test ID:** `data-testid="login-submit"`

### Assertion Logic
* [ ] Verify network response 200 OK for `/api/v1/login`.
* [ ] Validate visibility of the dashboard header after navigation.

```

* **Linking:** Use the `add_issue_link` tool to link the new Test to **QET-27** using the **"Tests"** (inward) or **"tested by"** (outward) link type.

---

## Phase 4: Final Verification
Return a summary table of the newly created **Xray Test Keys** and a confirmation status of the link to QET-27.
