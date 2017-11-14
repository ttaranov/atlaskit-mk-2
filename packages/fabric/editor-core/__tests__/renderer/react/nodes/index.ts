import {
  mergeTextNodes,
  isText,
  isTextWrapper,
} from '../../../../src/renderer/react/nodes';

describe('Renderer - React/Nodes', () => {

  describe('mergeTextNodes', () => {

    it('should wrap adjecent text nodes in a textWrapper', () => {
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

      expect(mergeTextNodes(input)).toEqual([
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

  describe('isTextWrapper', () => {
      it('should return true if type equals "textWrapper"', () => {
        expect(isTextWrapper('textWrapper')).toBe(true);
      });

      it('should return false if type does not equal "textWrapper"', () => {
        expect(isTextWrapper('mention')).toBe(false);
      });
    });

    describe('isText', () => {
      it('should return true if type equals "text"', () => {
        expect(isText('text')).toBe(true);
      });

      it('should return false if type does not equal "text"', () => {
        expect(isText('mention')).toBe(false);
      });
    });

});
