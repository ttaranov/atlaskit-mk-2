import * as React from 'react';
import { PureComponent } from 'react';
import FabricAnalyticsListener from '@atlaskit/analytics-listeners';

import { Query } from '../src/types';
import ResourcedItemList, { Props } from '../src/components/ResourcedItemList';
import {
  analyticsWebClientMock,
  createProviders,
  SidebarContainer,
  Grid,
  Item,
} from '../example-helpers/story-utils';

const initialQuery: Query = {
  containerAri: 'cheese',
  limit: 100,
};

const initialQueryByLastUpdateDate: Query = {
  ...initialQuery,
  sortCriteria: 'lastUpdateDate',
};

interface WithResetState {
  query: Query;
}

class ResourcedItemListWithReset extends PureComponent<Props, WithResetState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      query: props.initialQuery,
    };
  }

  onResetQuery = () => {
    this.setState({
      query: {
        ...this.props.initialQuery,
      },
    });
  };

  render() {
    return (
      <div>
        <div>
          <button onClick={this.onResetQuery}>Reset initial query</button>
        </div>
        <SidebarContainer>
          <ResourcedItemList {...this.props} initialQuery={this.state.query} />
        </SidebarContainer>
      </div>
    );
  }
}

const { renderDocument, taskDecisionProvider } = createProviders();
const { taskDecisionProvider: taskDecisionProviderInfinite } = createProviders({
  hasMore: true,
});
const {
  taskDecisionProvider: taskDecisionProviderInfiniteSlow,
} = createProviders({ hasMore: true, lag: 500 });
const {
  taskDecisionProvider: taskDecisionProviderInfiniteSlow5000,
} = createProviders({ hasMore: true, lag: 5000 });
const {
  taskDecisionProvider: taskDecisionProviderInfiniteSlowReset,
} = createProviders({ hasMore: true, lag: 500 });
const { taskDecisionProvider: taskDecisionProviderEmpty } = createProviders({
  empty: true,
});
const { taskDecisionProvider: taskDecisionProviderError } = createProviders({
  error: true,
});

export default () => (
  <Grid>
    <Item>
      <h3>Simple</h3>

      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProvider}
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Simple - capture analytics</h3>
      <FabricAnalyticsListener client={analyticsWebClientMock}>
        <SidebarContainer>
          <ResourcedItemList
            renderDocument={renderDocument}
            initialQuery={initialQuery}
            taskDecisionProvider={taskDecisionProvider}
          />
        </SidebarContainer>
      </FabricAnalyticsListener>
    </Item>
    <Item>
      <h3>Infinite loading</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProviderInfinite}
          useInfiniteScroll={true}
          height="400px"
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Infinite loading slow 500ms</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProviderInfiniteSlow}
          useInfiniteScroll={true}
          height="400px"
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Infinite loading slow 5000ms</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProviderInfiniteSlow5000}
          useInfiniteScroll={true}
          height="400px"
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Infinite loading slow 500ms with reset</h3>
      <ResourcedItemListWithReset
        renderDocument={renderDocument}
        initialQuery={initialQuery}
        taskDecisionProvider={taskDecisionProviderInfiniteSlowReset}
        useInfiniteScroll={true}
        height="400px"
      />
    </Item>
    <Item>
      <h3>Group by last update date</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQueryByLastUpdateDate}
          taskDecisionProvider={taskDecisionProvider}
          groupItems={true}
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Group by last update date - Infinite loading</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQueryByLastUpdateDate}
          taskDecisionProvider={taskDecisionProviderInfinite}
          groupItems={true}
          useInfiniteScroll={true}
          height="400px"
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Group by last update date - Infinite loading slow 500ms</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQueryByLastUpdateDate}
          taskDecisionProvider={taskDecisionProviderInfiniteSlow}
          groupItems={true}
          useInfiniteScroll={true}
          height="400px"
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Group by (default) creation date</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProvider}
          groupItems={true}
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Empty stage</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProviderEmpty}
          groupItems={true}
          emptyComponent={<div>Empty result</div>}
        />
      </SidebarContainer>
    </Item>
    <Item>
      <h3>Error stage</h3>
      <SidebarContainer>
        <ResourcedItemList
          renderDocument={renderDocument}
          initialQuery={initialQuery}
          taskDecisionProvider={taskDecisionProviderError}
          groupItems={true}
          errorComponent={<div>Error result</div>}
        />
      </SidebarContainer>
    </Item>
  </Grid>
);
