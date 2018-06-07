import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ResolvedView } from '../src/inline/ResolvedView';

export default () => (
  <Page>
    <Grid>
      <GridColumn>
        <h4>ResolvedView</h4>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc a semper
        ex, vel molestie arcu. Phasellus commodo
        <ResolvedView
          title="MSW-524: [RFC] Api for inline Link cards UI component"
          onClick={() =>
            window.open('https://product-fabric.atlassian.net/browse/MSW-524')
          }
        />
        quam eu vulputate blandit. Nullam consequat auctor condimentum. Praesent
        laoreet ultricies libero egestas mattis. Nulla iaculis ullamcorper nisl
        ut
        <ResolvedView
          icon="https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg"
          title="MSW-524: [RFC] Api for inline Link cards UI component"
          lozenge={{
            text: 'in progress',
            appearance: 'inprogress',
          }}
          onClick={() =>
            window.open('https://product-fabric.atlassian.net/browse/MSW-524')
          }
        />
        vehicula. Donec volutpat libero id ullamcorper faucibus. Sed vestibulum
        tincidunt tortor ut laoreet. Nulla posuere, nisi et aliquet interdum,
        <ResolvedView
          icon="https://product-fabric.atlassian.net/images/icons/issuetypes/story.svg"
          title="MSW-524: [RFC] Api for inline Link cards UI component"
          lozenge={{
            text: 'in progress',
            appearance: 'inprogress',
          }}
          isSelected={true}
        />
        nunc mauris bibendum mauris, in consequat mi est vitae mauris. Phasellus
        dictum sollicitudin nunc in gravida.
      </GridColumn>
    </Grid>
  </Page>
);
