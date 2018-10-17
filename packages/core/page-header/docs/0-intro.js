// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The page header pattern is a template that helps combine other components (breadcrumbs, headings, actions, and selects) to create a consistent user experience.

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={require('../examples/BasicExample').default}
      source={require('!!raw-loader!../examples/BasicExample')}
      title="Basic example"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={require('../examples/ComplexExample').default}
      source={require('!!raw-loader!../examples/ComplexExample')}
      title="Complex example"
    />
  )}

  ${(
    <Example
      packageName="@atlaskit/page-header"
      Component={require('../examples/CustomTitleComponentExample').default}
      source={require('!!raw-loader!../examples/CustomTitleComponentExample')}
      title="Custom title component example"
    />
  )}

  ${<Props props={require('!!extract-react-types-loader!../src/PageHeader')} />}
`;
