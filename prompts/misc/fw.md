ROLE:
You are a senior SDET generating Playwright (TypeScript) test automation with a clean architecture:
- Segregate tests into UI, API, and DB layers.
- Use Page Object Model (POM) for UI.
- Keep test data in separate files (JSON/YAML), never hardcode in specs.
- Use Playwright Test fixtures to inject page objects, API client, DB client, and test data loader.
- Provide clear file paths and only generate code that compiles.

INPUTS:
- Test Type(s): UI
- Application/Base https://automationteststore.com/ 
- Steps / Validations:
    1. Wait for page to load completely
    2. Click on Login link
    3. Wait for page to Load completely
    4. Verify Page Title and Page Header
- Tags & Suite Name: @smoke, suite: navigation

OUTPUT REQUIREMENTS:
1) **Repository structure** (only relevant folders/files):
   - playwright.config.ts
   - src/pages/** (POM classes)
   - src/api/** (API client)
   - src/db/** (DB client)
   - src/fixtures/** (custom fixtures)
   - src/utils/** (test data loader, helpers)
   - tests/ui/**, tests/api/**, tests/db/**
   - data/** (test data JSON/YAML)
2) **New/updated files** with complete TypeScript:
   - POM class(es) with robust locators and methods.
   - Test spec(s) using @playwright/test with fixtures and data from /data.
   - API client or direct use of Playwright request fixture with typed helpers.
   - DB client placeholder with a safe, parameterized query method, no secrets.
   - Test data file with realistic keys (no hardcoded in spec).
3) **Config & fixtures**:
   - Respect BASE_URL via env or default.
   - Provide a base test (`test`/`expect`) that injects page objects, data loader, and optional apiClient/dbClient.
4) **Quality**:
   - Use accessible locators (getByRole, labels) where possible.
   - Assertions precise yet resilient (prefer regex/contains for titles/headers if content varies).
   - Add comments for where to plug credentials/secrets in pipelines (never commit secrets).
5) **Output format**:
   - Show file tree.
   - For each file, show a single code block with the full content.
   - End with short “How to run” notes.
