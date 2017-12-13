// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Use tabs to display multiple panels within a single window.

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="Tabs Props"
      props={require('!!extract-react-types-loader!../src/components/Tabs')}
    />
  )}

  ### \`tabContentComponent\` Provided Props

  These props are provided to the component that you pass to \`tabContentComponent\`.

  ${(
    <Props
      heading=" "
      props={require('!!extract-react-types-loader!../src/components/TabContent')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/30-custom-tab-content-component').default}
      title="Custom tabContentComponent"
      source={require('!!raw-loader!../examples/30-custom-tab-content-component')}
    />
  )}

  ### \`tabItemComponent\` Provided Props
  
  These props are provided to the component that you pass to \`tabItemComponent\`.

  ${(
    <Props
      heading=" "
      props={require('!!extract-react-types-loader!../src/components/TabItem')}
    />
  )}

  ${(
    <Example
      Component={require('../examples/20-custom-tab-item-components').default}
      title="Custom tabItemComponent"
      source={require('!!raw-loader!../examples/20-custom-tab-item-components')}
    />
  )}
`;
