// @flow
import React from 'react';
import { code, Props, md } from '@atlaskit/docs';

import { IframeExample } from './shared';

export default md`${code`import GlobalNavigation from '@atlaskit/global-navigation';`}

${(
  <IframeExample
    source={require('!!raw-loader!../examples/00-basic-global-navigation')}
    title="The GlobalNavigation component"
    url="/examples.html?groupId=core&packageId=global-navigation&exampleId=basic-global-navigation"
  />
)}

${(
  <Props
    heading="GlobalNavigation props"
    props={require('!!extract-react-types-loader!../src/components/GlobalNavigation')}
  />
)}
`;
