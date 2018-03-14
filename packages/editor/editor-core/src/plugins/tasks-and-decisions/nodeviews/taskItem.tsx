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
    const { view } = this;
    const { state } = view;
    const { doc, schema, tr } = state;
    const nodePos = this.getPos();
    const node = doc.nodeAt(nodePos)!;

    tr.replaceWith(
      nodePos,
      nodePos + node.nodeSize,
      schema.nodes.taskItem.create(
        { state: isChecked ? 'DONE' : 'TODO' },
        node.content,
      ),
    );

    view.dispatch(tr);
  };

  private renderReactComponent() {
    this.domRef = document.createElement('li');
    this.domRef.style['list-style-type'] = 'none';

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
     * Returning false here when the previous content was empty – fixes an error where the editor fails to set selection
     * inside the contentDOM after a transaction. See ED-2374.
     */
    return !this.isContentEmpty || node.type !== this.node.type;
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
