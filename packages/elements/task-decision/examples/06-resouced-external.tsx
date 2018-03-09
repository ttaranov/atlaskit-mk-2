import * as React from 'react';
import { PureComponent } from 'react';

import { TaskDecisionProvider } from '../src/types';
import ResourcedItemList from '../src/components/ResourcedItemList';
import TaskDecisionResource from '../src/api/TaskDecisionResource';
import {
  createRenderer,
  SidebarContainer,
} from '../example-helpers/story-utils';

let tdConfig;
try {
  // tslint:disable-next-line import/no-unresolved, no-var-requires
  tdConfig = require('../local-config')['default'];
} catch (e) {
  // tslint:disable-next-line import/no-unresolved, no-var-requires
  tdConfig = require('../local-config-example')['default'];
}

interface NotifyChangesProps {
  taskDecisionProvider: TaskDecisionProvider;
  height?: number | string;
  useInfiniteScroll?: boolean;
}

class NotifyChanges extends PureComponent<NotifyChangesProps, {}> {
  private renderDocument;

  componentWillMount() {
    const { taskDecisionProvider } = this.props;
    if (taskDecisionProvider) {
      this.renderDocument = createRenderer(taskDecisionProvider);
    }
  }

  componentWillReceiveProps(nextProps: NotifyChangesProps) {
    const { taskDecisionProvider } = nextProps;
    if (taskDecisionProvider !== this.props.taskDecisionProvider) {
      if (taskDecisionProvider) {
        this.renderDocument = createRenderer(taskDecisionProvider);
      } else {
        this.renderDocument = undefined;
      }
    }
  }

  handleNotify = () => {
    this.props.taskDecisionProvider.notifyRecentUpdates(
      tdConfig.initialQuery.containerAri,
    );
  };

  render() {
    if (!this.props.taskDecisionProvider || !this.renderDocument) {
      return null;
    }

    const { height, taskDecisionProvider, useInfiniteScroll } = this.props;

    return (
      <div>
        <div>
          Select <button onClick={this.handleNotify}>notify</button> to look for
          newest items from service.
        </div>
        <SidebarContainer>
          <ResourcedItemList
            renderDocument={this.renderDocument}
            initialQuery={tdConfig.initialQuery}
            taskDecisionProvider={Promise.resolve(taskDecisionProvider)}
            useInfiniteScroll={useInfiniteScroll}
            height={height}
          />
        </SidebarContainer>
      </div>
    );
  }
}

const taskDecisionProvider = new TaskDecisionResource(tdConfig.serviceConfig);

export default () => (
  <div>
    <h3>Real data</h3>
    <NotifyChanges taskDecisionProvider={taskDecisionProvider} />

    <h3>Real data - infinite scroll</h3>
    <div
      style={{
        width: '400px',
      }}
    >
      <NotifyChanges
        taskDecisionProvider={taskDecisionProvider}
        height="400px"
        useInfiniteScroll={true}
      />
    </div>
  </div>
);
