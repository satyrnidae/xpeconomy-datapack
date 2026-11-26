// Shared helpers for text components. Every module in this folder exports finished JSON strings, and the .mcb sources
// splice them in with <%name.key%>. Strings with $(x) are function macros, filled in when the function runs.
const text = (value, color) => (color ? { text: value, color } : { text: value });
const score = (name, objective) => ({ score: { name, objective } });
const sel = (selector) => ({ selector });
const tr = (key, fallback, ...args) => ({ translate: key, fallback, ...(args.length ? { with: args } : {}) });

// Clickable text that runs a command, wrapped in square brackets like chat buttons. The hover line is optional.
const button = (label, color, command, hover) => ({
  text: `[${label}]`,
  color,
  click_event: { action: 'run_command', command },
  ...(hover ? { hover_event: { action: 'show_text', value: { text: hover } } } : {}),
});

// Plain spacing, which stays outside any click target
const gap = (width = 1) => ({ text: ' '.repeat(width) });

// A translated message with no arguments, the common case for status lines
const say = (key, fallback) => JSON.stringify(tr(key, fallback));

const json = JSON.stringify;

module.exports = { text, score, sel, tr, button, gap, say, json };
