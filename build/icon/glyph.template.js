// @flow
/**
 * This is the template for an auto-generated icon component.
 */
module.exports = (
  svg /*: () => mixed*/,
  displayName /*: string*/,
  wayHome /*: string*/,
  size /*:? string */,
) => `import React from 'react';
import Icon from '${wayHome}';

const ${displayName} = props => (<Icon dangerouslySetGlyph={\`${svg.toString()}\`} {...props} ${
  size ? `size="${size}"` : ''
} />);
${displayName}.displayName = '${displayName}';
export default ${displayName};
`;
