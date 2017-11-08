import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { akColorR100 } from '@atlaskit/util-shared-styles';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import {
  EditorAppearanceComponentProps,
  EditorAppearance
} from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';

const pulseBackground = keyframes`
  50% {
    background-color: ${akColorR100};
  }
`;

const pulseBackgroundReverse = keyframes`
  0% {
    background-color: ${akColorR100};
  }
  50% {
    background-color: auto;
  }
  100% {
    background-color: ${akColorR100};
  }
`;

export interface ChromelessEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const ChromelessEditor: any = styled.div`
  height: auto;
  min-height: 30px;
  ${(props: ChromelessEditorProps) => props.maxHeight ? 'max-height: ' + props.maxHeight + 'px;' : ''}
  overflow-x: hidden;
  overflow-y: auto;

  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;
  animation: ${(props: any) => props.isMaxContentSizeReached ? `.25s ease-in-out ${pulseBackground}` : 'none'};

  &.-flash {
    animation: .25s ease-in-out ${pulseBackgroundReverse};
  }

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
ChromelessEditor.displayName = 'ChromelessEditor';

// tslint:disable-next-line:variable-name
const ContentArea = styled(ContentStyles)``;
ContentArea.displayName = 'ContentArea';

export default class Editor extends React.Component<EditorAppearanceComponentProps, any> {
  static displayName = 'ChromelessEditorAppearance';

  private flashToggle = false;

  private appearance: EditorAppearance = 'chromeless';

  private handleRef = ref => {
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  }

  private renderChrome = ({ maxContentSize }) => {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      maxHeight,
      popupsMountPoint,
      popupsBoundariesElement
    } = this.props;
    const maxContentSizeReached = maxContentSize && maxContentSize.maxContentSizeReached;
    this.flashToggle = maxContentSizeReached && !this.flashToggle;

    return (
      <ChromelessEditor
        className={this.flashToggle ? '-flash' : ''}
        isMaxContentSizeReached={maxContentSizeReached}
        maxHeight={maxHeight}
      >
        <ContentArea innerRef={this.handleRef}>
          {customContentComponents}
          <PluginSlot
            editorView={editorView}
            eventDispatcher={eventDispatcher}
            providerFactory={providerFactory}
            appearance={this.appearance}
            items={contentComponents}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
          />
        </ContentArea>
      </ChromelessEditor>
    );
  }

  render() {
    const { eventDispatcher, editorView } = this.props;

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{ maxContentSize: maxContentSizePluginKey }}
        render={this.renderChrome}
      />
    );
  }
}
