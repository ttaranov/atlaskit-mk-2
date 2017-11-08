import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView,  NodeView } from 'prosemirror-view';

import { TaskItem } from '@atlaskit/task-decision';

type getPosHandler = () => number;

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

class Task implements NodeView {
  private domRef: HTMLElement | undefined;
  private contentDOMRef: HTMLElement | undefined;
  private node: PMNode;
  private view: EditorView;
  private getPos: getPosHandler;
  private showPlaceholder: boolean = false;

  constructor(node: PMNode, view: EditorView, getPos: getPosHandler) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;
    this.showPlaceholder = node.content.childCount === 0;
    this.renderReactComponent();
  }

  private handleRef = (node: HTMLElement | undefined) => {
    this.contentDOMRef = node;
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
      schema.nodes.taskItem.create({ state: isChecked ? 'DONE' : 'TODO' }, node.content)
    );

    view.dispatch(tr);
  }

  private renderReactComponent() {
    this.domRef = document.createElement('li');
    this.domRef.style['list-style-type'] = 'none';

    const node = this.node;
    const { localId } = node.attrs;

    // tslint:disable-next-line:variable-name
    ReactDOM.render(
      <TaskItem
        taskId={localId}
        contentRef={this.handleRef}
        isDone={node.attrs.state === 'DONE'}
        onChange={this.handleOnChange}
        showPlaceholder={this.showPlaceholder}
      />,
      this.domRef
    );
  }

  get dom() {
    return this.domRef;
  }

  get contentDOM() {
    return this.contentDOMRef;
  }

  update() {
    /**
     * Returning false here fixes an error where the editor fails to set selection
     * inside the contentDOM after a transaction. See ED-2374.
     */
    return false;
  }

  destroy() {
    ReactDOM.unmountComponentAtNode(this.domRef!);
    this.domRef = undefined;
    this.contentDOMRef = undefined;
  }
}

export const taskItemNodeView = (node: any, view: any, getPos: () => number): NodeView => {
  return new Task(node, view, getPos);
};
