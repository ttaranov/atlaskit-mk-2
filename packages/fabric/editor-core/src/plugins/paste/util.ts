import { Schema } from 'prosemirror-model';

export const isSingleLine = (text: string): boolean => {
  return !!text && text.trim().split('\n').length === 1;
};

// TODO: Write JEST tests for this part
export function isCode(str) {
  const lines = str.split(/\r?\n|\r/);
  if (3 > lines.length) {
    return false;
  }
  let weight = 0;
  lines.forEach(line => {
    // Ends with : or ;
    if (/[:;]$/.test(line)) { weight++; }
    // Contains second and third braces
    if (/[{}\[\]]/.test(line)) { weight++; }
    // Contains <tag> or </
    if ((/<\w+>/.test(line) || /<\//.test(line))) { weight++; }
    // Contains () <- function calls
    if (/\(\)/.test(line)) { weight++; }
    // New line starts with less than two chars. e.g- if, {, <, etc
    const token = /^(\s+)[a-zA-Z<{]{2,}/.exec(line);
    if (token && 2 <= token[1].length) { weight++; }
    if (/&&/.test(line)) { weight++; }
  });
  return 4 <= weight && weight >= 0.5 * lines.length;
}

export function filterMdToPmSchemaMapping(schema: Schema, map) {
  return Object.keys(map).reduce((newMap, key) => {
    const value = map[key];
    const block = value.block || value.node;
    const mark = value.mark;
    if ((block && schema.nodes[block]) || (mark && schema.marks[mark])) {
      newMap[key] = value;
    }
    return newMap;
  }, {});
}
