// @flow

import React from 'react';
import { code, md, Example, Props } from '@atlaskit/docs';

// The core parts of the intro page for your examples documentation are:
// 1. A summary description
// 2. An example of how to import the component as a codeblock, showing sub-components as well
// 3. An example pulled from the examples folder which shows the most basic implementation
// 4. A flexible spot for more descriptions and possible more examples to help convey extra meaning
// 5. Props information. If your package exports multiple components, you should add a props heading for
//    each, or use separate pages in docs to document each exported component.

export default md`

  TODO: Description of the component

  ## Usage

  TODO: Code usage of component.

${code`
  import Component from '@atlaskit/component';

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
