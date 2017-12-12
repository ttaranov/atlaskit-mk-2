// @flow
/**
 * This is the template for an auto-generated icon component.
 */
module.exports = (
  svg: () => mixed,
  displayName: string,
) => `import React from 'react';
import Icon from '@atlaskit/icon';

const ${
  displayName
} = props => (<Icon dangerouslySetGlyph={\`${svg.toString()}\`} {...props} />);
export default ${displayName};
`;
