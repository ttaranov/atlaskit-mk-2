import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { ReactSerializer } from '../../../index';
import { defaultSchema as schema } from '@atlaskit/editor-common';
import { Action } from '../../../react/marks';
import { Heading } from '../../../react/nodes';
import { bigEmojiHeight } from '../../../utils';
import { Emoji } from '../../../react/nodes';
import { RendererAppearance } from '../../../ui/Renderer';

const emojiDoc = {
  content: [
    {
      content: [
        {
          attrs: {
            id: '1f642',
            shortName: ':slight_smile:',
            text: '🙂',
          },
          type: 'emoji',
        },
        {
          text: ' ',
          type: 'text',
        },
      ],
      type: 'paragraph',
    },
  ],
  type: 'doc',
  version: 1,
};

const doc = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Hello, ',
          marks: [
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'World!',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'link',
              attrs: {
                href: 'https://www.atlassian.com',
              },
            },
          ],
        },
        {
          type: 'text',
          text: 'Yo!',
          marks: [
            {
              type: 'strong',
            },
            {
              type: 'action',
              attrs: {
                key: 'test-action-key',
                target: {
                  key: 'test',
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

const headingDoc = {
  type: 'doc',
  version: 1,
  content: [
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Heading 1',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Heading 2',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Heading 1',
        },
      ],
    },
    {
      type: 'heading',
      attrs: { level: 1 },
      content: [
        {
          type: 'text',
          text: 'Heading 2',
        },
      ],
    },
  ],
};

const docFromSchema = schema.nodeFromJSON(doc);
const emojiDocFromSchema = schema.nodeFromJSON(emojiDoc);
const headingDocFromSchema = schema.nodeFromJSON(headingDoc);

describe('Renderer - ReactSerializer', () => {
  beforeAll(async () => {
    /* 
      Async nodes used need to be preloaded before testing, otherwise the first mount
      will have the loading component and not the actual node.
    */
    await Promise.all([Emoji.preload()]);
  });
  describe('serializeFragment', () => {
    it('should render document', () => {
      const reactSerializer = ReactSerializer.fromSchema(schema, {});
      const reactDoc = mount(reactSerializer.serializeFragment(
        docFromSchema.content,
      ) as any);

      const root = reactDoc.find('div');
      const paragraph = root.find('p');
      const link = paragraph.find('a');
      const strong = link.find('strong');

      expect(root.length).to.equal(1);
      expect(paragraph.length).to.equal(1);
      expect(link.length).to.equal(1);
      expect(strong.length).to.equal(1);

      expect(link.text()).to.equal('Hello, World!');
      expect(link.props()).to.have.property(
        'href',
        'https://www.atlassian.com',
      );
      expect(strong.text()).to.equal('World!');
      reactDoc.unmount();
    });

    describe('appearance', () => {
      const appearances: RendererAppearance[] = [
        'message',
        'inline-comment',
        'comment',
        'full-page',
        'mobile',
      ];

      const emojiDoubleHeightIn: RendererAppearance[] = ['message'];

      appearances.forEach(appearance => {
        describe(`${appearance} appearance`, () => {
          // Should the emoji render as double height in this appearance
          const doubleHeight: boolean =
            emojiDoubleHeightIn.indexOf(appearance) !== -1;

          it(`emoji ${
            doubleHeight ? 'should' : 'should not'
          } render as double height`, () => {
            const reactSerializer = ReactSerializer.fromSchema(schema, {
              appearance,
            });
            const reactDoc = mount(reactSerializer.serializeFragment(
              emojiDocFromSchema.content,
            ) as any);

            const emoji = reactDoc.find('EmojiItem');
            expect(emoji.length).to.equal(1);
            if (doubleHeight) {
              expect(emoji.prop('fitToHeight')).to.equal(bigEmojiHeight);
            } else {
              expect(emoji.prop('fitToHeight')).to.not.equal(bigEmojiHeight);
            }
          });
        });
      });
    });
  });

  describe('buildMarkStructure', () => {
    const { strong } = schema.marks;

    it('should wrap text nodes with marks', () => {
      const textNodes = [
        schema.text('Hello '),
        schema.text('World!', [strong.create()]),
      ];

      const output = ReactSerializer.buildMarkStructure(textNodes);
      expect(output[0].type.name).to.equal('text');
      expect((output[0] as any).text).to.equal('Hello ');
      expect(output[1].type.name).to.equal('strong');
      expect((output[1] as any).content[0].type.name).to.equal('text');
      expect((output[1] as any).content[0].text).to.equal('World!');
    });
  });

  describe('getMarks', () => {
    const { strong, strike, underline } = schema.marks;
    const node = schema.text('Hello World', [
      strike.create(),
      underline.create(),
      strong.create(),
    ]);

    it('should sort marks', () => {
      const sortedMarks = ReactSerializer.getMarks(node);
      expect(sortedMarks[0].type.name).to.equal('strong');
      expect(sortedMarks[1].type.name).to.equal('strike');
      expect(sortedMarks[2].type.name).to.equal('underline');
    });
  });

  describe('getMarkProps', () => {
    it('should pass eventHandlers to mark component', () => {
      const eventHandlers = {};
      const reactSerializer = ReactSerializer.fromSchema(schema, {
        eventHandlers,
      });
      const reactDoc = mount(reactSerializer.serializeFragment(
        docFromSchema.content,
      ) as any);
      expect(reactDoc.find(Action).prop('eventHandlers')).to.equal(
        eventHandlers,
      );
      reactDoc.unmount();
    });

    it('should pass key from attrs as markKey', () => {
      const eventHandlers = {};
      const reactSerializer = ReactSerializer.fromSchema(schema, {
        eventHandlers,
      });
      const reactDoc = mount(reactSerializer.serializeFragment(
        docFromSchema.content,
      ) as any);
      expect(reactDoc.find(Action).prop('markKey')).to.equal('test-action-key');
      expect(reactDoc.find(Action).key()).to.not.equal('test-action-key');
      reactDoc.unmount();
    });
  });

  describe('Heading IDs', () => {
    it('should render headings with unique ids based on node content', () => {
      const reactSerializer = ReactSerializer.fromSchema(schema, {});
      const reactDoc = shallow(reactSerializer.serializeFragment(
        headingDocFromSchema.content,
      ) as any);

      const headings = reactDoc.find(Heading);
      expect(headings.at(0).prop('headingId')).to.equal('Heading-1');
      expect(headings.at(1).prop('headingId')).to.equal('Heading-2');
      expect(headings.at(2).prop('headingId')).to.equal('Heading-1.1');
      expect(headings.at(3).prop('headingId')).to.equal('Heading-2.1');
    });

    it('should not render heading ids if "disableHeadingIDs" is true', () => {
      const reactSerializer = ReactSerializer.fromSchema(schema, {
        disableHeadingIDs: true,
      });
      const reactDoc = shallow(reactSerializer.serializeFragment(
        headingDocFromSchema.content,
      ) as any);

      const headings = reactDoc.find(Heading);
      expect(headings.at(0).prop('headingId')).to.equal(undefined);
      expect(headings.at(1).prop('headingId')).to.equal(undefined);
      expect(headings.at(2).prop('headingId')).to.equal(undefined);
      expect(headings.at(3).prop('headingId')).to.equal(undefined);
    });
  });

  describe('Table: Numbered Columns', () => {
    const tableDoc = {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'table',
          attrs: {
            isNumberColumnEnabled: true,
          },
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableHeader',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Header content 2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 1',
                        },
                      ],
                    },
                  ],
                },
                {
                  type: 'tableCell',
                  content: [
                    {
                      type: 'paragraph',
                      content: [
                        {
                          type: 'text',
                          text: 'Body content 2',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    it('should add an extra column for numbered rows', () => {
      const reactSerializer = ReactSerializer.fromSchema(schema, {});
      const tableFromSchema = schema.nodeFromJSON(tableDoc);
      const reactDoc = mount(reactSerializer.serializeFragment(
        tableFromSchema.content,
      ) as any);

      expect(reactDoc.find('table').prop('data-number-column')).to.equal(true);
      expect(reactDoc.find('table[data-number-column]').length).to.equal(1);
    });
  });
});
