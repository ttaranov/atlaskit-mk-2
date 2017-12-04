// @flow

import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
This banner component is designed to display a prominent message at the
top of the page. It animates its opening and closing.

${(
  <Example
    Component={require('../examples/AnimationExample').default}
    title="Simple Example"
    source={require('!!raw-loader!../examples/AnimationExample')}
  />
)}

${(
  <Props
    props={require('!!extract-react-types-loader!../src/components/Banner')}
  />
)}
`;

// export const examples = [
//   {
//     title: 'Warning Usage',
//     Component: WarningBanner,
//     src: warningBannerSrc,
//   },
//   {
//     title: 'Error Usage',
//     Component: ErrorBanner,
//     src: errorBannerSrc,
//   },
//   {
//     title: 'Toggle Banner',
//     Component: AnimationExample,
//     src: animationExampleSrc,
//   },
// ];
