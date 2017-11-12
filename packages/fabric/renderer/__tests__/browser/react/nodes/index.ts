import { expect } from 'chai';
import { Fragment } from 'prosemirror-model';
import {
  mergeTextNodes,
  isEmojiDoc,
  isText,
  isTextWrapper,
} from '../../../../src/react/nodes';;
import { testData as emojiTestData } from '@atlaskit/emoji/dist/es5/support';

const toEmojiAttrs = (emoji) => {
  const { shortName, id, fallback } = emoji;
  return {
    shortName,
    id,
    text: fallback || shortName,
  };
};

const toEmojiId = (emoji) => {
  const { shortName, id, fallback } = emoji;
  return { shortName, id, fallback };
};

export const grinEmojiAttrs = toEmojiAttrs(emojiTestData.grinEmoji);
export const grinEmojiId = toEmojiId(emojiTestData.grinEmoji);

describe('Renderer - React/Nodes', () => {

  describe('mergeTextNodes', () => {

    it('should wrap adjacent text nodes in a textWrapper', () => {
      const input = [
        {
          type: {
            name: 'text'
          },
          text: 'hello '
        },
        {
          type: {
            name: 'text'
          },
          text: 'world! '
        },
        {
          type: {
            name: 'mention'
          },
          attrs: {
            id: 'abcd-abcd-abcd',
            text: '@Oscar Wallhult'
          }
        },
        {
          type: {
            name: 'text'
          },
          text: ' is my name!'
        }
      ];

      expect(mergeTextNodes(input)).to.deep.equal([
        {
          type: {
            name: 'textWrapper'
          },
          content: [
            {
              type: {
                name:  'text'
              },
              text: 'hello '
            },
            {
              type: {
                name:  'text'
              },
              text: 'world! '
            }
          ]
        },
        {
          type: {
            name: 'mention'
          },
          attrs: {
            id: 'abcd-abcd-abcd',
            text: '@Oscar Wallhult'
          }
        },
        {
          type: {
            name: 'textWrapper'
          },
          content: [
            {
              type: {
                name: 'text'
              },
              text: ' is my name!'
            }
          ]
        }
      ]);
    });
  });

  describe('isEmojiDoc', () => {
    it('should return true for a single emoji', () => {
      const content = [
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
      ];

      expect(isEmojiDoc(content)).to.equal(true);
    });

    it('should return true for up to three emojis', () => {
      const content = [
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
      ];

      expect(isEmojiDoc(content)).to.equal(true);
    });

    it('should return false for more than three emojis', () => {
      const content = [
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
      ];

      expect(isEmojiDoc(content)).to.equal(false);
    });

    it('should return false if no emojis', () => {
      const content = [
        {
          type: {
            name: 'text'
          },
          text: ' '
        },
      ];

      expect(isEmojiDoc(content)).to.equal(false);
    });

    it('should ignore surrounding whitespace when determining whether the paragraph is any emoji block', () => {
      const content = [
        {
          type: {
            name: 'text'
          },
          text: '	         '
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'text'
          },
          text: '	                         '
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'text'
          },
          text: '		'
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'text'
          },
          text: '	'
        },
      ];

      expect(isEmojiDoc(content)).to.equal(true);
    });

    it('should return false if the block contains non-whitespace text', () => {
      const content = [
        {
          type: {
            name: 'text'
          },
          text: 'This is text'
        },
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
      ];

      expect(isEmojiDoc(content)).to.equal(false);
    });

    it('should return false if there is a non-text or non-emoji node', () => {
      const content = [
        {
          type: {
            name: 'emoji'
          },
          attrs: {
            ...grinEmojiAttrs,
          }
        },
        {
          type: {
            name: 'mention'
          },
          attrs: {
            id: 'here',
            accessLevel: 'CONTAINER'
          },
          text: '@here'
        },
      ];

      expect(isEmojiDoc(content)).to.equal(false);
    });
  });

  describe('isTextWrapper', () => {
    it('should return true if type equals "textWrapper"', () => {
      expect(isTextWrapper('textWrapper')).to.equal(true);
    });

    it('should return false if type does not equal "textWrapper"', () => {
      expect(isTextWrapper('mention')).to.equal(false);
    });
  });

  describe('isText', () => {
    it('should return true if type equals "text"', () => {
      expect(isText('text')).to.equal(true);
    });

    it('should return false if type does not equal "text"', () => {
      expect(isText('mention')).to.equal(false);
    });
  });

});
