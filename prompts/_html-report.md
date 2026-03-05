# _html-report.md
# PARTIAL — Do not use standalone. Included via @include in main prompts.
# Generic HTML report shell — pipeline-agnostic.
# Always pair with a context partial:
#   Figma pipeline:  @include prompts/_report-context-figma.md
#   Story pipeline:  @include prompts/_report-context-story.md

## HTML Summary Report

Generate a single self-contained HTML file with a timestamped filename.

The filename uses **UTC time** so it is identical regardless of who opens
or shares the report. Format: `{{report.output_filename_prefix}}-YYYYMMDD-HHmmssZ.html`
(the trailing `Z` signals UTC explicitly).

```javascript
// Filename timestamp — always UTC, always unambiguous
const now      = new Date();
const pad      = n => String(n).padStart(2, '0');
const datePart = now.getUTCFullYear().toString()
               + pad(now.getUTCMonth() + 1)
               + pad(now.getUTCDate());
const timePart = pad(now.getUTCHours())
               + pad(now.getUTCMinutes())
               + pad(now.getUTCSeconds());
const filename = `{{report.output_filename_prefix}}-${datePart}-${timePart}Z.html`;
// e.g. → test-report-20260305-090022Z.html  (UTC, not local time)
```

Use the computed filename in `<title>`, the report header, the footer,
and the final confirmation message.

---

### Technical Constraints

- **Self-contained:** All CSS and JS inline — no external file references
- **Approved CDN libraries only:**
  - Chart.js: `{{report.cdn.chartjs}}`
  - Google Fonts: `{{report.fonts.google_url}}`
- **No frameworks** — vanilla HTML, CSS, and JS only
- **Print-friendly** — include `@media print` styles so the file exports
  cleanly to PDF via browser File → Print → Save as PDF

---

### Design System

Apply this token set consistently throughout the report:

```css
:root {
  --color-primary:        {{report.colors.primary}};
  --color-primary-light:  {{report.colors.primary_light}};
  --color-success:        {{report.colors.success}};
  --color-warning:        {{report.colors.warning}};
  --color-danger:         {{report.colors.danger}};
  --color-neutral:        {{report.colors.neutral}};
  --color-text:           {{report.colors.text}};
  --color-text-secondary: {{report.colors.text_secondary}};
  --color-border:         {{report.colors.border}};
  --color-surface:        {{report.colors.surface}};
  --font-sans:  '{{report.fonts.sans}}', sans-serif;
  --font-mono:  '{{report.fonts.mono}}', monospace;
  --radius-sm:  {{report.border_radius.sm}};
  --radius-md:  {{report.border_radius.md}};
  --radius-lg:  {{report.border_radius.lg}};
  --shadow-sm:  {{report.shadows.sm}};
  --shadow-md:  {{report.shadows.md}};
}

.badge-critical { background: {{priorities.critical.badge_bg}}; color: {{priorities.critical.badge_text}}; }
.badge-high     { background: {{priorities.high.badge_bg}};     color: {{priorities.high.badge_text}}; }
.badge-medium   { background: {{priorities.medium.badge_bg}};   color: {{priorities.medium.badge_text}}; }
.badge-low      { background: {{priorities.low.badge_bg}};      color: {{priorities.low.badge_text}}; }
.badge-pass     { background: #E3FCEF; color: #006644; }
.badge-fail     { background: #FFEBE6; color: #BF2600; }
```

---

### Filename & Timezone Script

Include this script block verbatim inside `<head>` of the generated HTML:

```html
<script>
  const _now = new Date();
  const _pad = n => String(n).padStart(2, '0');

  // UTC parts — filename is always UTC so it never changes between timezones
  const _fd = _now.getUTCFullYear().toString()
            + _pad(_now.getUTCMonth() + 1)
            + _pad(_now.getUTCDate());
  const _ft = _pad(_now.getUTCHours())
            + _pad(_now.getUTCMinutes())
            + _pad(_now.getUTCSeconds());
  const REPORT_FILENAME = `{{report.output_filename_prefix}}-${_fd}-${_ft}Z.html`;

  // Local display — time + IANA tz name + numeric UTC offset
  // e.g. "05 Mar 2026, 14:30:22 IST (UTC+5:30)"
  const _localStr = _now.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const _tzName    = new Intl.DateTimeFormat('en', { timeZoneName: 'short' })
                       .formatToParts(_now).find(p => p.type === 'timeZoneName')?.value || '';
  const _offMin    = -_now.getTimezoneOffset();
  const _offSign   = _offMin >= 0 ? '+' : '-';
  const _offAbs    = Math.abs(_offMin);
  const _offHrs    = Math.floor(_offAbs / 60);
  const _offMins   = _offAbs % 60;
  const _utcOffset = `UTC${_offSign}${_offHrs}${_offMins ? ':' + _pad(_offMins) : ''}`;
  const REPORT_TIMESTAMP_LOCAL = `${_localStr} ${_tzName} (${_utcOffset})`;

  // UTC display — shown alongside local to remove all ambiguity
  // e.g. "05 Mar 2026, 09:00:22 UTC"
  const REPORT_TIMESTAMP_UTC = _now.toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'UTC'
  }) + ' UTC';

  document.title = REPORT_FILENAME;

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-filename]')
      .forEach(el => el.textContent = REPORT_FILENAME);
    document.querySelectorAll('[data-timestamp]')
      .forEach(el => el.textContent = REPORT_TIMESTAMP_LOCAL);
    document.querySelectorAll('[data-timestamp-utc]')
      .forEach(el => el.textContent = REPORT_TIMESTAMP_UTC);
  });
</script>
```

**Timestamp HTML elements — use these wherever dates appear:**

```html
<span data-timestamp></span>
<!-- "05 Mar 2026, 14:30:22 IST (UTC+5:30)" -->

<small data-timestamp-utc style="color:var(--color-text-secondary)"></small>
<!-- "05 Mar 2026, 09:00:22 UTC" -->

<span data-filename></span>
<!-- "test-report-20260305-090022Z.html" -->
```

Always render **both timestamps stacked** in the report header:
```
Generated: 05 Mar 2026, 14:30:22 IST (UTC+5:30)
           05 Mar 2026, 09:00:22 UTC
```

---

### Fixed Report Structure (all pipelines)

The sections below are identical regardless of which pipeline generated
the report. The context partial (included separately) fills in the
pipeline-specific header subtitle, KPI card values, and any extra sections.

---

#### Header (populated by context partial)

```html
<header>
  <div class="header-left">
    <h1>[REPORT_TITLE from context]</h1>
    <p class="subtitle">[SUBTITLE from context]</p>
  </div>
  <div class="header-right">
    <span class="status-badge">[STATUS]</span>
    <div class="timestamps">
      <span data-timestamp></span>
      <small data-timestamp-utc></small>
    </div>
  </div>
</header>
```

---

#### Section 1 — KPI Summary Cards

Render the cards defined in the context partial in a responsive grid
(2×2 on mobile, N×1 on desktop where N = number of cards).

Each card structure:
```html
<div class="kpi-card">
  <span class="kpi-icon">[icon]</span>
  <span class="kpi-value">[number]</span>
  <span class="kpi-label">[label]</span>
</div>
```

---

#### Section 2 — Coverage Charts

Three Chart.js charts in a responsive row (stack on mobile).
Chart data and labels are defined in the context partial.

**Chart 1 — Doughnut: Test Cases by Category**
Show count in doughnut centre on hover. Minimal legend below.

**Chart 2 — Vertical Bar: Test Cases by Priority**
X-axis: Critical · High · Medium · Low
Y-axis: integer ticks only. Bar colours match badge tokens.
Count label above each bar.

**Chart 3 — Horizontal Bar: Complexity Distribution**
Rows: Low · Medium · High
Count + percentage at end of each bar.
Low = `{{report.colors.success}}` · Medium = `{{report.colors.warning}}` · High = `{{report.colors.danger}}`

All charts: responsive, no borders, clean axis labels.

---

#### Section 3 — Warnings & Assumptions Panel

**If warnings/assumptions exist:**
Amber panel with `⚠️` prefix per item.

**If none:**
Green banner: `✅ [Pipeline-specific clean message from context partial]`

---

#### Section 4 — Test Case Catalog Table

Sortable, filterable, interactive table.

**Columns:** TC-ID · Summary · Category · Priority · Steps · Complexity · Jira Key · Status

**Behaviour:**
- Real-time text filter across TC-ID and Summary (case-insensitive)
- Click column header to sort ▲; click again to sort ▼
- Priority and Status as colored badges
- Jira Key as `<a target="_blank">` link if created, `—` if failed
- Alternating row background using `--color-neutral`
- Sticky header on scroll

---

#### Section 5 — Test Case Detail Accordion

One collapsible panel per test case.

**Collapsed:** TC-ID · Summary · Priority badge · Status badge · Jira Key link

**Expanded:**
- Pre-conditions block (`--color-neutral` background)
- Steps table: Step · Action · Test Data · Expected Result
- Post-conditions block (`--color-neutral` background)
- Source reference line in `--font-mono`
  *(Figma: "Screen-N, component" · Story: "AC-N — [text]")*

**Behaviour:**
- One panel open at a time
- Smooth CSS height transition
- "Expand All" / "Collapse All" buttons above

---

#### Section 6 — Creation Log

Monospace terminal panel (dark background, light text):

```
[HH:MM:SS]  ✅  TC-001  →  {{jira.project_key}}-42  created successfully
[HH:MM:SS]  ❌  TC-003  →  FAILED: "[error message]"
────────────────────────────────────────────────────────
Total: N processed  ·  N created  ·  N failed
```

---

#### Pipeline-Specific Sections

Insert any sections defined in the context partial here —
e.g. AC Coverage Heatmap (Story pipeline) or Screen Analysis
Summary (Figma pipeline).

---

#### Footer

```html
<footer>
  <span>[PIPELINE_CREDIT from context partial]</span>
  <button onclick="window.print()">🖨️ Export as PDF</button>
  <small><span data-filename></span></small>
</footer>
```

---

### Final Output Instruction

After generating the HTML file confirm:
> "`{{report.output_filename_prefix}}-YYYYMMDD-HHmmssZ.html` generated successfully.
> Open in Chrome or Firefox. Use File → Print → Save as PDF to export."

State the exact UTC filename, e.g.:
> "`test-report-20260305-090022Z.html` generated successfully."