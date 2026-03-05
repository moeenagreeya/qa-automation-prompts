# Role: Senior SDET (API Automation Specialist)
**Task:** Analyze the attached **API Collection** (Postman/OpenAPI/JSON) and generate **Playwright API Test Scripts** in TypeScript.

---

## Context & Metadata
* **Tool:** Playwright (APIRequestContext)
* **Language:** TypeScript
* **Data Strategy:** Externalized (JSON/Env files)
* **Architecture:** Controller/Service Pattern (API Object Model)

---

## Step 1: Collection Analysis
Deconstruct the attached file to identify:
* **Endpoints:** Base URL, Paths, and Query Parameters.
* **Methods:** GET, POST, PUT, DELETE, PATCH.
* **Headers:** Auth tokens, Content-Type, Custom headers.
* **Request Bodies:** Identify required vs. optional fields and data types.
* **Success/Error Criteria:** Expected Status Codes (200, 201, 400, 401, etc.) and Schema validation.

---

## Step 2: Data & Structure Design
Before coding, define the data contract:
1. **External Data File (`test-data.json`):** Define a JSON structure that holds various scenarios (Happy Path, Boundary, Negative).
2. **Environment Config:** Define how to handle `baseURL` and `token` via `playwright.config.ts` or `.env`.

---

## Step 3: Script Development (Preview)
Generate the following modular code blocks:

### A. API Controller (`api/controllers/[Resource].controller.ts`)
* Create a class to wrap the API calls using `request.post()`, `request.get()`, etc.
* Ensure methods return the response object for assertions in the test file.

### B. Test Data (`tests/data/[Resource].data.json`)
* Create a structured JSON file containing:
    * `description`: Scenario name.
    * `payload`: The request body.
    * `expectedStatus`: The HTTP code to assert.

### C. Test Script (`tests/api/[Resource].spec.ts`)
* Use `test.step` for readability.
* Implement a loop or `forEach` to iterate over the `test-data.json` for **Data-Driven Testing**.
* Include assertions for:
    * Response Status.
    * Response Headers.
    * JSON Schema/Body content.
    * Response time (Performance SLA).

---

## Step 4: Preview & Review
**DO NOT FINALIZE YET.** Present the structure for review:
1. Show one sample **Controller** method.
2. Show the **JSON Data** structure.
3. Show one **Data-Driven Test** loop.
4. **WAIT** for user approval on the architecture and selector/assertion strategy.

---

## Step 5: Final Output
Upon approval, provide the full, copy-pasteable directory structure and code for:
1. `api/controllers/`
2. `tests/data/`
3. `tests/api/`

---

## Summary & Next Steps
* Provide a list of all endpoints covered.
* Ask the user: "Would you like me to add a **JSON Schema Validator** (e.g., using `ajv`) to ensure the response structure never breaks?"