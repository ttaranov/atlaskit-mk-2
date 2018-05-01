// @flow
exports.type = 'perItem';

exports.active = true;

exports.description =
  'Removes attributes with a namespace (e.g. xmlns:link, ns:foo, ...)';

// flowlint-next-line unclear-type:off
exports.fn = function removeNamespacedAttributes(item /*: any*/) {
  item.eachAttr(attr => {
    if (attr.prefix && attr.local) {
      item.removeAttr(attr.name);
    }
  });
};
