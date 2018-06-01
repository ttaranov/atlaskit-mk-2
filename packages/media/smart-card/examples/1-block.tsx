import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { Provider, BlockCard } from '../src';
import '../src/mocks';

const URL_A = 'private-happy';
const URL_B = 'private-happy-b';
const URL_C = 'private-happy-c';

export default () => (
  <Provider>
    <Page>
      <Grid>
        <GridColumn>
          <p>
            <small>
              These cards are all for the same URL. They should all be in the
              same state with the same content at the exact same time.
            </small>
          </p>
          <br />
          <BlockCard url={URL_A} />
          <br />
          <BlockCard url={URL_A} />
          <br />
          <BlockCard url={URL_A} />
        </GridColumn>
      </Grid>
      <br />
      <br />
      <Grid>
        <GridColumn>
          <p>
            <small>
              These cards are all for the same provider. They should maintain
              their own states and different content, but they should refresh if
              any one of them is authenticated.
            </small>
          </p>
          <br />
          <BlockCard url={URL_A} />
          <br />
          <BlockCard url={URL_B} />
          <br />
          <BlockCard url={URL_C} />
        </GridColumn>
      </Grid>
      <br />
      <br />
      <Grid>
        <GridColumn>
          <p>
            <small>
              These cards are all different URLs for different providers. They
              should not share any state or any content.
            </small>
          </p>
          <br />
          <BlockCard url="" />
          <br />
          <BlockCard url="" />
          <br />
          <BlockCard url="" />
        </GridColumn>
      </Grid>
    </Page>
  </Provider>
);
