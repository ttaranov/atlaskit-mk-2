import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { AnalyticsDelegate, AnalyticsDelegateProps } from '@atlaskit/analytics';
import { ReactNodeView } from '../../../nodeviews';
import TaskItem from '../ui/Task';
import { PortalProviderAPI } from '../../../ui/PortalProvider';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class Task extends ReactNodeView {
  private isContentEmpty() {
    return this.node.content.childCount === 0;
  }

  private handleOnChange = (taskId: string, isChecked: boolean) => {
    const { tr } = this.view.state;
    const nodePos = this.getPos();

    tr.setNodeMarkup(nodePos, undefined, {
      state: isChecked ? 'DONE' : 'TODO',
      localId: taskId,
    });

    this.view.dispatch(tr);
  };

  getDomRef() {
    const domRef = document.createElement('li');
    domRef.style['list-style-type'] = 'none';
    return domRef;
  }

  getContentDOM() {
    return { dom: document.createElement('div') };
  }

  render(props, forawardRef) {
    const node = this.node;
    const { localId, state } = node.attrs;

    const taskItem = (
      <TaskItem
        taskId={localId}
        contentRef={forawardRef}
        isDone={state === 'DONE'}
        onChange={this.handleOnChange}
        showPlaceholder={this.isContentEmpty()}
        providers={props.providerFactory}
      />
    );

    return (
      <AnalyticsDelegate {...props.analyticsDelegateContext}>
        {taskItem}
      </AnalyticsDelegate>
    );
  }

  update(node: PMNode) {
    /**
     * Return false here because allowing node updates breaks 'checking the box'
     * when using collab editing.
     *
     * This is likely because the taskDecisionProvider is updating itself &
     * Prosemirror is interfering.
     */
    return false;
  }
}

export function taskItemNodeViewFactory(
  portalProviderAPI: PortalProviderAPI,
  analyticsDelegateContext: AnalyticsDelegateProps,
  providerFactory: ProviderFactory,
) {
  return (node: any, view: any, getPos: () => number): NodeView => {
    return new Task(node, view, getPos, portalProviderAPI, {
      analyticsDelegateContext,
      providerFactory,
    });
  };
}
