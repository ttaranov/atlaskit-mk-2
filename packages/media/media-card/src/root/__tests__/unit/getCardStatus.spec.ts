import { getCardStatus } from '../../card/getCardStatus';
import { CardState, CardProps } from '../../..';

describe('getCardStatus()', () => {
  describe('image files', () => {
    it.skip('should keep existing status', () => {
      const state = {
        metadata: {
          size: 1,
          mediaType: 'image',
          name: '',
        },
      } as CardState;
      const props = {
        identifier: {
          id: '1',
          mediaItemType: 'file',
        },
      } as CardProps;

      expect(getCardStatus(state, props)).toEqual('');
    });

    it.only('should override status to complete if preview is available', () => {
      const state = {
        metadata: {
          size: 1,
          mediaType: 'image',
          name: '',
        },
      } as CardState;
      const props = {
        identifier: {
          id: '1',
          mediaItemType: 'file',
        },
      } as CardProps;

      expect(getCardStatus(state, props)).toEqual('');
    });
  });

  describe('non image files', () => {
    it('should return complete status if enough metadata is already available', () => {});

    it('should return right status for non image files', () => {
      // TODO
    });

    it('should keep current status if identifier is not a file', () => {
      // TODO
    });
  });
});
