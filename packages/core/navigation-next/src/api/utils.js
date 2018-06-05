// @flow

type ItemId = string;
type ViewItem = { id: ItemId, items?: ?View, legacyId?: ItemId };
type View = ViewItem[];
type ItemSelector = ViewItem => boolean;
type ItemModifier = ViewItem => ViewItem | ViewItem[] | null;

/**
 * View traversal function
 */

// Recursively map over all the items in a view, and if an item satisfies a
// given selector, apply a modifier to it.
const walkView = (selector: ItemSelector) => (modifier: ItemModifier) => (
  view: ViewItem[],
) => {
  const walk = walkView(selector)(modifier);
  let newView = [];
  view.forEach(viewItem => {
    let item = { ...viewItem };
    if (item.items && item.items.length) {
      item = { ...item, items: walk(item.items) };
    }
    if (selector(item)) {
      item = modifier(item);
    }

    if (Array.isArray(item)) {
      newView = [...newView, ...item];
    } else if (item && typeof item === 'object') {
      newView = [...newView, item];
    }
  });
  return newView;
};

/**
 * Pre-configured selectors
 */

// Modify the item in a view with the given id.
const findId = (itemId: ItemId) => walkView(({ id }) => itemId === id);

// Modify items in a view with an id that matches the given regular expression.
const matchId = (regexp: RegExp) => walkView(({ id }) => regexp.test(id));

// Modify the item in a view with the given legacyId.
const findLegacyId = (itemId: ItemId) =>
  walkView(({ legacyId }) => itemId === legacyId);

// Modify items in a view with a legacyId that matches the given regular
// expression.
const matchLegacyId = (regexp: RegExp) =>
  walkView(({ legacyId }) => !!legacyId && regexp.test(legacyId));

/**
 * Common modifiers
 */

// Removes the selected item from the view.
const removeItem = () => null;

// Inserts an array of items before the selected item.
const insertBefore = (inserted: View) => (item: ViewItem) => [
  ...inserted,
  item,
];

// Inserts an array of items after the selected item.
const insertAfter = (inserted: View) => (item: ViewItem) => [item, ...inserted];

// Adds items to the end of the selected item's `items` array.
const appendChildren = (appended: View) => (item: ViewItem) => ({
  ...item,
  items: [...(item.items || []), ...appended],
});

// Adds items to the start of the selected item's `items` array.
const prependChildren = (prepended: View) => (item: ViewItem) => ({
  ...item,
  items: [...prepended, ...(item.items || [])],
});

// Replaces the selected item's onClick property with the provided callback. The
// callback is passed the item object followed by any other arguments. If the
// item already has an onClick property this will be called after the provided
// callback, unless the callback returns `false`.
const handleClick = (onClickCb: ViewItem => mixed) => (item: ViewItem) => ({
  ...item,
  onClick: (...args: mixed[]) => {
    const res = onClickCb(item, ...args);
    if (res !== false && typeof item.onClick === 'function') {
      item.onClick();
    }
  },
});

export default {
  appendChildren,
  findId,
  findLegacyId,
  handleClick,
  insertAfter,
  insertBefore,
  matchId,
  matchLegacyId,
  prependChildren,
  removeItem,
  walkView,
};
