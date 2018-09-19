import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Provider, Card } from '../src';
import { mockMultipleCards } from '../mocks';

mockMultipleCards();

export default () => (
  <Provider>
    <Page>
      <Grid>
        <GridColumn>
          <br />
          <Card url="google.com/doc/1" appearance="block" />
          <br />
          <Card url="google.com/doc/2" appearance="block" />
          <br />
          <Card url="google.com/doc/3" appearance="block" />
          <br />
          <Card url="google.com/doc/1" appearance="block" />
          <br />
          <Card url="google.com/spreadshet/1" appearance="block" />
          <br />
          <Card url="google.com/spreadshet/2" appearance="block" />
          <br />
          <Card url="dropbox.com/file/a.doc" appearance="block" />
          <br />
          <Card url="trello.com/task/a" appearance="block" />
        </GridColumn>
      </Grid>
    </Page>
  </Provider>
);
