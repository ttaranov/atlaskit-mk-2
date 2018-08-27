export const createTypeAheadPlugin = ({
  getItems,
  selectItem,
}: {
  getItems?: Function;
  selectItem?: Function;
} = {}) => {
  return {
    pluginsOptions: {
      typeAhead: {
        trigger: '/',
        getItems:
          getItems !== undefined
            ? getItems
            : () => [{ title: '1' }, { title: '2' }, { title: '3' }],
        selectItem:
          selectItem !== undefined
            ? selectItem
            : (state, item, replaceWith) =>
                replaceWith(state.schema.text(`${item.title} selected`)),
      },
    },
  };
};
