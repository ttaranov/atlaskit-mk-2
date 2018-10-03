import * as React from 'react';
import { Component } from 'react';
import { EditorView } from 'prosemirror-view';
import { pluginKey as widthPluginKey } from '../../plugins/width';
import { WidthConsumer } from '@atlaskit/editor-common';

export interface Props {
  editorView: EditorView;
  contentArea?: HTMLElement | null;
}

export default class WidthEmitter extends Component<Props> {
  private width: number;
  private debounce: number | null = null;

  render() {
    return (
      <WidthConsumer>
        {({ width }) => this.broadcastWidth(width) || null}
      </WidthConsumer>
    );
  }

  private broadcastWidth = width => {
    const { editorView } = this.props;
    if (editorView && this.width !== width) {
      if (this.debounce) {
        clearTimeout(this.debounce);
      }

      // NodeViews will trigger multiple state change error without this debounce
      this.debounce = setTimeout(() => {
        const pmDom = this.props.contentArea
          ? this.props.contentArea.querySelector('.ProseMirror')
          : undefined;
        const tr = editorView.state.tr.setMeta(widthPluginKey, {
          width,
          lineLength: pmDom ? pmDom.clientWidth : undefined,
        });

        tr.setMeta('isLocal', true);
        editorView.dispatch(tr);
        this.width = width;
        this.debounce = null;
      }, 10);
    }
  };
}
