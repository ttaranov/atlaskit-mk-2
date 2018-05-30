import * as React from 'react';

import ResourcedDecisionItem from '../src/components/ResourcedDecisionItem';
import {
  Grid,
  Item,
  getMockTaskDecisionResource,
} from '../example-helpers/story-utils';

const mockTaskDecisionProvider = Promise.resolve(
  getMockTaskDecisionResource({ lag: 1000 }),
);

export default () => (
  <Grid>
    <Item>
      <h3>Normal</h3>
      <div>
        <ResourcedDecisionItem
          localId="d1"
          objectAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003"
          containerAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/12e445f8-478c-4902-a556-f4866b273033"
          taskDecisionProvider={mockTaskDecisionProvider}
        >
          Have a Swedish Fika
        </ResourcedDecisionItem>
        <hr />
        <ResourcedDecisionItem
          localId="d1"
          objectAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:message/f1328342-7c28-11e7-a5e8-02420aff0003"
          containerAri="ari:cloud:app.cloud:f7ebe2c0-0309-4687-b913-41d422f2110b:conversation/12e445f8-478c-4902-a556-f4866b273033"
          taskDecisionProvider={mockTaskDecisionProvider}
        >
          Have a Swedish Fika
        </ResourcedDecisionItem>
      </div>
    </Item>
  </Grid>
);
