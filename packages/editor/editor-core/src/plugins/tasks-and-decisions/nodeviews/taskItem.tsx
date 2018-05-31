import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { AnalyticsDelegate, AnalyticsDelegateProps } from '@atlaskit/analytics';
import { ContentNodeView } from '../../../nodeviews';
import TaskItem from '../ui/Task';

type getPosHandler = () => number;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class Task extends ContentNodeView implements NodeView {
  private domRef: HTMLElement | undefined;
  private node: PMNode;
  private view: EditorView;
  private getPos: getPosHandler;
  private isContentEmpty: boolean = false;
  private analyticsDelegateContext: AnalyticsDelegateProps;
  private providerFactory: ProviderFactory;

  constructor(
    node: PMNode,
    view: EditorView,
    getPos: getPosHandler,
    analyticsDelegateContext: AnalyticsDelegateProps,
    providerFactory: ProviderFactory,
  ) {
    super(node, view);
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.isContentEmpty = node.content.childCount === 0;
    this.analyticsDelegateContext = analyticsDelegateContext;
    this.providerFactory = providerFactory;
    this.renderReactComponent();
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

  private renderReactComponent() {
    this.domRef = document.createElement('li');
    this.domRef.style['list-style-type'] = 'none';
    this.domRef.style['cursor'] = 'move';

    const node = this.node;
    const { localId, state } = node.attrs;

    const taskItem = (
      <TaskItem
        taskId={localId}
        contentRef={this.handleRef}
        isDone={state === 'DONE'}
        onChange={this.handleOnChange}
        showPlaceholder={this.isContentEmpty}
        providers={this.providerFactory}
      />
    );
    ReactDOM.render(
      <AnalyticsDelegate {...this.analyticsDelegateContext}>
        {taskItem}
      </AnalyticsDelegate>,
      this.domRef,
    );
  }

  get dom() {
    return this.domRef;
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

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    super.destroy();
  }
}

export function taskItemNodeViewFactory(
  analyticsDelegateContext: AnalyticsDelegateProps,
  providerFactory: ProviderFactory,
) {
  return (node: any, view: any, getPos: () => number): NodeView => {
    return new Task(
      node,
      view,
      getPos,
      analyticsDelegateContext,
      providerFactory,
    );
  };
}
