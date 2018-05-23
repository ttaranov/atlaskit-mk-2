// @flow

type ViewItem = { items?: ?View };
type View = ViewItem[];
type ItemReducer = ViewItem => ViewItem;

const replaceViewItem = (itemId: string, itemReducer: ItemReducer) => (
  view: View,
) => {
  const replaceItem = replaceViewItem(itemId, itemReducer);
  return view.map(viewItem => {
    if (viewItem.id === itemId) {
      return itemReducer(viewItem);
    }

    if (viewItem.items && viewItem.items.length) {
      return { ...viewItem, items: replaceItem(viewItem.items) };
    }

    return viewItem;
  });
};

const appendToGroup = (groupId: string, appended: View) =>
  replaceViewItem(groupId, group => ({
    ...group,
    items: [...(group.items || []), ...appended],
  }));

const prependToGroup = (groupId: string, prepended: View) =>
  replaceViewItem(groupId, group => ({
    ...group,
    items: [...prepended, ...(group.items || [])],
  }));

export default {
  appendToGroup,
  prependToGroup,
};
