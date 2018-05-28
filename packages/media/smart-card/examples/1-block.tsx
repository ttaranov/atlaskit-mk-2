import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Provider, BlockCard } from '../src';
import '../src/mocks';

const URL_A = 'private-happy';

export default () => (
  <Provider>
    <Page>
      <Grid>
        <GridColumn>
          <small>
            These cards are all for the same URL. They should share a cache and
            stay in sync with each other when they are updated.
          </small>
          <br />
          <BlockCard url={URL_A} />
          <br />
          <BlockCard url={URL_A} />
          <br />
          <BlockCard url={URL_A} />
        </GridColumn>
      </Grid>
    </Page>
  </Provider>
);
