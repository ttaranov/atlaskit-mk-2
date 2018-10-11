// @flow

import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

export default md`

  TODO: Description of the component

  ## Usage

  TODO: Code usage of component.

${code`
  import component from '@atlaskit/component';

  <Component>
`}

  ${(
    <Example
      Component={require('pathToExample').default}
      title="Basic"
      source={require('!!raw-loader!pathToExample')}
    />
  )}

  ${(
    <Props
      heading="Component Props"
      props={require('!!extract-react-types-loader!pathToComponentsSource')}
    />
  )}
`;
