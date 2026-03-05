# _jira-payload.md
# PARTIAL — Do not use standalone. Included via @include in main prompts.
# Defines Jira API field structure using ADF and execution rules.

## Jira Issue Creation

**MCP Tool:** `{{jira.mcp_tool}}`

### Parameters per Issue

Pass `description` as an **Atlassian Document Format (ADF)** object.

**CRITICAL — never use these broken patterns:**
- ❌ `{ "format": "wiki", "content": "h3. ..." }` — Jira ignores this wrapper entirely, saves raw text
- ❌ Raw markdown (`**bold**`, `## heading`, `| table |`) — renders as literal characters
- ❌ Wiki markup (`h3.`, `||header||`) inside ADF — only valid in legacy Jira Server REST v2

**Always use this ADF structure:**

```json
{
  "cloudId": "{{jira.cloud_id}}",
  "projectKey": "{{jira.project_key}}",
  "issueTypeName": "{{jira.issue_type}}",
  "summary": "TC-[NNN]: [Test Case Summary]",
  "description": {
    "type": "doc",
    "version": 1,
    "content": [
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [{ "type": "text", "text": "Pre-conditions" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "[Pre-condition text]" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [{ "type": "text", "text": "Test Steps" }]
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
        "content": [{ "type": "text", "text": "Post-conditions" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "[Post-condition text]" }]
      },
      {
        "type": "heading",
        "attrs": { "level": 3 },
        "content": [{ "type": "text", "text": "Figma Reference" }]
      },
      {
        "type": "paragraph",
        "content": [{ "type": "text", "text": "[Screen-N, component name or position]" }]
      }
    ]
  },
  "additionalFields": {
    "priority": { "name": "[Critical|High|Medium|Low]" },
    "labels": ["{{jira.labels[0]}}", "{{jira.labels[1]}}", "{{jira.labels[2]}}", "{{jira.labels[3]}}"],
    "parent": { "key": "{{jira.epic}}" }

    // X-RAY FIELDS — commented out by default because field IDs are instance-specific.
    // To enable: find your real field IDs at https://your-domain.atlassian.net/rest/api/3/field
    // then uncomment and replace the field names below.
    //
    // "customfield_XXXXX": "Manual",          // X-ray Test Type   (search for "test-type-field")
    // "customfield_YYYYY": "{{jira.test_repo_folder}}"  // X-ray Test Repo   (search for "test-repo-folder-field")
  }
}
```

---

### ADF Building Rules

When generating the description for each test case, build the ADF
object dynamically following these rules exactly:

**Required sections — always in this order:**
1. Pre-conditions (heading level 3 + paragraph)
2. Test Steps (heading level 3 + table)
3. Post-conditions (heading level 3 + paragraph)
4. Figma Reference (heading level 3 + paragraph)

**Table structure rules:**
- First row always uses `tableHeader` nodes
- All subsequent rows use `tableCell` nodes
- Every cell must wrap its content: tableCell → paragraph → text
- Never put a raw string directly inside a tableCell or tableHeader

**Correct cell structure:**
```json
{
  "type": "tableCell",
  "content": [{
    "type": "paragraph",
    "content": [{ "type": "text", "text": "your text here" }]
  }]
}
```

**Text formatting within any node:**

| Need | ADF pattern |
|---|---|
| Plain text | `{ "type": "text", "text": "value" }` |
| Bold | `{ "type": "text", "text": "value", "marks": [{ "type": "strong" }] }` |
| Inline code | `{ "type": "text", "text": "P@ssw0rd!", "marks": [{ "type": "code" }] }` |

**Multi-step tables:** Add one complete `tableRow` per test step.

**Special characters:** JSON-escape all values in `"text"` fields:
quotes → `\"`, backslash → `\\`

---

### Execution Rules

- Create issues **sequentially**, not in parallel
- After each **successful** creation, immediately log:
  `✅ TC-[NNN] → [JIRA-KEY] created — [URL]`
- After each **failure**, log the full error:
  `❌ TC-[NNN] → FAILED: "[error message]" — skipping, continuing with next`
- **Never abort** the entire batch due to a single failure
- **Never create** issues before Stage 3 approval is received

### Stage 4 Completion Summary

After all issues are processed, output this table:

| TC-ID | Summary | Jira Key | URL | Status |
|-------|---------|----------|-----|--------|
| TC-001 | [summary] | {{jira.project_key}}-42 | [link] | ✅ Created |
| TC-003 | [summary] | — | — | ❌ Failed |

Then state: **total created**, **total failed**, and remediation steps for any failures.

---

### X-ray Custom Fields — How to Enable

The fields `customfield_xray_test_type` and `customfield_xray_test_repo_folder`
are commented out by default because their IDs are **unique per Jira instance**
and must be on the project's Create screen before they can be set.

#### Step 1 — Find your real field IDs

Open this URL in your browser while logged into Jira:

```
https://YOUR-DOMAIN.atlassian.net/rest/api/3/field
```

Search the JSON response (`Ctrl+F`) for `xray`. You will find entries like:

```json
{ "id": "customfield_10058", "name": "Test Type",
  "schema": { "custom": "com.xpandit.xray:test-type-field" } },
{ "id": "customfield_10061", "name": "Test Repository Folder",
  "schema": { "custom": "com.xpandit.xray:test-repo-folder-field" } }
```

Note the `id` values — those are your real field names.

#### Step 2 — Add fields to the Create screen

If you get a "not on the appropriate screen" error even with correct IDs:

1. **Jira Settings** (cog) → **Issues** → **Screens**
2. Find the screen used by your project's **Create Issue** operation
3. Click the screen name → **Add Field**
4. Search for `Test Type` and `Test Repository Folder` → Add both
5. Save

#### Step 3 — Update config.yaml

Add your real field IDs to `config.yaml`:

```yaml
jira:
  xray_test_type_field:   "customfield_10058"   # replace with your real ID
  xray_test_repo_field:   "customfield_10061"   # replace with your real ID
```

#### Step 4 — Uncomment the fields in this file

Find the commented-out lines in the `additionalFields` block above and
replace `customfield_XXXXX` / `customfield_YYYYY` with your real IDs:

```json
"customfield_10058": "Manual",
"customfield_10061": "{{jira.test_repo_folder}}"
```

Then run `npm run build:xray` to rebuild.