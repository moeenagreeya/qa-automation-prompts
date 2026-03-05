# _stage3-approval.md
# PARTIAL — Do not use standalone. Included via @include in main prompts.
# Stage 3: Preview, review, and approval gate before any Jira execution.

## Stage 3: Preview & Approval Gate

Present ALL sections below in full before taking any further action.
Do NOT proceed to Stage 4 under any circumstances until "APPROVED"
is received in writing.

### 3a. Coverage Summary Table

| TC-ID | Summary | Category | Priority | # Steps | Complexity |
|-------|---------|----------|----------|---------|------------|
| TC-001 | [summary] | [category] | [priority] | [n] | [Low/Med/High] |

After the table, state the total count per category and confirm
all coverage minimums from the requirements have been met.

### 3b. Full Detail View

Render every test case in full using the exact structure defined
in the test case template. Do not summarise or truncate.

### 3c. ⚠️ Assumptions & Ambiguities

List every inference made due to visual ambiguity, missing design
states, or low image resolution. Format each item as:

> `⚠️ [Component / Screen area]: [What was assumed and why]`

If no ambiguities exist, render:
> `✅ No ambiguities detected — all test cases derived from visible design elements.`

### 3d. Approval Checklist

Ask ALL of the following questions and wait for answers before proceeding:

1. Is the test coverage complete, or are any user flows or screens missing?
2. Should any test cases be split, merged, or reprioritised?
3. Should negative/error test cases be expanded with additional scenarios?
4. Are there any test cases that should be marked `Generic`
   (automation-ready) instead of `Manual`?
5. Are the inferred assumptions in 3c acceptable, or do they need correction?
6. **Type "APPROVED" to proceed to Jira creation, or provide change
   requests and this stage will repeat.**

---

### Approval Loop Rules

**On receiving "APPROVED":** Proceed immediately to Stage 4.

**On receiving change requests:**
1. Apply ALL requested changes to the test cases
2. Re-render the complete Stage 3 output (3a through 3d)
3. Request approval again
4. Do NOT proceed to Stage 4 until "APPROVED" is explicitly received

**On receiving partial approval** (e.g., "approve all except TC-005"):
1. Note which test cases are excluded
2. Confirm the exclusion list with the user
3. Proceed to Stage 4 for approved cases only
4. Mark excluded cases as `[EXCLUDED — pending revision]` in the
   Stage 4 completion summary