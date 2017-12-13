// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Use tabs to display multiple panels within a single window.

  ${(
    <Props
      heading="Tabs Props"
      props={require('!!extract-react-types-loader!../src/components/Tabs')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="tabContentComponent Provided Props"
      props={require('!!extract-react-types-loader!../src/components/TabContent')}
    />
  )}

  ${(
    <Props
      heading="tabItemComponent Provided Props"
      props={require('!!extract-react-types-loader!../src/components/TabItem')}
    />
  )}
`;
