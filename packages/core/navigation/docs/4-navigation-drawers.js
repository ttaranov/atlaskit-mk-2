// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
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
