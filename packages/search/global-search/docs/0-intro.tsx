import { md, code } from '@atlaskit/docs';

export default md`
  A search component that connects to the Atlassian cross-product search backend.

  ## Using the component

  Primary use case for the component is to be displayed in Navigation. Put in the drawers prop of the Navigation component as follows:

  ${code`
  import { GlobalQuickSearch } from '@atlaskit/global-search';

  <Navigation
    drawers={[
      <AkSearchDrawer ...props>
        <GlobalQuickSearch cloudId="{cloudId} />
      </AkSearchDrawer>,
    ]}
  </Navigation>
  `}
`;
