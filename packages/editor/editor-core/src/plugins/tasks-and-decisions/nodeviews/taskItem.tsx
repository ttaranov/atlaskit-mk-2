import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import { AnalyticsListener } from '@atlaskit/analytics-next';
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

  /**
   * Dynamically generates analytics data relating to the parent list.
   *
   * Required to be dynamic, as list (in prosemirror model) may have
   * changed (e.g. item movements, or additional items in list).
   * This node view will have not rerendered for those changes, so
   * cannot render the position and listSize into the
   * AnalyticsContext at initial render time.
   */
  private addListAnalyticsData = event => {
    try {
      const resolvedPos = this.view.state.doc.resolve(this.getPos());
      const position = resolvedPos.index();
      const listSize = resolvedPos.parent.childCount;
      const listLocalId = resolvedPos.parent.attrs.localId;

      event.update(payload => {
        const { attributes = {}, actionSubject } = payload;
        if (actionSubject !== 'action') {
          // Not action related, ignore
          return payload;
        }
        return {
          ...payload,
          attributes: {
            ...attributes,
            position,
            listSize,
            listLocalId,
          },
        };
      });
    } catch (e) {
      // This can occur if pos is NaN (seen it in some test cases)
      // Act defensively here, and lose some analytics data rather than
      // cause any user facing error.
    }
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

    return (
      <AnalyticsListener
        channel="fabric-elements"
        onEvent={this.addListAnalyticsData}
      >
        <TaskItem
          taskId={localId}
          contentRef={forwardRef}
          isDone={state === 'DONE'}
          onChange={this.handleOnChange}
          showPlaceholder={this.isContentEmpty()}
          providers={props.providerFactory}
        />
      </AnalyticsListener>
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
  providerFactory: ProviderFactory,
) {
  return (node: any, view: any, getPos: () => number): NodeView => {
    return new Task(node, view, getPos, portalProviderAPI, {
      providerFactory,
    }).init();
  };
}
