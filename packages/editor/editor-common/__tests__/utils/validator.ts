declare var global: any;

import { expect } from 'chai';
import {
  ADDoc,
  isSubSupType,
  getValidDocument,
  getValidMark,
  getValidUnknownNode,
  getMarksByOrder,
  isSameMark,
  markOrder,
  validateNode,
  convertToValidatedDoc,
} from '../../src/utils/validator';
import { isSafeUrl } from '../../src/utils/url';
import { defaultSchema as schema } from '../../src/schema/default-schema';
import { createSchema } from '../../src/schema/create-schema';

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

  describe('validateNode', () => {
    describe('applicationCard', () => {
      it('should return "text" if attrs is missing', () => {
        expect(validateNode({ type: 'applicationCard' }).type).to.equal('text');
      });

      it('should return "text" if attrs.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {},
          valid: true,
        };
        expect(validateNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
          },
        };
        expect(validateNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.title.text is missing', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 'applicationCard',
            title: {},
          },
        };
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('applicationCard');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('text');
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
        expect(validateNode(applicationCard).type).to.equal('applicationCard');
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
        expect(validateNode(applicationCard).type).to.equal('text');
      });

      it('should return "text" if attrs.text is not a string', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: 2017,
            title: { text: 'applicationCard' },
          },
        };

        expect(validateNode(applicationCard).type).to.equal('text');
      });

      it('should return "applicationCard" if attrs.text is an empty string', () => {
        const applicationCard = {
          type: 'applicationCard',
          attrs: {
            text: '',
            title: { text: 'applicationCard' },
          },
        };

        expect(validateNode(applicationCard).type).to.equal('applicationCard');
      });
    });

    describe('doc', () => {
      it('should return "text" if version-field is missing', () => {
        expect(validateNode({ type: 'doc' }).type).to.equal('text');
      });

      it('should return "text" if content-field is missing', () => {
        expect(validateNode({ type: 'doc', version: 1 } as any).type).to.equal(
          'text',
        );
      });

      it('should return "text" if content-field is empty-array', () => {
        expect(
          validateNode({ type: 'doc', version: 1, content: [] } as any).type,
        ).to.equal('text');
      });

      it('should return "doc" with content field and without version', () => {
        const doc = {
          type: 'doc',
          version: 1,
          content: [{ type: 'unknown' }],
        };

        expect(validateNode(doc as any)).to.deep.equal({
          type: 'doc',
          content: [
            {
              type: 'text',
              text: '[unknown]',
              valid: false,
              originalNode: { type: 'unknown' },
            },
          ],
          valid: true,
          originalNode: doc,
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
        const { type, attrs } = validateNode({ type: 'emoji', attrs: emojiId });
        expect(type).to.equal('emoji');
        expect(attrs).to.deep.equal(emojiId);
      });

      it('should pass through attrs with only shortName as emoji', () => {
        const emojiId = { shortName: ':grinning:' };
        const { type, attrs } = validateNode({ type: 'emoji', attrs: emojiId });
        expect(type).to.equal('emoji');
        expect(attrs).to.deep.equal(emojiId);
      });

      it('should reject emoji without shortName', () => {
        const emojiId = { id: '123', fallback: 'cheese' };
        const { type } = validateNode({ type: 'emoji', attrs: emojiId });
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
        const { type } = validateNode({
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
        const { type } = validateNode({
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
        const { type } = validateNode({
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
        const { type, attrs } = validateNode({
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
        const { type } = validateNode({
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
        const { type } = validateNode({
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
        const { type, attrs } = validateNode({
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
        const { type } = validateNode({
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
        const { type } = validateNode({
          type: 'inlineExtension',
          attrs: extensionAttrs,
        });
        expect(type).to.equal('text');
      });
    });

    describe('hardBreak', () => {
      it('should return "hardBreak"', () => {
        const originalNode = { type: 'hardBreak' };
        expect(validateNode(originalNode)).to.deep.equal({
          type: 'hardBreak',
          valid: true,
          originalNode,
        });
      });

      it('should discard any extranous attributes', () => {
        const originalNode = { type: 'hardBreak', attrs: { color: 'green' } };
        expect(validateNode(originalNode)).to.deep.equal({
          type: 'hardBreak',
          valid: true,
          originalNode,
        });
      });
    });

    describe('mention', () => {
      it('should return "unknown" if it can not find an ID ', () => {
        expect(
          validateNode({ type: 'mention', attrs: { text: '@Oscar' } }).type,
        ).to.deep.equal('text');
      });

      it('should use attrs.text if present', () => {
        const originalNode = {
          type: 'mention',
          attrs: { text: '@Oscar', id: 'abcd-abcd-abcd' },
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
          },
          valid: true,
          originalNode,
        });
      });

      it('should use attrs.displayName if present and attrs.text is missing', () => {
        const originalNode = {
          type: 'mention',
          attrs: { displayName: '@Oscar', id: 'abcd-abcd-abcd' },
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
          },
          valid: true,
          originalNode,
        });
      });

      it('should use .text if present and attrs.text and attrs.displayName is missing', () => {
        const originalNode = {
          type: 'mention',
          text: '@Oscar',
          attrs: { id: 'abcd-abcd-abcd' },
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@Oscar',
            id: 'abcd-abcd-abcd',
          },
          valid: true,
          originalNode,
        });
      });

      it('should set attrs.text to "@unknown" if no valid text-property is available', () => {
        const originalNode = {
          type: 'mention',
          attrs: { id: 'abcd-abcd-abcd' },
        };
        expect(validateNode(originalNode)).to.deep.equal({
          type: 'mention',
          attrs: {
            text: '@unknown',
            id: 'abcd-abcd-abcd',
          },
          valid: true,
          originalNode,
        });
      });
    });

    describe('paragraph', () => {
      it('should return with an empty content node if content-field is missing', () => {
        const newDoc = validateNode({ type: 'paragraph' });
        expect(newDoc)
          .to.have.property('type')
          .which.is.equal('paragraph');
        expect(newDoc)
          .to.have.property('content')
          .which.is.deep.equal([]);
      });

      it('should return "paragraph" if content-field is empty array', () => {
        expect(validateNode({ type: 'paragraph', content: [] }).type).to.equal(
          'paragraph',
        );
      });

      it('should return "paragraph" with content', () => {
        const originalNode = {
          type: 'paragraph',
          content: [{ type: 'text', text: 'Hello World' }],
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Hello World',
              valid: true,
              originalNode: originalNode.content[0],
            },
          ],
          originalNode,
          valid: true,
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
        const textNoMark = { type: 'text', text: 'Hello World' };
        expect(validateNode(textNoMark)).to.deep.equal({
          type: 'text',
          text: 'Hello World',
          valid: true,
          originalNode: textNoMark,
        });

        const textWithMark = {
          type: 'text',
          text: 'Hello World',
          marks: [{ type: 'strong' }],
        };

        expect(validateNode(textWithMark)).to.deep.equal({
          type: 'text',
          text: 'Hello World',
          marks: [
            {
              type: 'strong',
            },
          ],
          valid: true,
          originalNode: textWithMark,
        });
      });
    });

    describe('mediaGroup', () => {
      it('should return "mediaGroup" with type and content', () => {
        const originalNode = {
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
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'mediaGroup',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
              valid: true,
              originalNode: originalNode.content[0],
            },
          ],
          valid: true,
          originalNode,
        });
      });

      it('should return "unknownBlock" if some of it\'s content is not media', () => {
        const originalNode = {
          type: 'mediaGroup',
          content: [
            {
              type: 'text',
              text: '[media]',
            },
          ],
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: '[media]',
              valid: true,
              originalNode: originalNode.content[0],
            },
          ],
          valid: false,
          originalNode,
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

        expect(validateNode(validADFChunk)).toEqual({
          ...validADFChunk,
          content: [
            {
              ...validADFChunk.content[0],
              valid: true,
              originalNode: validADFChunk.content[0],
            },
          ],
          valid: true,
          originalNode: validADFChunk,
        });
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

        expect(validateNode(invalidADFChunk)).toEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'mention',
              attrs: {
                id: 'abcd-abcd-abcd',
                text: '@Oscar',
              },
              valid: true,
              originalNode: invalidADFChunk.content[0],
            },
          ],
          valid: false,
          originalNode: invalidADFChunk,
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
        expect(validateNode(invalidADFChunk)).toEqual({
          type: 'unknownBlock',
          content: [
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
                collection: 'MediaServicesSample',
              },
              valid: true,
              originalNode: invalidADFChunk.content[0],
            },
            {
              type: 'text',
              text: ' ',
              valid: true,
              originalNode: null,
            },
            {
              type: 'media',
              attrs: {
                type: 'file',
                id: '5556346b-b081-482b-bc4a-4faca8ecd2df',
                collection: 'MediaServicesSample',
              },
              valid: true,
              originalNode: invalidADFChunk.content[1],
            },
          ],
          valid: false,
          originalNode: invalidADFChunk,
        });
      });
    });

    describe('media', () => {
      it('should return "media" with attrs and type', () => {
        const originalNode = {
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
          },
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
          },
          valid: true,
          originalNode,
        });
      });

      it('should return "media" with attrs and type if collection is empty', () => {
        const originalNode = {
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: '',
          },
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: '',
          },
          valid: true,
          originalNode,
        });
      });

      it('should add width and height attrs if they are present', () => {
        const originalNode = {
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
            width: 200,
            height: 100,
          },
        };

        expect(validateNode(originalNode)).to.deep.equal({
          type: 'media',
          attrs: {
            type: 'file',
            id: '5556346b-b081-482b-bc4a-4faca8ecd2de',
            collection: 'MediaServicesSample',
            width: 200,
            height: 100,
          },
          valid: true,
          originalNode,
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
        const { type, attrs, content } = validateNode({
          type: 'decisionList',
          attrs: listAttrs,
          content: listContent,
        });
        expect(type).to.equal('decisionList');
        expect(attrs).to.deep.equal(listAttrs);
        expect(content).to.deep.equal([
          { ...listContent[0], valid: true, originalNode: listContent[0] },
        ]);
      });

      it('should generate localId for decisionList if missing', () => {
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = validateNode({
          type: 'decisionList',
          content: listContent,
        });
        expect(type).to.equal('decisionList');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal([
          { ...listContent[0], valid: true, originalNode: listContent[0] },
        ]);
      });

      it('should pass through attrs for decisionItem', () => {
        const itemAttrs = { localId: 'cheese', state: 'DECIDED' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = validateNode({
          type: 'decisionItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('decisionItem');
        expect(attrs).to.deep.equal(itemAttrs);
        expect(content).to.deep.equal([
          { ...itemContent[0], valid: true, originalNode: itemContent[0] },
        ]);
      });

      it('should generate localId for decisionItem if missing', () => {
        const itemAttrs = { state: 'DECIDED' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = validateNode({
          type: 'decisionItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('decisionItem');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.state).to.equal('DECIDED');
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal([
          { ...itemContent[0], valid: true, originalNode: itemContent[0] },
        ]);
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
        const { type, attrs, content } = validateNode({
          type: 'taskList',
          attrs: listAttrs,
          content: listContent,
        });
        expect(type).to.equal('taskList');
        expect(attrs).to.deep.equal(listAttrs);
        expect(content).to.deep.equal([
          { ...listContent[0], valid: true, originalNode: listContent[0] },
        ]);
      });

      it('should generate localId for taskList if missing', () => {
        const listContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = validateNode({
          type: 'taskList',
          content: listContent,
        });
        expect(type).to.equal('taskList');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal([
          { ...listContent[0], valid: true, originalNode: listContent[0] },
        ]);
      });

      it('should pass through attrs for taskItem', () => {
        const itemAttrs = { localId: 'cheese', state: 'DONE' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = validateNode({
          type: 'taskItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('taskItem');
        expect(attrs).to.deep.equal(itemAttrs);
        expect(content).to.deep.equal([
          { ...itemContent[0], valid: true, originalNode: itemContent[0] },
        ]);
      });

      it('should generate localId for taskItem if missing', () => {
        const itemAttrs = { state: 'DONE' };
        const itemContent = [
          {
            type: 'text',
            text: 'content',
          },
        ];
        const { type, attrs, content } = validateNode({
          type: 'taskItem',
          attrs: itemAttrs,
          content: itemContent,
        });
        expect(type).to.equal('taskItem');
        expect(attrs).to.not.equal(undefined);
        expect(attrs.state).to.equal('DONE');
        expect(attrs.localId).to.not.equal(undefined);
        expect(content).to.deep.equal([
          { ...itemContent[0], valid: true, originalNode: itemContent[0] },
        ]);
      });
    });

    describe('image', () => {
      it('should pass through attrs as image', () => {
        const imageAttrs = {
          src: 'http://example.com/test.jpg',
          alt: 'explanation',
          title: 'image',
        };
        const { type, attrs } = validateNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).to.equal('image');
        expect(attrs).to.deep.equal(imageAttrs);
      });

      it('should pass through attrs with only src as image', () => {
        const imageAttrs = { src: 'http://example.com/test.jpg' };
        const { type, attrs } = validateNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).to.equal('image');
        expect(attrs).to.deep.equal(imageAttrs);
      });

      it('should reject image without src', () => {
        const imageAttrs = { alt: 'explanation' };
        const { type } = validateNode({
          type: 'image',
          attrs: imageAttrs,
        });
        expect(type).to.equal('text');
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
          const { type, attrs } = validateNode({
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
            const { type, attrs } = validateNode({
              type: nodeName,
              attrs: testAttr,
              content: [],
            });
            expect(type).to.equal(nodeName);
            expect(attrs).to.deep.equal(testAttr);
          });
        });

        it(`should reject ${nodeName} without content`, () => {
          const { type } = validateNode({
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
      const result = validateNode(doc, schema);

      expect(result.content![0].type).to.equal('text');
      expect(result.content![0].text).to.equal('[rule]');
    });
  });

  describe('getValidUnknownNode', () => {
    describe('unknown inline nodes', () => {
      it('should return "text" node if content is absent', () => {
        const node = { type: 'foobar' };
        const unknownInlineNode = getValidUnknownNode(node, node);
        expect(unknownInlineNode.type).to.equal('text');
      });

      it('should return "text" node if content is empty', () => {
        const node = {
          type: 'foobar',
          content: [],
        };

        const unknownInlineNode = getValidUnknownNode(node, node);
        expect(unknownInlineNode.type).to.equal('text');
      });

      it('should store textUrl attribute in "href" attribute', () => {
        const node = {
          type: 'foobar',
          attrs: { textUrl: 'https://www.atlassian.com' },
        };

        const unknownInlineNode = getValidUnknownNode(node, node);
        expect(unknownInlineNode.marks).to.have.length(1);
        expect(unknownInlineNode.marks![0].attrs.href).to.equal(
          'https://www.atlassian.com',
        );
      });

      it('should not store unsafe textUrl attribute in "href" attribute', () => {
        const node = {
          type: 'foobar',
          attrs: { textUrl: 'javascript:alert("haxx")' },
        };

        const unknownInlineNode = getValidUnknownNode(node, node);
        expect(unknownInlineNode.marks).to.equal(undefined);
      });

      it('should use default text', () => {
        const node = {
          type: 'foobar',
          text: 'some text',
          attrs: { text: 'some text from attrs' },
        };

        const unknownInlineNode = getValidUnknownNode(node, node);
        expect(unknownInlineNode.text).to.equal('some text');
      });

      it('should use node.attrs.text if text is missing', () => {
        const node = {
          type: 'foobar',
          attrs: { text: 'some text from attrs' },
        };

        const unknownInlineNode = getValidUnknownNode(node, node);
        expect(unknownInlineNode.text).to.equal('some text from attrs');
      });

      it('should use original type in square brackets if neither text nor attrs.text is missing', () => {
        const node = { type: 'foobar' };
        const unknownInlineNode = getValidUnknownNode(node, node);
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

        const unknownBlockNode = getValidUnknownNode(node, node);
        expect(unknownBlockNode).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello',
              valid: true,
              originalNode: node.content[0],
            },
            {
              type: 'text',
              text: ' ',
              valid: true,
              originalNode: null,
            },
            {
              type: 'text',
              text: 'world',
              valid: false,
              originalNode: node.content[1],
            },
          ],
          valid: false,
          originalNode: node,
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

        const unknownBlockNode = getValidUnknownNode(node, node);
        expect(unknownBlockNode).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello mate',
              valid: true,
              originalNode: node.content[0].content[0],
            },
            {
              type: 'hardBreak',
              valid: true,
              originalNode: null,
            },
            {
              type: 'text',
              text: 'this is',
              valid: true,
              originalNode: (node.content[1].content[0] as any).content[0],
            },
            {
              type: 'text',
              text: ' ',
              valid: true,
              originalNode: null,
            },
            {
              type: 'text',
              text: 'Sydney!',
              valid: false,
              originalNode: (node.content[1].content[0] as any).content[1],
            },
          ],
          valid: false,
          originalNode: node,
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

        const unknownBlockNode = getValidUnknownNode(node, node);
        expect(unknownBlockNode).to.deep.equal({
          type: 'unknownBlock',
          content: [
            {
              type: 'text',
              text: 'hello mate',
              valid: true,
              originalNode: node.content[0].content[0],
            },
            {
              type: 'hardBreak',
              valid: true,
              originalNode: null,
            },
            {
              type: 'text',
              text: 'this is',
              valid: true,
              originalNode: (node.content[1].content[0] as any).content[0]
                .content[0],
            },
            {
              type: 'text',
              text: ' ',
              valid: true,
              originalNode: null,
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
              valid: false,
              originalNode: (node.content[1].content[0] as any).content[0]
                .content[1],
            },
          ],
          valid: false,
          originalNode: node,
        });
      });
    });
  });

  describe('getValidMark', () => {
    describe('unknown', () => {
      it('should return null if type is unkown', () => {
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

  describe('convertToValidatedDoc', () => {
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
      const expectedValidDoc: ADDoc = {
        type: 'doc',
        version: 1,
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
      const newDoc = getValidDocument(convertToValidatedDoc(original));

      // Ensure original is not mutated
      expect(originalCopy, 'Original unchanged').to.deep.equal(original);
      expect(JSON.stringify(newDoc), 'New doc valid').to.deep.equal(
        JSON.stringify(expectedValidDoc),
      );
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
      const expectedValidDoc: ADDoc = {
        type: 'doc',
        version: 1,
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
      const newDoc = getValidDocument(convertToValidatedDoc(original));
      expect(JSON.stringify(newDoc)).to.deep.equal(
        JSON.stringify(expectedValidDoc),
      );
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

      expect(
        JSON.stringify(getValidDocument(convertToValidatedDoc(original))),
      ).to.deep.equal(
        JSON.stringify({
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [],
                  text: 'Hello World',
                },
              ],
            },
          ],
        }),
      );
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

      expect(
        JSON.stringify(
          getValidDocument(convertToValidatedDoc(original, schema, 'stage0')),
        ),
      ).to.deep.equal(
        JSON.stringify({
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  marks: [
                    {
                      type: 'confluenceInlineComment',
                      attrs: {
                        reference: 'ref',
                      },
                    },
                  ],
                  text: 'Hello World',
                },
              ],
            },
          ],
        }),
      );
    });
  });
});
