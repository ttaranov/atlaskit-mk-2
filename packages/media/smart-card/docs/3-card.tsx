import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`

  ${(
    <Example
      Component={require('../examples/0-intro').default}
      title="An editable example"
      source={require('!!raw-loader!../examples/0-intro')}
    />
  )}

  ${(
    <Props
      heading="Card props"
      props={require('!!extract-react-types-loader!../src/Card/index')}
    />
  )}


`;
