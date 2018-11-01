declare var global: any;

// TO-DO remove chai validation
import { expect } from 'chai';
import {
  ADDoc,
  isSubSupType,
  getValidDocument,
  getValidNode,
  getValidMark,
  getValidUnknownNode,
  getMarksByOrder,
  isSameMark,
  markOrder,
  ADNode,
} from '../../../utils/validator';
import { isSafeUrl } from '../../../utils/url';
import { defaultSchema as schema } from '../../../schema/default-schema';
import { createSchema } from '../../../schema/create-schema';

describe('Renderer - Validator', () => {
  describe('isSafeUrl', () => {
    const safeURLs = [
      'http:///www.atlassian.com',
      'https://www.atlassian.com',
      'ftp://some.site.com',
      'ftps://some.site.com',
      '//www.atlassian.com',
      '//hipchat.com',
      '//subdomain.somedomain.com',
      '//www.atlassian.com/somepage',
      'mailto:user@mail.com',
    ];

    const unsafeURLs = [
      'javascript:alert("Hello World!")',
      ' javascript:alert("Hello World!")',
      '\njavascript:alert("Hello World!")',
      'smb:',
    ];

    it('should return true if URL starts with http://, https://, ftp://, ftps:// etc', () => {
      safeURLs.forEach(url => {
        expect(isSafeUrl(url)).to.equal(true);
      });
    });

    it('should return false for "unsafe" URLs', () => {
      unsafeURLs.forEach(url => {
        expect(isSafeUrl(url)).to.equal(false);
      });
    });
  });

  describe('isSubSupType', () => {
    it('should return false if type is not "sub" or "sup"', () => {
      expect(isSubSupType('banana')).to.equal(false);
    });

    it('should return true if type is "sub"', () => {
      expect(isSubSupType('sub')).to.equal(true);
    });

    it('should return true if type is "sup"', () => {
      expect(isSubSupType('sup')).to.equal(true);
    });
  });

  describe('getValidNode', () => {
    describe('applicationCard', () => {
      it('should return "text" if attrs is missing', () => {
        expect(getValidNode({ type: 'applicationCard' }).type).to.equal('text');
      });

      it('should return "text" if attrs.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {},
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: {},
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title.user.icon is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: {
              text: 'title',
              user: {},
            },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title.user.icon.url is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: {
              text: 'title',
              user: {
                icon: {
                  label: 'icon',
                },
              },
            },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title.user.icon.label is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: {
              text: 'title',
              user: {
                icon: {
                  url: 'https://lol.icon',
                },
              },
            },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.link.url is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            link: {},
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.background.url is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            background: {},
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.preview.url is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            preview: {},
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.description.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            description: {},
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions is not an array', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: { yes: 'no' },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions is an empty array', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions[].tilte is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [
              {
                target: {
                  key: 'test.target',
                },
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions[].target.key is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [
              {
                title: 'test',
                target: {},
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions[].key is not valid string', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [
              {
                key: 123,
                title: 'test',
                target: {
                  receiver: 'some.app',
                  key: 'test.target',
                },
                parameters: {
                  test: 10,
                  ext: 'ext',
                },
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions[].target.receiver is not valid string', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [
              {
                title: 'test',
                target: {
                  receiver: 20,
                  key: 'test.target',
                },
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.actions[].parameters is not object', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [
              {
                title: 'test',
                target: {
                  key: 'test.target',
                },
                parameters: 'aaa',
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "applicationCard" if attrs.actions is a valid array', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            actions: [
              {
                key: 'test-key',
                title: 'test',
                target: {
                  receiver: 'some.app',
                  key: 'test.target',
                },
                parameters: {
                  test: 10,
                  ext: 'ext',
                },
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('applicationCard');
      });

      it('should return "text" if attrs.details is not an array', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            details: { yes: 'no' },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.details[].badge.value is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            details: [
              {
                badge: {},
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.details[].lozenge.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            details: [
              {
                lozenge: {},
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.details[].users is not an array', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            details: [
              {
                users: { yes: 'no' },
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.details[].users[].icon is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            details: [
              {
                users: [{ id: 'id' }],
              },
            ],
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.context.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            context: {},
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.context.icon.url is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            context: {
              text: 'test',
              icon: {
                label: 'test-label',
              },
            },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.context.icon is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            context: {
              text: 'test',
            },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('applicationCard');
      });

      it('should return "text" if attrs.context.icon.label is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: { text: 'applicationCard' },
            context: {
              text: 'test',
              icon: {
                url: 'url',
              },
            },
          },
        };
        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.text is not a string', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 2017,
            title: { text: 'applicationCard' },
          },
        };

        expect(getValidNode(applicationCard).type).to.equal('text');
      });

      it('should return "applicationCard" if attrs.text is an empty string', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: '',
            title: { text: 'applicationCard' },
          },
        };

        expect(getValidNode(applicationCard).type).to.equal('applicationCard');
      });
    });

    describe('codeBlock', () => {
      it('should return codeBlock with only type text', () => {
        const invalidCodeBlockADF = {
          type: 'codeBlock',
          attrs: {
            language: 'javascript',
          },
          content: [
            {
              type: 'text',
              text: 'var foo = {};\nvar bar = [];',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'http://google.com',
                    title: 'Google',
                  },
                },
              ],
            },
          ],
        };
        const validNode = getValidNode(invalidCodeBlockADF);
        expect(validNode.content![0].type).to.equal('text');
        expect(validNode.content![0].text).to.equal(
          'var foo = {};\nvar bar = [];',
        );
        expect(validNode.content![0].marks).to.equal(undefined);
      });
    });

    describe('doc', () => {
      it('should return "text" if version-field is missing', () => {
        expect(getValidNode({ type: 'doc' }).type).to.equal('text');
      });

      it('should return "text" if content-field is missing', () => {
        expect(getValidNode({ type: 'doc', version: 1 } as any).type).to.equal(
          'text',
        );
      });

      it('should return "text" if content-field is empty-array', () => {
        expect(
          getValidNode({ type: 'doc', version: 1, content: [] } as any).type,
        ).to.equal('text');
      });

      it('should return "doc" with content field and without version', () => {
        expect(
          getValidNode({
            type: 'doc',
            version: 1,
            content: [{ type: 'unknown' }],
          } as any),
        ).to.deep.equal({
          type: 'doc',
          content: [
            {
              type: 'text',
              text: '[unknown]',
            },
          ],
        });
      });
    });

    describe('emoji', () => {
      it('should pass through attrs as emoji', () => {
        const emojiId = {
          shortName: ':grinning:',
          id: '123',
          fallback: 'cheese',
        };
        const { type, attrs } = getValidNode({ type: 'emoji', attrs: emojiId });
        expect(type).to.equal('emoji');
        expect(attrs).to.deep.equal(emojiId);
      });

      it('should pass through attrs with only shortName as emoji', () => {
        const emojiId = { shortName: ':grinning:' };
        const { type, attrs } = getValidNode({ type: 'emoji', attrs: emojiId });
        expect(type).to.equal('emoji');
        expect(attrs).to.deep.equal(emojiId);
      });

      it('should reject emoji without shortName', () => {
        const emojiId = { id: '123', fallback: 'cheese' };
        const { type } = getValidNode({ type: 'emoji', attrs: emojiId });
        expect(type).to.equal('text');
      });
    });

    describe('date', () => {
      it('should pass through attrs as timestamp', () => {
        const timestamp = {
          timestamp: 1528886473152,
        };
        const { type, attrs } = getValidNode({
          type: 'date',
          attrs: timestamp,
        });
        expect(type).to.equal('date');
        expect(attrs).to.deep.equal(timestamp);
      });

      it('should reject date without timestamp', () => {
        const { type } = getValidNode({ type: 'date' });
        expect(type).to.equal('text');
      });
    });

    describe('status', () => {
      it('should pass through attrs', () => {
        const attributes = {
          text: 'Done',
          color: 'green',
          localId: '666',
          style: 'bold',
        };
        const { type, attrs } = getValidNode({
          type: 'status',
          attrs: attributes,
        });
        expect(type).to.equal('status');
        expect(attrs).to.deep.equal(attributes);
      });

      it('should reject status without text', () => {
        const { type } = getValidNode({
          type: 'status',
          attrs: {
            color: 'neutral',
            localId: '666',
          },
        });
        expect(type).to.equal('text');
      });

      it('should reject status without color', () => {
        const { type } = getValidNode({
          type: 'status',
          attrs: {
            text: 'Done',
            localId: '666',
          },
        });
        expect(type).to.equal('text');
      });
    });

    describe('bodiedExtension', () => {
      it('should pass through attrs as extension', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'bodiedExtension',
          attrs: extensionAttrs,
          content: [],
        });
        expect(type).to.equal('bodiedExtension');
      });

      it('should reject extensions without extensionType', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });

      it('should reject extensions without extensionKey', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });
    });

    describe('extension', () => {
      it('should pass through attrs as extension', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type, attrs } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('extension');
        expect(attrs).to.deep.equal(extensionAttrs);
      });

      it('should reject extensions without extensionType', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });

      it('should reject extensions without extensionKey', () => {
        const extensionAttrs = {
          text: 'This is an extension',
          extensionType: 'com.atlassian.connect.extension',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'extension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });
    });

    describe('inlineExtension', () => {
      it('should pass through attrs as inlineExtension', () => {
        const extensionAttrs = {
          text: 'This is an inlineExtension',
          extensionType: 'com.atlassian.connect.inlineExtension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type, attrs } = getValidNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('inlineExtension');
        expect(attrs).to.deep.equal(extensionAttrs);
      });

      it('should reject inlineExtension without extensionType', () => {
        const extensionAttrs = {
          text: 'This is an inlineExtension',
          extensionKey: 'CallWithSkype',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });

      it('should reject inlineExtension without extensionKey', () => {
        const extensionAttrs = {
          text: 'This is an inlineExtension',
          extensionType: 'com.atlassian.connect.inlineExtension',
          bodyType: 'none',
        };
        const { type } = getValidNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });
    });

    describe('hardBreak', () => {
      it('should return "hardBreak"', () => {
        expect(getValidNode({ type: 'hardBreak' })).to.deep.equal({
          type: 'hardBreak',
        });
      });

      it('should discard any extranous attributes', () => {
        expect(
          getValidNode({ type: 'hardBreak', attrs: { color: 'green' } }),
        ).to.deep.equal({ type: 'hardBreak' });
      });
    });

    describe('mention', () => {
      it('should return "unknown" if it can not find an ID ', () => {
        expect(
          getValidNode({ type: 'mention', attrs: { text: '@Oscar' } }).type,
        ).to.deep.equal('text');
      });

      it('should use attrs.text if present', () => {
        expect(
          getValidNode({
            type: 'mention',
            attrs: { text: '@Oscar', id: 'abcd-abcd-abcd' },
          }),
        ).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
          },
        });
      });

      it('should use attrs.displayName if present and attrs.text is missing', () => {
        expect(
          getValidNode({
            type: 'mention',
            attrs: { displayName: '@Oscar', id: 'abcd-abcd-abcd' },
          }),
        ).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
          },
        });
      });

      it('should use .text if present and attrs.text and attrs.displayName is missing', () => {
        expect(
          getValidNode({
            type: 'mention',
            text: '@Oscar',
            attrs: { id: 'abcd-abcd-abcd' },
          }),
        ).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
          },
        });
      });

      it('should set attrs.text to "@unknown" if no valid text-property is available', () => {
        expect(
          getValidNode({ type: 'mention', attrs: { id: 'abcd-abcd-abcd' } }),
        ).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@unknown',
            id: 'abcd-abcd-abcd',
          },
        });
      });
    });

    describe('paragraph', () => {
      it('should return with an empty content node if content-field is missing', () => {
        const newDoc = getValidNode({ type: 'paragraph' });
        expect(newDoc)
          .to.have.property('type')
          .which.is.equal('paragraph');
        expect(newDoc)
          .to.have.property('content')
          .which.is.deep.equal([]);
      });

      it('should return "paragraph" if content-field is empty array', () => {
        expect(getValidNode({ type: 'paragraph', content: [] }).type).to.equal(
          'paragraph',
        );
      });

      it('should return "paragraph" with content', () => {
        expect(
          getValidNode({
            type: 'paragraph',
            content: [{ type: 'text', text: 'Hello World' }],
          }),
        ).to.deep.equal({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
            },
          ],
        });
      });
    });

    describe('action', () => {
      it('should return "action"', () => {
        const data = {
          type: 'action',
          attrs: {
            key: 'test-action-key',
            title: 'title',
            target: {
              key: 'somу-key',
            },
            parameters: {},
          },
        };
        expect(getValidMark(data)).to.deep.equal(data);
      });

      it('should return null if attrs is missing', () => {
        expect(getValidMark({ type: 'action' })).to.equal(null);
      });

      it('should return null if attrs.target is missing', () => {
        expect(getValidMark({ type: 'action', attrs: {} })).to.equal(null);
      });

      it('should return null if attrs.target.key is missing', () => {
        expect(
          getValidMark({ type: 'action', attrs: { target: {} } }),
        ).to.equal(null);
      });
    });

    describe('text', () => {
      it('should return "text" with text', () => {
        expect(
          getValidNode({ type: 'text', text: 'Hello World' }),
        ).to.deep.equal({
          type: 'text',
          text: 'Hello World',
        });

        expect(
          getValidNode({
            type: 'text',
            text: 'Hello World',
            marks: [{ type: 'strong' }],
          }),
        ).to.deep.equal({
          type: 'text',
          text: 'Hello World',
          marks: [
            {
              type: 'strong',
            },
          ],
        });
      });
    });

    describe('mediaGroup', () => {
      it('should return "mediaGroup" with type and content', () => {
        expect(
          getValidNode({
            type: 'mediaGroup',
            content: [
              {
                type: 'media',
                attrs: {
                  type: 'file',
                  id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                  collection: 'MediaServicesSample',
                },
              },
            ],
          }),
        ).to.deep.equal({
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
        });
      });

      it('should return "unknownBlock" if some of it\'s content is not media', () => {
        expect(
          getValidNode({
            type: 'mediaGroup',
            content: [
              {
                type: 'text',
                text: '[media]',
              },
            ],
          }),
        ).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: '[media]',
            },
          ],
        });
      });
    });

    describe('mediaSingle', () => {
      // use jest assertions
      const expect = global.expect;

      it('should return "mediaSingle" with type, attrs and content', () => {
        const validADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
          ],
        };

        expect(getValidNode(validADFChunk)).toEqual(validADFChunk);
      });

      it('should return "unknownBlock" if some of its content is not media', () => {
        const invalidADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'mention',
              attrs: {
                id: 'abcd-abcd-abcd',
                text: '@Oscar',
              },
            },
          ],
        };

        expect(getValidNode(invalidADFChunk)).toEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'mention',
              attrs: {
                id: 'abcd-abcd-abcd',
                text: '@Oscar',
              },
            },
          ],
        });
      });

      it('should return "mediaGroup" if children count is more than 1', () => {
        const invalidADFChunk = {
          type: 'mediaSingle',
          attrs: { layout: 'full-width' },
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2df',
                collection: 'MediaServicesSample',
              },
            },
          ],
        };

        // actually this is invalid tree even for renderer
        // in this case pm.check() fails and "Unsupported content" message is rendered
        expect(getValidNode(invalidADFChunk)).toEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2df',
                collection: 'MediaServicesSample',
              },
            },
          ],
        });
      });
    });

    describe('media', () => {
      it('should return "media" with attrs and type', () => {
        expect(
          getValidNode({
            type: 'media',
            attrs: {
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: 'MediaServicesSample',
            },
          }),
        ).to.deep.equal({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
          },
        });
      });

      it('should return "media" with attrs and type if collection is empty', () => {
        expect(
          getValidNode({
            type: 'media',
            attrs: {
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: '',
            },
          }),
        ).to.deep.equal({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: '',
          },
        });
      });

      it('should add width and height attrs if they are present', () => {
        expect(
          getValidNode({
            type: 'media',
            attrs: {
              type: 'file',
              id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
              collection: 'MediaServicesSample',
              width: 200,
              height: 100,
            },
          }),
        ).to.deep.equal({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
            width: 200,
            height: 100,
          },
        });
      });
    });

    describe('decisions', () => {
      it('should pass through attrs for decisionList', () => {
        const listAttrs = { localId: 'cheese' };
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionList',
          attrs: listAttrs,
          content: listContent,
        });
        expect(type).to.equal('decisionList');
        expect(attrs).to.deep.equal(listAttrs);
        expect(content).to.deep.equal(listContent);
      });

      it('should generate localId for decisionList if missing', () => {
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionList',
          content: listContent,
        });
        expect(type).to.equal('decisionList');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal(listContent);
      });

      it('should pass through attrs for decisionItem', () => {
        const itemAttrs = { localId: 'cheese', state: 'DECIDED' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('decisionItem');
        expect(attrs).to.deep.equal(itemAttrs);
        expect(content).to.deep.equal(itemContent);
      });

      it('should generate localId for decisionItem if missing', () => {
        const itemAttrs = { state: 'DECIDED' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'decisionItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('decisionItem');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.state).to.equal('DECIDED');
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal(itemContent);
      });
    });

    describe('tasks', () => {
      it('should pass through attrs for taskList', () => {
        const listAttrs = { localId: 'cheese' };
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskList',
          attrs: listAttrs,
          content: listContent,
        });
        expect(type).to.equal('taskList');
        expect(attrs).to.deep.equal(listAttrs);
        expect(content).to.deep.equal(listContent);
      });

      it('should generate localId for taskList if missing', () => {
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskList',
          content: listContent,
        });
        expect(type).to.equal('taskList');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal(listContent);
      });

      it('should pass through attrs for taskItem', () => {
        const itemAttrs = { localId: 'cheese', state: 'DONE' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('taskItem');
        expect(attrs).to.deep.equal(itemAttrs);
        expect(content).to.deep.equal(itemContent);
      });

      it('should generate localId for taskItem if missing', () => {
        const itemAttrs = { state: 'DONE' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = getValidNode({
          type: 'taskItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('taskItem');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.state).to.equal('DONE');
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal(itemContent);
      });
    });

    describe('image', () => {
      it('should pass through attrs as image', () => {
        const imageAttrs = {
          src: 'http://example.com/test.jpg',
          alt: 'explanation',
          title: 'image',
        };
        const { type, attrs } = getValidNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).to.equal('image');
        expect(attrs).to.deep.equal(imageAttrs);
      });

      it('should pass through attrs with only src as image', () => {
        const imageAttrs = { src: 'http://example.com/test.jpg' };
        const { type, attrs } = getValidNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).to.equal('image');
        expect(attrs).to.deep.equal(imageAttrs);
      });

      it('should reject image without src', () => {
        const imageAttrs = { alt: 'explanation' };
        const { type } = getValidNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).to.equal('text');
      });
    });

    describe('listItem', () => {
      it('should handle invalid child nodes without crashing', () => {
        const itemContent = [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '[confluenceUnsupportedBlock]',
              },
            ],
          },
        ];

        const { content } = getValidNode({
          type: 'listItem',
          content: [
            {
              type: 'confluenceUnsupportedBlock',
              attrs: {},
            },
          ],
        });

        expect(content).to.deep.equal(itemContent);
      });
    });

    ['tableCell', 'tableHeader'].forEach(nodeName => {
      describe(nodeName, () => {
        const cellAttrs = {
          colspan: 2,
          rowspan: 3,
          colwidth: [4],
          background: '#dabdab',
        };

        it('should pass through attrs', () => {
          const { type, attrs } = getValidNode({
            type: nodeName,
            attrs: cellAttrs,
            content: [],
          });
          expect(type).to.equal(nodeName);
          expect(attrs).to.deep.equal(cellAttrs);
        });

        const attributeTests = new Map([
          ['no attrs', undefined],
          ['empty attrs', {}],
          ['only colspan', { colspan: 2 }],
          ['only rowspan', { rowspan: 2 }],
        ]);

        attributeTests.forEach((testAttr, testName) => {
          it(`should allow ${nodeName} with ${testName}`, () => {
            const { type, attrs } = getValidNode({
              type: nodeName,
              attrs: testAttr,
              content: [],
            });
            expect(type).to.equal(nodeName);
            expect(attrs).to.deep.equal(testAttr);
          });
        });

        it(`should reject ${nodeName} without content`, () => {
          const { type } = getValidNode({
            type: nodeName,
            attrs: cellAttrs,
          });
          expect(type).to.equal('text');
        });
      });
    });

    it('should overwrite the default schema if it gets a docSchema parameter', () => {
      // rule is taken out in following schema
      const schema = createSchema({
        nodes: [
          'doc',
          'paragraph',
          'text',
          'bulletList',
          'orderedList',
          'listItem',
          'heading',
          'blockquote',
          'codeBlock',
          'panel',
          'image',
          'mention',
          'hardBreak',
          'emoji',
          'mediaGroup',
          'media',
          'table',
          'tableCell',
          'tableHeader',
          'tableRow',
        ],
        marks: [
          'em',
          'strong',
          'code',
          'strike',
          'underline',
          'link',
          'mentionQuery',
          'emojiQuery',
          'textColor',
          'subsup',
        ],
      });

      const doc = {
        type: 'doc' as 'doc',
        version: 1 as 1,
        content: [
          {
            type: 'rule',
          },
        ],
      };
      const result = getValidNode(doc, schema);

      expect(result.content![0].type).to.equal('text');
      expect(result.content![0].text).to.equal('[rule]');
    });
  });

  describe('getValidUnknownNode', () => {
    describe('unknown inline nodes', () => {
      it('should return "text" node if content is absent', () => {
        const unknownInlineNode = getValidUnknownNode({ type: 'foobar' });
        expect(unknownInlineNode.type).to.equal('text');
      });

      it('should return "text" node if content is empty', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          content: [],
        });
        expect(unknownInlineNode.type).to.equal('text');
      });

      it('should store textUrl attribute in "href" attribute', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          attrs: { textUrl: 'https://www.atlassian.com' },
        });
        expect(unknownInlineNode.marks).to.have.length(1);
        expect(unknownInlineNode.marks![0].attrs.href).to.equal(
          'https://www.atlassian.com',
        );
      });

      it('should not store unsafe textUrl attribute in "href" attribute', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          attrs: { textUrl: 'javascript:alert("haxx")' },
        });
        expect(unknownInlineNode.marks).to.equal(undefined);
      });

      it('should use default text', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          text: 'some text',
          attrs: { text: 'some text from attrs' },
        });
        expect(unknownInlineNode.text).to.equal('some text');
      });

      it('should use node.attrs.text if text is missing', () => {
        const unknownInlineNode = getValidUnknownNode({
          type: 'foobar',
          attrs: { text: 'some text from attrs' },
        });
        expect(unknownInlineNode.text).to.equal('some text from attrs');
      });

      it('should use original type in square brackets if neither text nor attrs.text is missing', () => {
        const unknownInlineNode = getValidUnknownNode({ type: 'foobar' });
        expect(unknownInlineNode.text).to.equal('[foobar]');
      });
    });

    describe('unknown block nodes', () => {
      it('should build flattened tree from unknown block node #1', () => {
        const node = {
          type: 'foobar',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
            {
              type: 'world-node-type',
              text: 'world',
            },
          ],
        };

        const unknownBlockNode = getValidUnknownNode(node);
        expect(unknownBlockNode).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'world',
            },
          ],
        });
      });

      it('should build flattened tree from unknown block node #2', () => {
        const node = {
          type: 'foobar-table',
          content: [
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'text',
                  text: 'hello mate',
                },
              ],
            },
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'foobar-cell',
                  content: [
                    {
                      type: 'text',
                      text: 'this is',
                    },
                    {
                      type: 'special-sydney-node-type',
                      text: 'Sydney!',
                    },
                  ],
                },
              ],
            },
          ],
        };

        const unknownBlockNode = getValidUnknownNode(node);
        expect(unknownBlockNode).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello mate',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'this is',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              text: 'Sydney!',
            },
          ],
        });
      });

      it('should build flattened tree from unknown block node #3', () => {
        const node = {
          type: 'foobar-table',
          content: [
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'text',
                  text: 'hello mate',
                },
              ],
            },
            {
              type: 'foobar-row',
              content: [
                {
                  type: 'foobar-row',
                  content: [
                    {
                      type: 'foobar-cell',
                      content: [
                        {
                          type: 'text',
                          text: 'this is',
                        },
                        {
                          type: 'special-sydney-node-type',
                          attrs: {
                            textUrl: 'http://www.sydney.com.au/',
                          },
                          text: 'Sydney!',
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        };

        const unknownBlockNode = getValidUnknownNode(node);
        expect(unknownBlockNode).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello mate',
            },
            {
              type: 'hardBreak',
            },
            {
              type: 'text',
              text: 'this is',
            },
            {
              type: 'text',
              text: ' ',
            },
            {
              type: 'text',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'http://www.sydney.com.au/',
                  },
                },
              ],
              text: 'Sydney!',
            },
          ],
        });
      });
    });
  });

  describe('getValidMark', () => {
    describe('unknown', () => {
      it('should return null if type is unknown', () => {
        expect(getValidMark({ type: 'banana' })).to.equal(null);
      });
    });

    describe('em', () => {
      it('should return "em"', () => {
        expect(getValidMark({ type: 'em' })).to.deep.equal({
          type: 'em',
        });
      });
    });

    describe('link', () => {
      it('should return null if attrs is missing', () => {
        expect(getValidMark({ type: 'link' })).to.equal(null);
      });

      it('should return null if both attrs.href and attrs.url are missing', () => {
        expect(getValidMark({ type: 'link', attrs: {} })).to.equal(null);
      });

      it('should use attrs.href if present', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { href: 'https://www.atlassian.com' },
          }),
        ).to.deep.equal({
          type: 'link',
          attrs: {
            href: 'https://www.atlassian.com',
          },
        });
      });

      it('should add protocol to a url if it doesn`t exist', () => {
        expect(
          getValidMark({ type: 'link', attrs: { href: 'www.atlassian.com' } }),
        ).to.deep.equal({
          type: 'link',
          attrs: {
            href: 'http://www.atlassian.com',
          },
        });
      });

      it('should use attrs.url if present and attrs.href is missing', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { url: 'https://www.atlassian.com' },
          }),
        ).to.deep.equal({
          type: 'link',
          attrs: {
            href: 'https://www.atlassian.com',
          },
        });
      });

      it('should allow relative links', () => {
        expect(
          getValidMark({
            type: 'link',
            attrs: { href: '/this/is/a/relative/link' },
          }),
        ).to.deep.equal({
          type: 'link',
          attrs: {
            href: '/this/is/a/relative/link',
          },
        });
      });
    });

    describe('strike', () => {
      it('should return "strike"', () => {
        expect(getValidMark({ type: 'strike' })).to.deep.equal({
          type: 'strike',
        });
      });
    });

    describe('strong', () => {
      it('should return "strong"', () => {
        expect(getValidMark({ type: 'strong' })).to.deep.equal({
          type: 'strong',
        });
      });
    });

    describe('subsup', () => {
      it('should return null if attrs is missing', () => {
        expect(getValidMark({ type: 'subsup' })).to.equal(null);
      });

      it('should return null if attrs.type is not sub or sup', () => {
        expect(
          getValidMark({ type: 'subsup', attrs: { type: 'banana' } }),
        ).to.equal(null);
      });

      it('should return "subsup" with correct type', () => {
        expect(
          getValidMark({ type: 'subsup', attrs: { type: 'sub' } }),
        ).to.deep.equal({
          type: 'subsup',
          attrs: {
            type: 'sub',
          },
        });

        expect(
          getValidMark({ type: 'subsup', attrs: { type: 'sup' } }),
        ).to.deep.equal({
          type: 'subsup',
          attrs: {
            type: 'sup',
          },
        });
      });
    });

    describe('textColor', () => {
      it('should return "textColor"', () => {
        expect(
          getValidMark({ type: 'textColor', attrs: { color: '#ff0000' } }),
        ).to.deep.equal({
          type: 'textColor',
          attrs: {
            color: '#ff0000',
          },
        });
      });

      it('should return "textColor" for uppercase color', () => {
        expect(
          getValidMark({ type: 'textColor', attrs: { color: '#FF0000' } }),
        ).to.deep.equal({
          type: 'textColor',
          attrs: {
            color: '#FF0000',
          },
        });
      });

      it('should skip nodes if color attribute is missing', () => {
        expect(getValidMark({ type: 'textColor' })).to.equal(null);
      });

      it("should skip nodes if color attribute doesn't match RGB pattern", () => {
        expect(
          getValidMark({ type: 'textColor', attrs: { color: 'red' } }),
        ).to.equal(null);
      });
    });

    describe('underline', () => {
      it('should return "underline"', () => {
        expect(getValidMark({ type: 'underline' })).to.deep.equal({
          type: 'underline',
        });
      });
    });
  });

  describe('getMarksByOrder', () => {
    const { strong, strike, link, em, subsup, underline } = schema.marks;

    it('should return marks in right order', () => {
      const unorderedMarks = [
        strong.create(),
        link.create({ href: 'www.atlassian.com' }),
        em.create(),
        subsup.create(),
        underline.create(),
        strike.create(),
      ];

      const orderedMarks = getMarksByOrder(unorderedMarks);
      orderedMarks.forEach((mark, index) => {
        expect(markOrder[index]).to.equal(mark.type.name);
      });
    });
  });

  describe('isSameMark', () => {
    const { strong, strike, link } = schema.marks;

    const strongMark = strong.create();
    const strikeMark = strike.create();

    const linkMark1 = link.create({ href: 'www.atlassian.com' });
    const linkMark2 = link.create({ href: 'www.hipchat.com' });

    it('should return false if mark is null or otherMark is null', () => {
      expect(isSameMark(null, strongMark)).to.equal(false);
      expect(isSameMark(strongMark, null)).to.equal(false);
    });

    it('should return false if type is not the same', () => {
      expect(isSameMark(strongMark, strikeMark)).to.equal(false);
    });

    it('should return false if mark-type is the same but attributes is not', () => {
      expect(isSameMark(linkMark1, linkMark2)).to.equal(false);
    });

    it('should return true if type is the same and attributes match', () => {
      expect(isSameMark(linkMark1, linkMark1)).to.equal(true);
    });
  });

  describe('getValidDocument', () => {
    it('should not mutate original document', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'decisionList',
            attrs: {
              localId: 'dl1',
              mysteryAttr: 'cheese',
            },
            content: [
              {
                type: 'decisionItem',
                attrs: {
                  localId: 'di1',
                  state: 'DECIDED',
                  mysteryAttr2: 'bacon',
                },
                content: [
                  {
                    type: 'text',
                    text: 'We decided',
                  },
                ],
              },
            ],
          },
          {
            type: 'mysteryType',
            content: [
              {
                type: 'text',
                text: 'mystery text',
              },
            ],
          },
        ],
      };
      const expectedValidDoc: ADNode = {
        type: 'doc',
        content: [
          {
            type: 'decisionList',
            attrs: {
              localId: 'dl1',
            },
            content: [
              {
                type: 'decisionItem',
                attrs: {
                  localId: 'di1',
                  state: 'DECIDED',
                },
                content: [
                  {
                    type: 'text',
                    text: 'We decided',
                  },
                ],
              },
            ],
          },
          {
            type: 'unknownBlock',
            content: [
              {
                type: 'text',
                text: 'mystery text',
              },
            ],
          },
        ],
      };
      const originalCopy = JSON.parse(JSON.stringify(original));
      const newDoc = getValidDocument(original);
      // Ensure original is not mutated
      expect(originalCopy, 'Original unchanged').to.deep.equal(original);
      expect(newDoc, 'New doc valid').to.deep.equal(expectedValidDoc);
    });

    it('should wrap top level text nodes to ensure the document is valid', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
          },
          {
            type: 'foo', // Should be wrapped
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'bar', // Should be a text node
              },
            ],
          },
        ],
      };
      const expectedValidDoc: ADNode = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '[foo]',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: '[bar]',
              },
            ],
          },
        ],
      };
      const newDoc = getValidDocument(original);
      expect(newDoc).to.deep.equal(expectedValidDoc);
    });
  });

  describe('Stage0', () => {
    it('should remove stage0 marks if flag is not explicitly set to "stage0"', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(getValidDocument(original)).to.deep.equal({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [],
              },
            ],
          },
        ],
      });
    });

    it('should keep stage0 marks if flag is explicitly set to "stage0"', () => {
      const original: ADDoc = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      };

      expect(getValidDocument(original, schema, 'stage0')).to.deep.equal({
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Hello World',
                marks: [
                  {
                    type: 'confluenceInlineComment',
                    attrs: {
                      reference: 'ref',
                    },
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });
});
