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

  createDomRef() {
    const domRef = document.createElement('li');
    domRef.style['list-style-type'] = 'none';
    return domRef;
  }

  getContentDOM() {
    return { dom: document.createElement('div') };
  }

  render(props, forwardRef) {
    const { localId, state } = this.node.attrs;

    const taskItem = (
      <TaskItem
        taskId={localId}
        contentRef={forwardRef}
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

  update(node: PMNode, decorations) {
    /**
     * Returning false here when the previous content was empty fixes an error where the editor fails to set selection
     * inside the contentDOM after a transaction. See ED-2374.
     *
     * Returning false also when the task state has changed to force the checkbox to update. See ED-5107
     */
    return super.update(
      node,
      decorations,
      (currentNode, newNode) =>
        !this.isContentEmpty() &&
        !!(currentNode.attrs.state === newNode.attrs.state),
    );
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
    }).init();
  };
}
