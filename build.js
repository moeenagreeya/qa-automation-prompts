#!/usr/bin/env node
// scripts/build.js
// Assembles prompt files from /prompts into /dist
// by resolving @include directives and injecting {{variable}} placeholders.
//
// Usage:
//   node scripts/build.js                      → builds all prompts
//   node scripts/build.js figma-to-xray        → builds one prompt
//   node scripts/build.js --check              → validates config + includes only
//
// Requirements: Node.js 18+, js-yaml (npm install)
// CommonJS version — works without "type": "module" in package.json

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── Config loader ─────────────────────────────────────────────────────────────

function loadConfig(filePath) {
  // Try js-yaml first (installed via npm install)
  try {
    const yaml = require('js-yaml');
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw new Error(`YAML parse error in config.yaml:\n  ${e.message}`);
    }
  }

  // Fallback: look for config.json next to config.yaml
  const jsonPath = filePath.replace('.yaml', '.json');
  if (fs.existsSync(jsonPath)) {
    console.log('  ℹ️  js-yaml not found — falling back to config.json');
    return JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  }

  throw new Error(
    'Could not load config.\n' +
    '  Option A: run "npm install" to install js-yaml\n' +
    '  Option B: create config.json alongside config.yaml'
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function flattenConfig(obj, prefix) {
  prefix = prefix || '';
  // Flattens { jira: { cloud_id: 'x' } } → { 'jira.cloud_id': 'x' }
  return Object.keys(obj).reduce(function (acc, key) {
    var val     = obj[key];
    var fullKey = prefix ? (prefix + '.' + key) : key;

    if (Array.isArray(val)) {
      val.forEach(function (item, i) {
        acc[fullKey + '[' + i + ']'] = String(item);
      });
      acc[fullKey] = val.join(', ');
    } else if (val !== null && typeof val === 'object') {
      Object.assign(acc, flattenConfig(val, fullKey));
    } else {
      acc[fullKey] = String(val != null ? val : '');
    }
    return acc;
  }, {});
}

function injectVariables(content, flatConfig) {
  var missing = [];
  var result  = content.replace(/\{\{([\w.\[\]]+)\}\}/g, function (match, key) {
    if (Object.prototype.hasOwnProperty.call(flatConfig, key)) {
      return flatConfig[key];
    }
    missing.push(key);
    return '[MISSING: ' + key + ']';
  });
  return { result: result, missing: missing };
}

function resolveIncludes(content, depth) {
  depth = depth || 0;
  if (depth > 10) {
    throw new Error('Max include depth (10) exceeded — circular include detected');
  }

  return content.replace(
    /<!--\s*@include\s+([\w./_-]+)\s*-->/g,
    function (_, includePath) {
      // Support both forward and back slashes on Windows
      var normalised = includePath.replace(/\//g, path.sep);
      var absPath    = path.resolve(ROOT, normalised);

      if (!fs.existsSync(absPath)) {
        console.warn('  ⚠️   Include not found: ' + includePath);
        return '<!-- MISSING INCLUDE: ' + includePath + ' -->';
      }

      var included = fs.readFileSync(absPath, 'utf8');
      return resolveIncludes(included, depth + 1);
    }
  );
}

// ── Build ─────────────────────────────────────────────────────────────────────

function buildPrompt(promptName, flatConfig, checkOnly) {
  var srcPath  = path.join(ROOT, 'prompts', promptName + '.md');
  var distPath = path.join(ROOT, 'dist',    promptName + '.md');

  if (!fs.existsSync(srcPath)) {
    console.error('  ❌  Source not found: prompts/' + promptName + '.md');
    return false;
  }

  var content = fs.readFileSync(srcPath, 'utf8');

  // Step 1: Resolve @include directives
  content = resolveIncludes(content);

  // Step 2: Inject {{variables}}
  var injected = injectVariables(content, flatConfig);

  if (injected.missing.length > 0) {
    console.warn('  ⚠️   ' + promptName + ': ' + injected.missing.length + ' missing variable(s):');
    injected.missing.forEach(function (k) {
      console.warn('       • {{' + k + '}}');
    });
  }

  if (checkOnly) {
    var status = injected.missing.length === 0 ? '✅' : '⚠️ ';
    console.log('  ' + status + '  ' + promptName + ' — ' + injected.missing.length + ' missing variable(s)');
    return injected.missing.length === 0;
  }

  // Step 3: Write to dist/
  fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
  fs.writeFileSync(distPath, injected.result, 'utf8');

  var lines = injected.result.split('\n').length;
  var kb    = (Buffer.byteLength(injected.result, 'utf8') / 1024).toFixed(1);
  console.log('  ✅  ' + promptName + '.md → dist/ (' + lines + ' lines, ' + kb + ' KB)');
  return true;
}

// ── Main ──────────────────────────────────────────────────────────────────────

function main() {
  var args      = process.argv.slice(2);
  var checkOnly = args.indexOf('--check') !== -1;
  var target    = args.find(function (a) { return !a.startsWith('--'); });

  console.log('\n🔨  QA Prompts Build\n');

  // Load config
  var config;
  try {
    config = loadConfig(path.join(ROOT, 'config.yaml'));
    console.log('  ✅  config.yaml loaded\n');
  } catch (err) {
    console.error('  ❌  Failed to load config:\n     ' + err.message + '\n');
    process.exit(1);
  }

  var flatConfig = flattenConfig(config);

  // Discover master prompt files (no leading underscore = not a partial)
  var promptFiles = fs.readdirSync(path.join(ROOT, 'prompts'))
    .filter(function (f) { return f.endsWith('.md') && !f.startsWith('_'); })
    .map(function (f) { return f.replace('.md', ''); });

  var toProcess = target
    ? promptFiles.filter(function (p) { return p === target; })
    : promptFiles;

  if (toProcess.length === 0) {
    console.error('  ❌  No prompt found matching: ' + target);
    console.error('  Available prompts: ' + promptFiles.join(', '));
    process.exit(1);
  }

  var allPassed = true;
  toProcess.forEach(function (name) {
    var ok = buildPrompt(name, flatConfig, checkOnly);
    if (!ok) allPassed = false;
  });

  console.log('');

  if (checkOnly) {
    console.log(allPassed
      ? '✅  All prompts valid — no missing variables.\n'
      : '⚠️   Some prompts have missing variables. Update config.yaml.\n'
    );
  } else {
    console.log('📁  Output: ' + path.join(ROOT, 'dist') + path.sep + '\n');
    console.log('Next step: copy the assembled .md file from dist/ and paste into Claude.\n');
  }

  process.exit(allPassed ? 0 : 1);
}

main();