// @flow
import reducerUtils from '../../reducer-utils';

const view = { id: 'item-id', items: [], legacyId: 'legacy-item-id' };

describe('NavigationNext View Controller: Reducer Utils', () => {
  describe('#prependChildren', () => {
    it('should prepend the view item in `items` array', () => {
      const itemToPrepend = { ...view, id: 'my-new-id' };
      expect(reducerUtils.prependChildren([view])(itemToPrepend)).toEqual({
        ...itemToPrepend,
        items: [view],
      });
    });

    it('should combine the view items in `items` array if second view item has a list of items', () => {
      const itemToPrepend = {
        ...view,
        id: 'my-new-id',
        items: [{ ...view, id: 'another-id' }],
      };
      expect(reducerUtils.prependChildren([view])(itemToPrepend)).toEqual({
        ...itemToPrepend,
        items: [view, ...itemToPrepend.items],
      });
    });
  });

  describe('#appendChildren', () => {
    it('should append the view item in `items` array', () => {
      const itemToPrepend = { ...view, id: 'my-new-id' };
      expect(reducerUtils.appendChildren([view])(itemToPrepend)).toEqual({
        ...itemToPrepend,
        items: [view],
      });
    });

    it('should append the first view items with the second in `items` array if second view item has a list of items', () => {
      const itemToPrepend = {
        ...view,
        id: 'my-new-id',
        items: [{ ...view, id: 'another-id' }],
      };
      expect(reducerUtils.appendChildren([view])(itemToPrepend)).toEqual({
        ...itemToPrepend,
        items: [...itemToPrepend.items, view],
      });
    });
  });

  describe('#insertBefore', () => {
    it('should append the view item in `items` array', () => {
      const itemToPrepend = { ...view, id: 'my-new-id' };
      expect(reducerUtils.insertBefore([view])(itemToPrepend)).toEqual([
        view,
        itemToPrepend,
      ]);
    });
  });

  describe('#insertAfter', () => {
    it('should append the view item in `items` array', () => {
      const itemToPrepend = { ...view, id: 'my-new-id' };
      expect(reducerUtils.insertAfter([view])(itemToPrepend)).toEqual([
        itemToPrepend,
        view,
      ]);
    });
  });
});
