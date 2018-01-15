import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import { EditorView } from 'prosemirror-view';
import SizeDetector from '@atlaskit/size-detector';
import { pluginKey as widthPluginKey } from '../../plugins/width';

const WidthDetectorWrapper = styled.div`
  height: 0;
  width: 100%:
`;

export interface Props {
  editorView: EditorView;
}

export default class WidthDetector extends Component<Props> {
  private width: number;
  private debounce: number | null = null;

  render() {
    return (
      <WidthDetectorWrapper>
        <SizeDetector>
          {({ width }) => this.broadcastWidth(width) || null}
        </SizeDetector>
      </WidthDetectorWrapper>
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
        editorView.dispatch(editorView.state.tr.setMeta(widthPluginKey, width));
        this.width = width;
        this.debounce = null;
      }, 10);
    }
  };
}
