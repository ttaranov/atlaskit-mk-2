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
 * @param {Object} node node
 * @param {Object} opts plugin params
 * @param {Object} extra plugin extra information
 */
exports.fn = function replaceIDs(node, opts) {
  const placeholderStr = opts.placeholderStr;

  if (node.isElem('linearGradient') && node.hasAttr('id')) {
    node.attrs.id.value += `-${placeholderStr}`;
  } else if (node.hasAttr('fill')) {
    const fillAttr = node.attr('fill');
    const replacedFillValue = fillAttr.value.replace(
      /\burl\(("|')?#(.+?)\1\)/,
      `url(#$2-${placeholderStr})`,
    );

    node.attrs.fill.value = replacedFillValue;
  }

  return node;
};
