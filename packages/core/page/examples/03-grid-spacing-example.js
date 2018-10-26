// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';

import Page, { Grid, GridColumn } from '../src';

const Dummy = styled.div`
  background: #fea;
`;

export default function LayoutExample (props) {
  render() {
    return (
      <div>
        <Page>
          <h2>Cosy Spacing (Default)</h2>
          <Grid>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
          </Grid>

          <h2>Compact Spacing</h2>
          <Grid spacing="compact">
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
          </Grid>

          <h2>Comfortable Spacing</h2>
          <Grid spacing="comfortable">
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
            <GridColumn medium={2}>
              <Dummy>2 col</Dummy>
            </GridColumn>
          </Grid>
        </Page>
      </div>
    );
  }
}
