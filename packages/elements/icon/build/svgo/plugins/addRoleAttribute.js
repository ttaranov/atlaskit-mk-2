// @flow

exports.type = 'full';

exports.active = true;

exports.description = 'Hides SVG elements from screen readers';

const roleAttribute = {
  name: 'role',
  local: 'role',
  prefix: '',
  value: 'presentation',
};

/*::
type dataType = {
  content: any[]
}
*/

exports.fn = function addRoleAttribute(data /*: dataType*/) {
  const svg = data.content[0];
  if (svg.isElem('svg') && !svg.hasAttr(roleAttribute.name)) {
    svg.addAttr(roleAttribute);
  }
  return data;
};
