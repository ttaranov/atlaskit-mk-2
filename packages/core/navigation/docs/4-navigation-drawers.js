// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`

  Drawers are designed to enter from the left of the screen and overlay the site,
  allowing additional options to be visible that are outside or may change the
  page. The two standard drawers are \`AkCreateDrawer\` and \`AkSearchDrawer\`,
  which are designed to line up with the global navigation icons to open them.

  Navigation also exports components to implement search.

  ${(
    <Props
      shouldCollapseProps
      heading="AkCreateDrawer"
      props={require('!!extract-react-types-loader!../src/components/js/drawers/CreateDrawer.js')}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkSearchDrawer"
      props={require('!!extract-react-types-loader!../src/components/js/drawers/SearchDrawer.js')}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkSearch"
      props={require('!!extract-react-types-loader!../src/components/js/Search.js')}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkQuickSearch"
      props={require('!!extract-react-types-loader!../src/components/js/quick-search/QuickSearch.js')}
    />
  )}

  ${(
    <Props
      shouldCollapseProps
      heading="AkCustomDrawer"
      props={require('!!extract-react-types-loader!../src/components/js/drawers/CustomDrawer.js')}
    />
  )}
`;

// AkCreateDrawer
// AkCustomDrawer
// AkSearchDrawer
// export { default as AkSearch } from './components/js/Search';
// export {
//   default as AkQuickSearch,
// } from './components/js/quick-search/QuickSearch';
