import { getExampleUrl } from '@atlaskit/visual-regression/helper';
// import { colorPalette } from '@atlaskit/editor-common';

import { insertMedia as integrationInsertMedia } from '../integration/_helpers';
import { messages as insertBlockMessages } from '../../plugins/insert-block/ui/ToolbarInsertBlock';
import { messages as blockTypeMessages } from '../../plugins/block-type/types';
import { messages as textFormattingMessages } from '../../plugins/text-formatting/ui/ToolbarTextFormatting';
import { messages as advancedTextFormattingMessages } from '../../plugins/text-formatting/ui/ToolbarAdvancedTextFormatting';
import { messages as listsMessages } from '../../plugins/lists/ui/ToolbarLists';
import { messages as textColorMessages } from '../../plugins/text-color/ui/ToolbarTextColor';

export { setupMediaMocksProviders, editable } from '../integration/_helpers';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export const resetViewport = async page => {
  await page.setViewport({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
};

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

  await page.setViewport({ width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT });
  await page.waitForSelector(editor);
  await page.click(editor);
  await page.addStyleTag({
    content: `
      .json-output { display: none; }
      .ProseMirror { caret-color: transparent; }
      .ProseMirror-gapcursor span::after { animation-play-state: paused !important; }
    `,
  });
};

export const clearEditor = async page => {
  await page.evaluate(() => {
    const dom = document.querySelector('.ProseMirror') as HTMLElement;
    dom.innerHTML = '<p><br /></p>';
  });
};

export const insertTable = async page => {
  await page.click(
    `span[aria-label="${insertBlockMessages.table.defaultMessage}"]`,
  );
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

export const insertMenuSelector = `span[aria-label="${
  insertBlockMessages.insertMenu.defaultMessage
}"]`;

export const advanceFormattingMenuSelector = `span[aria-label="${
  advancedTextFormattingMessages.moreFormatting.defaultMessage
}"]`;

export const insertMenuTests = [
  // -----------------
  // Insert menu items
  // -----------------
  {
    name: 'Block quote',
    // click selector (dropdown menu or toolbar icon)
    clickSelector: insertMenuSelector,
    // menu item selector - when given, it should match item inner text
    menuItemText: blockTypeMessages.blockquote.defaultMessage,
    // inserted node selector - wait for the node to be inserted
    nodeSelector: 'blockquote p',
    // is used for testing marks and typing inside content nodes
    content: 'text',
    // where to test
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Code block',
    menuItemText: blockTypeMessages.codeblock.defaultMessage,
    clickSelector: insertMenuSelector,
    nodeSelector: 'div.code-block code',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Panel',
    menuItemText: blockTypeMessages.panel.defaultMessage,
    clickSelector: insertMenuSelector,
    nodeSelector: 'div[paneltype] p',
    content: 'text',
    appearance: ['full-page'],
  },
  {
    name: 'Divider',
    menuItemText: insertBlockMessages.horizontalRule.defaultMessage,
    clickSelector: insertMenuSelector,
    nodeSelector: 'hr',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Date',
    menuItemText: insertBlockMessages.date.defaultMessage,
    clickSelector: insertMenuSelector,
    nodeSelector: 'span[timestamp]',
    appearance: ['full-page'],
  },
  {
    name: 'Columns',
    menuItemText: insertBlockMessages.columns.defaultMessage,
    clickSelector: insertMenuSelector,
    nodeSelector: 'div[data-layout-type] p',
    content: 'text',
    appearance: ['full-page'],
  },
];

export const toolBarItemsTests = [
  // -----------------
  // Toolbar items
  // -----------------
  {
    name: 'Table',
    clickSelector: `span[aria-label="${
      insertBlockMessages.table.defaultMessage
    }"]`,
    nodeSelector: 'table th p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Action',
    clickSelector: `span[aria-label="${
      insertBlockMessages.action.defaultMessage
    }"]`,
    nodeSelector: 'ol[data-task-list-local-id] div',
    content: 'text',
    appearance: ['full-page', 'message'],
  },
  {
    name: 'Decision',
    clickSelector: `span[aria-label="${
      insertBlockMessages.decision.defaultMessage
    }"]`,
    nodeSelector: 'ol[data-decision-list-local-id] div',
    content: 'text',
    appearance: ['message'],
  },
  {
    name: 'Ordered list',
    clickSelector: `span[aria-label="${
      listsMessages.orderedList.defaultMessage
    }"]`,
    nodeSelector: 'ol li p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Unordered list',
    clickSelector: `span[aria-label="${
      listsMessages.unorderedList.defaultMessage
    }"]`,
    nodeSelector: 'ul li p',
    content: 'text',
    appearance: ['full-page', 'comment'],
  },
  Array.from(Array(6).keys()).map(key => {
    const level = key + 1;
    return {
      name: `Heading ${level}`,
      clickSelector: 'button[aria-haspopup="true"]',
      menuItemText: blockTypeMessages[`heading${level}`].defaultMessage,
      nodeSelector: `h${level}`,
      tagName: `h${level}`,
      content: 'text',
      appearance: ['full-page'], // TODO add comment mode back
      // removing comment since throwing error Node is detached from document
    };
  }),
];

export const baseTests = [
  // -----------------
  // Marks
  // -----------------
  ['bold', 'italic']
    .map(k => textFormattingMessages[k].defaultMessage)
    .map(key => ({
      name: key,
      clickSelector: `span[aria-label="${key}"]`,
      nodeSelector: '.ProseMirror p',
      content: 'text',
      appearance: ['full-page', 'comment'],
    })),
  ['underline', 'strike', 'code', 'subscript', 'superscript']
    .map(k => advancedTextFormattingMessages[k].defaultMessage)
    .map(key => ({
      name: key,
      menuItemText: key,
      clickSelector: advanceFormattingMenuSelector,
      nodeSelector: '.ProseMirror p',
      content: 'text',
      appearance: ['full-page', 'comment'],
    })),
  // TODO run this after the fix for 'Light grey' on master
  // Array.from(colorPalette.values()).map(key => {
  //   return {
  //     name: `Text color: ${key}`,
  //     clickSelector: `span[aria-label="${
  //       textColorMessages.textColor.defaultMessage
  //     }"]`,
  //     menuItemSelector: `button[title="${key}"]`,
  //     nodeSelector: '.ProseMirror p',
  //     content: 'text',
  //     appearance: ['full-page', 'comment'],
  //   };
  // }),
];

const dropdowns = [
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
    clickSelector: `span[aria-label="${
      textColorMessages.textColor.defaultMessage
    }"]`,
    appearance: ['full-page', 'comment'],
  },
  {
    name: 'Mention picker',
    clickSelector: `span[aria-label="${
      insertBlockMessages.mention.defaultMessage
    }"]`,
    nodeSelector: 'span[data-mention-query]',
    appearance: ['full-page', 'comment', 'message'],
  },
  {
    name: 'Hyperlink Recent Search',
    clickSelector: `span[aria-label="${
      insertBlockMessages.link.defaultMessage
    }"]`,
    appearance: ['full-page', 'comment'],
  },
];

// group tests by appearances
export const testsByAppearance = {};

const addToAppearance = test => {
  test.appearance.forEach(appearance => {
    if (!testsByAppearance[appearance]) {
      testsByAppearance[appearance] = [];
    }
    testsByAppearance[appearance].push(test);
  });
};

export const setTests = forInput => {
  let testArr: any[] = baseTests;
  if (forInput === 'insertMenu') {
    testArr = insertMenuTests;
  } else if (forInput === 'toolbar') {
    testArr = toolBarItemsTests;
  } else if (forInput === 'dropdown') {
    testArr = dropdowns;
  }
  testArr.forEach(test => {
    if (Array.isArray(test)) {
      test.forEach(addToAppearance);
    } else {
      addToAppearance(test);
    }
  });
};

export const snapshot = async page => {
  const editor = await page.$('.akEditor');

  // Try to take a screenshot of only the editor.
  // Otherwise take the whole page.
  let image;
  if (editor) {
    image = await editor.screenshot();
  } else {
    image = await page.screenshot();
  }

  // @ts-ignore
  expect(image).toMatchProdImageSnapshot();
};

export const insertMedia = async (page, filenames = ['one.svg']) => {
  // We need to wrap this as the xpath selector used in integration tests
  // isnt valid in puppeteer
  await integrationInsertMedia(page, filenames, 'div[aria-label="%s"]');
};
