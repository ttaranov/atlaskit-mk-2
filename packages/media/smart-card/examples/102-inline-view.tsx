import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ResolvedView } from '../src/inline/ResolvedView';

export default () => (
  <Page>
    <Grid>
      <GridColumn>
        <h4>ResolvedView</h4>

        <ResolvedView
          text="MSW-524: [RFC] Api for inline Link cards UI component"
          onClick={() =>
            window.open('https://product-fabric.atlassian.net/browse/MSW-524')
          }
        />
        <br />
        <ResolvedView
          icon="https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg"
          text="MSW-524: [RFC] Api for inline Link cards UI component"
          lozenge={{
            text: 'in progress',
            appearance: 'inprogress',
          }}
          onClick={() =>
            window.open('https://product-fabric.atlassian.net/browse/MSW-524')
          }
        />
        <br />
        <ResolvedView
          icon="https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg"
          text="MSW-524: [RFC] Api for inline Link cards UI component"
          lozenge={{
            text: 'in progress',
            appearance: 'inprogress',
          }}
          isSelected={true}
        />
      </GridColumn>
    </Grid>
  </Page>
);
