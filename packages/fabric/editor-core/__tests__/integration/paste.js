// @flow
// eslint-disable-next-line
import { BrowserTestCase } from '@atlaskit/webdriver-runner/runner';
// eslint-disable-next-line
import Page from '@atlaskit/webdriver-runner/wd-wrapper';

const clipboardHelper = `${
  global.__baseUrl__
}/examples/fabric/editor-core/clipboard-helper`;
const clipboardInput = '#input';
const copyAsPlaintextButton = '#copy-as-plaintext';
const copyAsHTMLButton = '#copy-as-html';

const messageEditor = `${
  global.__baseUrl__
}/examples/fabric/editor-core/message`;
const editable = `[contenteditable="true"]`;

BrowserTestCase(
  'paste tests on message editor: plain text',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(clipboardHelper);
    await sample.isVisible(clipboardInput);
    await sample.type(clipboardInput, 'This text is plain.');
    await sample.click(copyAsPlaintextButton);
    // TODO: Wait for contents to be copied

    await sample.goto(messageEditor);
    await sample.waitFor(editable);
    await sample.paste(editable);

    expect(await sample.getProsemirrorNode(editable)).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [{ type: 'text', text: 'This text is plain.' }],
        },
      ],
    });
    expect(await sample.getText(editable)).toContain('This text is plain.');
  },
);

BrowserTestCase(
  'paste tests on message editor: text formatting',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(clipboardHelper);
    await sample.isVisible(clipboardInput);
    const testData =
      '<strong>bold </strong><em><strong>italics and bold </strong>some italics only </em><span class="code" style="font-family: monospace; white-space: pre-wrap;">add some code to this </span><u>underline this text</u><s> strikethrough </s><span style="color: rgb(0, 184, 217);">blue is my fav color</span> <a href="http://www.google.com">www.google.com</a>';
    await sample.type(clipboardInput, testData);
    await sample.click(copyAsHTMLButton);
    // TODO: Wait for contents to be copied

    await sample.goto(messageEditor);
    await sample.waitFor(editable);
    await sample.paste(editable);

    expect(await sample.getProsemirrorNode(editable)).toEqual({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            { type: 'text', text: 'bold ', marks: [{ type: 'strong' }] },
            {
              type: 'text',
              text: 'italics and bold ',
              marks: expect.arrayContaining([
                { type: 'strong' },
                { type: 'em' },
              ]),
            },
            {
              type: 'text',
              text: 'some italics only ',
              marks: [{ type: 'em' }],
            },
            {
              type: 'text',
              text: 'add some code to this ',
              marks: [{ type: 'code' }],
            },
            {
              type: 'text',
              text: 'underline this text',
              marks: [{ type: 'underline' }],
            },
            {
              type: 'text',
              text: ' strikethrough ',
              marks: [{ type: 'strike' }],
            },
            {
              type: 'text',
              text: 'blue is my fav color',
              marks: [{ type: 'textColor', attrs: { color: '#00b8d9' } }],
            },
            { type: 'text', text: ' ' },
            {
              type: 'text',
              text: 'www.google.com',
              marks: [
                { type: 'link', attrs: { href: 'http://www.google.com' } },
              ],
            },
          ],
        },
        // TODO: Enable link cards
        // expect.objectContaining({ type: 'mediaGroup', content: [ expect.objectContaining({ type: 'media' })] }),
      ],
    });

    expect(await sample.getText('strong')).toContain('bold ');
    expect(await sample.getText('strong')).toContain('italics and bold ');
    expect(await sample.getText('em')).toContain('some italics only');
    expect(await sample.getText('[class="code"]')).toContain(
      'add some code to this',
    );
    expect(await sample.getText('u')).toContain('underline this text');
    expect(await sample.getText('s')).toContain('strikethrough ');
    // TODO: Fix as currently gets pasted as a Link Card
    expect(await sample.getText('a')).toContain('www.google.com');
    expect(await sample.getText('span=blue is my fav color')).not.toBeNull();
  },
);

// eslint-disable-next-line jest/no-disabled-tests
describe.skip('Tables are not enabled in the message editor', () => {
  BrowserTestCase(
    'paste tests on message editor: table',
    { skip: ['edge', 'ie', 'safari'] },
    async client => {
      const sample = await new Page(client);
      await sample.goto(clipboardHelper);
      await sample.isVisible(clipboardInput);
      await sample.type(
        clipboardInput,
        '<table><tbody><tr><th><p>this</p></th><th class=""><p>is</p></th><th><p>table</p></th></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table>',
      );
      await sample.click(copyAsHTMLButton);
      // TODO: Wait for contents to be copied

      await sample.goto(messageEditor);
      await sample.waitFor(editable);
      await sample.paste(editable);

      expect(await sample.getProsemirrorNode(editable)).toEqual({
        type: 'doc',
        content: [
          {
            type: 'table',
            content: [
              {
                type: 'tableRow',
                content: [
                  expect.objectContaining({ type: 'tableHeader' }),
                  expect.objectContaining({ type: 'tableHeader' }),
                ],
              },
              {
                type: 'tableRow',
                content: [
                  expect.objectContaining({ type: 'tableCell' }),
                  expect.objectContaining({ type: 'tableCell' }),
                ],
              },
              {
                type: 'tableRow',
                content: [
                  expect.objectContaining({ type: 'tableHeader' }),
                  expect.objectContaining({ type: 'tableHeader' }),
                ],
              },
            ],
          },
        ],
      });

      expect(await sample.getText('table')).not.toBeNull();
    },
  );
});

BrowserTestCase(
  'paste tests on message editor: bullet list',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(clipboardHelper);
    await sample.isVisible(clipboardInput);
    await sample.type(
      clipboardInput,
      '<ul><li><p>list ele 1</p></li><li><p>list ele 2</p><ul><li><p>more ele 1</p></li><li><p>more ele 2</p></li></ul></li><li><p>this is the last ele</p></li></ul>',
    );
    await sample.click(copyAsHTMLButton);
    // TODO: Wait for contents to be copied

    await sample.goto(messageEditor);
    await sample.waitFor(editable);
    await sample.paste(editable);

    expect(await sample.getProsemirrorNode(editable)).toEqual({
      type: 'doc',
      content: [
        {
          type: 'bulletList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'list ele 1' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'list ele 2' }],
                },
                {
                  type: 'bulletList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: 'more ele 1' }],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [{ type: 'text', text: 'more ele 2' }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'this is the last ele' }],
                },
              ],
            },
          ],
        },
      ],
    });
    expect(await sample.getText('ul')).not.toBeNull();
  },
);

BrowserTestCase(
  'paste tests on message editor: ordered list',
  { skip: ['edge', 'ie', 'safari'] },
  async client => {
    const sample = await new Page(client);
    await sample.goto(clipboardHelper);
    await sample.isVisible(clipboardInput);
    await sample.type(
      clipboardInput,
      '<ol><li><p>this is ele1</p></li><li><p>this is a link <a href="http://www.google.com">www.google.com</a></p><ol><li><p>more elements with some <strong>format</strong></p></li><li><p>some addition<em> formatting</em></p></li></ol></li><li><p>last element</p></li></ol>',
    );
    await sample.click(copyAsHTMLButton);
    // TODO: Wait for contents to be copied

    await sample.goto(messageEditor);
    await sample.waitFor(editable);
    await sample.paste(editable);

    expect(await sample.getProsemirrorNode(editable)).toEqual({
      type: 'doc',
      content: [
        {
          type: 'orderedList',
          content: [
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'this is ele1' }],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    { type: 'text', text: 'this is a link ' },
                    {
                      type: 'text',
                      text: 'www.google.com',
                      marks: [
                        {
                          type: 'link',
                          attrs: { href: 'http://www.google.com' },
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'orderedList',
                  content: [
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            { type: 'text', text: 'more elements with some ' },
                            {
                              type: 'text',
                              text: 'format',
                              marks: [{ type: 'strong' }],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      type: 'listItem',
                      content: [
                        {
                          type: 'paragraph',
                          content: [
                            { type: 'text', text: 'some addition' },
                            {
                              type: 'text',
                              text: ' formatting',
                              marks: [{ type: 'em' }],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'listItem',
              content: [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: 'last element' }],
                },
              ],
            },
          ],
        },
      ],
    });
    expect(await sample.getText('ol')).not.toBeNull();
    expect(await sample.getText('a')).toContain('www.google.com');
    expect(await sample.getText('strong')).toContain('format');
    expect(await sample.getText('em')).toContain('formatting');
  },
);
