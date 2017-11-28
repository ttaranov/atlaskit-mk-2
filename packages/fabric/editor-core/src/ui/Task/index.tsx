import * as React from 'react';
import { PureComponent, ReactElement } from 'react';
import {
  default as ProviderFactory,
  WithProviders
} from '../../providerFactory';
import { ResourcedTaskItem as AkTaskItem } from '@atlaskit/task-decision';

export interface TaskProps {
  taskId: string;
  providers?: ProviderFactory;
  isDone: boolean;
  contentRef?: (node: HTMLElement | undefined) => void;
  onChange?: (taskId: string, isChecked: boolean) => void;
  showPlaceholder?: boolean;
  children?: ReactElement<any>;
}

export default class TaskItem extends PureComponent<TaskProps, {}> {
  private providerFactory: ProviderFactory;

  constructor(props) {
    super(props);
    this.providerFactory = props.providers || new ProviderFactory();
  }

  componentWillUnmount() {
    if (!this.props.providers) {
      // new ProviderFactory is created if no `providers` has been set
      // in this case when component is unmounted it's safe to destroy this providerFactory
      this.providerFactory.destroy();
    }
  }

  private renderWithProvider = (providers) => {
    // const {
    //   taskId,
    //   contentRef,
    //   isDone,
    //   onChange,
    //   showPlaceholder,
    //   children,
    // } = this.props;

    // const {
    //   taskDecisionProvider,
    // } = providers;

    // return (
    //   <AkTaskItem
    //     taskId={taskId}
    //     contentRef={contentRef}
    //     isDone={isDone}
    //     onChange={onChange}
    //     showPlaceholder={showPlaceholder}
    //     taskDecisionProvider={taskDecisionProvider}
    //     objectAri=''
    //     containerAri=''
    //   >
    //     {children}
    //   </AkTaskItem>
    // );
    const {
      taskId,
      isDone,
      onChange,
      children,
    } = this.props;

    const {
      taskDecisionProvider,
    } = providers;

    return (
      <AkTaskItem
        taskId={taskId}
        isDone={isDone}
        onChange={onChange}
        taskDecisionProvider={taskDecisionProvider}
        objectAri=''
        containerAri=''
      >
        {children}
      </AkTaskItem>
    );
  }

  render() {
    return (
      <WithProviders
        providers={['taskDecisionProvider']}
        providerFactory={this.providerFactory}
        renderNode={this.renderWithProvider}
      />
    );
  }
}
