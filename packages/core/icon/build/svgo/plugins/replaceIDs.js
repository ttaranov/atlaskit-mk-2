// @flow
exports.type = 'perItem';

exports.active = true;

exports.params = {
  placeholderStr: 'idPlaceholder',
};

exports.description =
  'Replace static linearGradient IDs with a variable placeholder';

/**
 * Replaces linearGradient IDs with a variable placeholder to allow easy str replace later.
 *
 * The original IDs are still kept as they are still necessary to distinguish multiple
 * gradient fills within a single icon.
 *
 * @param {Object} item item
 * @param {Object} opts plugin params
 * @param {Object} extra plugin extra information
 */
exports.fn = function replaceIDs(
  item /*: any*/,
  opts /*: {
  placeholderStr: string,
}*/,
) {
  const placeholderStr = opts.placeholderStr;

  if (item.isElem('linearGradient') && item.hasAttr('id')) {
    item.attrs.id.value += `-${placeholderStr}`;
  } else if (item.hasAttr('fill')) {
    const fillAttr = item.attr('fill');
    const replacedFillValue = fillAttr.value.replace(
      /\burl\(("|')?#(.+?)\1\)/,
      `url(#$2-${placeholderStr})`,
    );

    item.attrs.fill.value = replacedFillValue;
  }

  return item;
};
