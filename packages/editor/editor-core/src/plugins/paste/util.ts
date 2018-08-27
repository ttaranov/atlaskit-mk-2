export function isPastedFromWord(event: ClipboardEvent): boolean {
  const html = event.clipboardData.getData('text/html');
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:office') >= 0;
}

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
    if (/[:;]$/.test(line)) {
      weight++;
    }
    // Contains second and third braces
    if (/[{}\[\]]/.test(line)) {
      weight++;
    }
    // Contains <tag> or </
    if (/<\w+>/.test(line) || /<\//.test(line)) {
      weight++;
    }
    // Contains () <- function calls
    if (/\(\)/.test(line)) {
      weight++;
    }
    // Contains a link
    if (/(^|[^!])\[(.*?)\]\((\S+)\)$/.test(line)) {
      weight--;
    }
    // New line starts with less than two chars. e.g- if, {, <, etc
    const token = /^(\s+)[a-zA-Z<{]{2,}/.exec(line);
    if (token && 2 <= token[1].length) {
      weight++;
    }
    if (/&&/.test(line)) {
      weight++;
    }
  });
  return 4 <= weight && weight >= 0.5 * lines.length;
}

// @see https://product-fabric.atlassian.net/browse/ED-3159
// @see https://github.com/markdown-it/markdown-it/issues/38
export function escapeLinks(text) {
  return text.replace(/(\[([^\]]+)\]\()?((https?|ftp):\/\/[^\s]+)/g, str => {
    return str.match(/^(https?|ftp):\/\/[^\s]+$/) ? `<${str}>` : str;
  });
}
