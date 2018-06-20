import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Provider, Card, Client } from '../src';
import '../mocks';

const clientWithProvider = new Client({
  temporaryResolver: (url: string) =>
    console.log('resolver', url) ||
    Promise.resolve(
      url === 'public-happy'
        ? {
            url,
            name: 'From provider',
          }
        : undefined,
    ),
});

export default () => (
  <Page>
    <Provider>
      <Grid>
        <GridColumn>
          <p>
            <small>
              This card <em>DOES NOT</em> use a provider.
            </small>
          </p>
          <br />
          {/* <Card url="public-happy"/> */}
          <br />
          <Card url="private-happy" />
        </GridColumn>
      </Grid>
    </Provider>
    <br />
    <br />
    <Provider client={clientWithProvider}>
      <Grid>
        <GridColumn>
          <p>
            <small>
              This card <em>DOES</em> use a provider.
            </small>
          </p>
          <br />
          {/* <Card url="public-happy"/> */}
          <br />
          <Card url="private-happy" />
        </GridColumn>
      </Grid>
    </Provider>
  </Page>
);
