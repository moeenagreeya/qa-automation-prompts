Generate a Playwright UI test using POM and separate data.

Inputs:
- Base URL: https://automationteststore.com/ 
- Test Case: Register
- Steps & Expected Results:
1. Wait for page to load completely
2. Click on Login link
3. Wait for page to Load completely

Constraints:
- Create/Update POM(s) in src/pages/**.
- Create tests/ui/{{feature}}.spec.ts using fixtures (test-base).
- Load expectations from /data/{{file}}.json (no literals in spec).
- Use getByRole/getByLabel selectors; stable assertions.

Output:
- File tree.
- Full code blocks for updated/created files.
- Short run commands for just this spec.
