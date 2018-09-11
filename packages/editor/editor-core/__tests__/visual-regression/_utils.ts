import { getExampleUrl } from '@atlaskit/visual-regression/helper';
import { colorPalette } from '@atlaskit/editor-common';

export const escapeStr = (str: string) => {
  return `concat('${str.replace(/'/g, `', "'", '`)}', '')`;
};

export const selectByTextAndClick = async ({ page, tagName, text }) => {
  const target = await page.$x(
    `//${tagName}[contains(text(), ${escapeStr(text)})]`,
  );
  if (target.length > 0) {
    await target[0].click();
  } else {
    throw new Error(`Target element is not found: ${text}`);
  }
};

export const initEditor = async (page, appearance: string) => {
  const editor = '.ProseMirror';
  const url = getExampleUrl(
    'editor',
    'editor-core',
    appearance,
    // @ts-ignore
    global.__BASEURL__,
  );
  await page.goto(url);
  if (appearance === 'comment') {
    const placeholder = 'input[placeholder="What do you want to say?"]';
    await page.waitForSelector(placeholder);
    await page.click(placeholder);
  }

  await page.waitForSelector(editor);
  await page.click(editor);
  await page.addStyleTag({
    content: '.ProseMirror { caret-color: transparent; }',
  });
};

export const clearEditor = async page => {
  await page.evaluate(() => {
    const dom = document.querySelector('.ProseMirror') as HTMLElement;
    dom.innerHTML = '<p><br /></p>';
  });
};

export const insertTable = async page => {
  await page.click('span[aria-label="Insert table"]');
  await page.waitForSelector('table td p');
};

type CellSelectorOpts = {
  row: number;
  cell?: number;
  cellType?: 'td' | 'th';
};

export const getSelectorForTableCell = ({
  row,
  cell,
  cellType = 'td',
}: CellSelectorOpts) => {
  const rowSelector = `table tr:nth-child(${row})`;
  if (!cell) {
    return rowSelector;
  }

  return `${rowSelector} > ${cellType}:nth-child(${cell})`;
};

export const insertMenuSelector =
  'span[aria-label="Open or close insert block dropdown"]';
export const advanceFormattingMenuSelector =
  'span[aria-label="Open or close advance text formatting dropdown"]';

export const baseTests = [
  // -----------------
  // Insert menu items
  // -----------------
  {
    name: 'Block quote',
    // click selector (dropdown menu or toolbar icon)
    clickSelector: insertMenuSelector,
    // menu item selector - when given, it should match item inner text
    menuItemText: 'Block quote',
    // inserted node selector - wait for the node to be inserted
    nodeSelector: 'blockquote p',
    // is used for testing marks and typing inside content nodes
    content: 'text',
    // where to test
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Code block',
    menuItemText: 'Code block',
    clickSelector: insertMenuSelector,
    nodeSelector: 'div.code-block code',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Panel',
    menuItemText: 'Panel',
    clickSelector: insertMenuSelector,
    nodeSelector: 'div[paneltype] p',
    content: 'text',
    appearance: ['full-page'],
  },
  {
    name: 'Horizontal Rule',
    menuItemText: 'Horizontal Rule',
    clickSelector: insertMenuSelector,
    nodeSelector: 'hr',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Date',
    menuItemText: 'Date',
    clickSelector: insertMenuSelector,
    nodeSelector: 'span[timestamp]',
    appearance: ['full-page'],
  },
  {
    name: 'Columns',
    menuItemText: 'Columns',
    clickSelector: insertMenuSelector,
    nodeSelector: 'div[data-layout-type] p',
    content: 'text',
    appearance: ['full-page'],
  },

  // -----------------
  // Toolbar items
  // -----------------
  {
    name: 'Table',
    clickSelector: 'span[aria-label="Insert table"]',
    nodeSelector: 'table th p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Action',
    clickSelector: 'span[aria-label="Create action"]',
    nodeSelector: 'ol[data-task-list-local-id] div',
    content: 'text',
    appearance: ['full-page', 'message'],
  },
  {
    name: 'Decision',
    clickSelector: 'span[aria-label="Create decision"]',
    nodeSelector: 'ol[data-decision-list-local-id] div',
    content: 'text',
    appearance: ['message'],
  },
  {
    name: 'Ordered list',
    clickSelector: 'span[aria-label="Ordered list"]',
    nodeSelector: 'ol li p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Unordered list',
    clickSelector: 'span[aria-label="Unordered list"]',
    nodeSelector: 'ul li p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  Array.from(Array(6).keys()).map(key => {
    const level = key + 1;
    return {
      name: `Heading ${level}`,
      clickSelector: 'button[aria-haspopup="true"]',
      menuItemText: `Heading ${level}`,
      nodeSelector: `h${level}`,
      tagName: `h${level}`,
      content: 'text',
      appearance: ['full-page', 'comment'],
    };
  }),

  // -----------------
  // Marks
  // -----------------
  ['Italic', 'Bold'].map(key => ({
    name: key,
    clickSelector: `span[aria-label="${key}"]`,
    nodeSelector: '.ProseMirror p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  })),
  ['Underline', 'Strikethrough', 'Code', 'Subscript', 'Superscript'].map(
    key => ({
      name: key,
      menuItemText: key,
      clickSelector: advanceFormattingMenuSelector,
      nodeSelector: '.ProseMirror p',
      content: 'text',
      appearance: ['full-page', 'comment'],
    }),
  ),
  Array.from(colorPalette.values()).map(key => {
    return {
      name: `Text color: ${key}`,
      clickSelector: 'span[aria-label="Text color"]',
      menuItemSelector: `button[title="${key}"]`,
      nodeSelector: '.ProseMirror p',
      content: 'text',
      appearance: ['full-page', 'comment'],
    };
  }),

  // -----------------
  // Dropdowns
  // -----------------
  {
    name: 'Normal text dropdown',
    clickSelector: 'button[aria-haspopup="true"]',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Insert menu',
    clickSelector: insertMenuSelector,
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Advance formatting menu',
    clickSelector: advanceFormattingMenuSelector,
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Text color picker',
    clickSelector: 'span[aria-label="Text color"]',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Mention picker',
    clickSelector: 'span[aria-label="Add mention"]',
    nodeSelector: 'span[data-mention-query]',
    appearance: ['full-page', 'comment', 'message'],
  },
  {
    name: 'Hyperlink Recent Search',
    clickSelector: 'span[aria-label="Add link"]',
    appearance: ['full-page', 'comment'],
  },
];

// group tests by appearances
export const baseTestsByAppearance = {};

const addToAppearance = test => {
  test.appearance.forEach(appearance => {
    if (!baseTestsByAppearance[appearance]) {
      baseTestsByAppearance[appearance] = [];
    }
    baseTestsByAppearance[appearance].push(test);
  });
};
baseTests.forEach(test => {
  if (Array.isArray(test)) {
    test.forEach(addToAppearance);
  } else {
    addToAppearance(test);
  }
});

// @ts-ignore
export const imageSnapshotFolder = require('path').resolve(
  // @ts-ignore
  __dirname,
  `__image_snapshots__`,
);

export const snapshot = async page => {
  const image = await page.screenshot();
  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};
