export function isPastedFromWord(html?: string): boolean {
  return !!html && html.indexOf('urn:schemas-microsoft-com:office:office') >= 0;
}

export function isPastedFromDropboxPaper(html?: string): boolean {
  return !!html && !!html.match(/class=\"\s?author-d-.+"/gim);
}

export function isPastedFromGoogleDocs(html?: string): boolean {
  return !!html && !!html.match(/id=\"docs-internal-guid-.+"/gim);
}

export function isPastedFromGoogleSpreadSheets(html?: string): boolean {
  return !!html && !!html.match(/data-sheets-.+=/gim);
}

export function isPastedFromPages(html?: string): boolean {
  return !!html && html.indexOf('content="Cocoa HTML Writer"') >= 0;
}

export function isPastedFromFabricEditor(html?: string): boolean {
  return !!html && html.indexOf('data-pm-slice="') >= 0;
}

export const isSingleLine = (text: string): boolean => {
  return !!text && text.trim().split('\n').length === 1;
};

export function getPasteSource(event: ClipboardEvent): string {
  const html = event.clipboardData.getData('text/html');

  if (isPastedFromDropboxPaper(html)) {
    return 'dropbox-paper';
  } else if (isPastedFromWord(html)) {
    return 'microsoft-word';
  } else if (isPastedFromGoogleDocs(html)) {
    return 'google-docs';
  } else if (isPastedFromGoogleSpreadSheets(html)) {
    return 'google-spreadsheets';
  } else if (isPastedFromPages(html)) {
    return 'apple-pages';
  } else if (isPastedFromFabricEditor(html)) {
    return 'fabric-editor';
  }

  return 'other';
}

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
