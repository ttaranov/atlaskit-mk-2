import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Provider, Card, Client } from '../src';
// import '../mocks';

const clientWithResolver = new Client({
  TEMPORARY_resolver: (url: string) =>
    Promise.resolve(
      url === 'public-happy'
        ? {
            url,
            name: 'From resolver',
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
              This card <em>DOES NOT</em> use an additional resolver.
            </small>
          </p>
          <br />
          <Card url="public-happy" appearance="block" />
          <br />
          <Card url="private-happy" appearance="block" />
        </GridColumn>
      </Grid>
    </Provider>
    <br />
    <br />
    <Provider client={clientWithResolver}>
      <Grid>
        <GridColumn>
          <p>
            <small>
              This card <em>DOES</em> use an additional resolver.
            </small>
          </p>
          <br />
          <Card url="public-happy" appearance="block" />
          <br />
          <Card url="private-happy" appearance="block" />
        </GridColumn>
      </Grid>
    </Provider>
  </Page>
);
