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
import { AddonToolbar } from '../Addon';

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

export interface MessageEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const MessageEditor: any = styled.div`
  display: flex;
  border: 1px solid ${(props: MessageEditorProps) => props.isMaxContentSizeReached ? '#FF8F73' : '#C1C7D0' };
  border-radius: 3px;
  height: auto;
  min-height: 30px;
  ${(props: MessageEditorProps) => props.maxHeight ? 'max-height: ' + props.maxHeight + 'px;' : ''}
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;
  animation: ${(props: MessageEditorProps) => props.isMaxContentSizeReached ? `.25s ease-in-out ${pulseBackground}` : 'none'};

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

// tslint:disable-next-line:variable-name
const ContentArea = styled(ContentStyles)`
  padding: 4px 16px 4px 8px;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
`;

// tslint:disable-next-line:variable-name
const SecondaryToolbarContainer = styled.div`
  padding: 2px 4px 0 0;
  margin-bottom: -2px;
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: flex-end;
  flex-shrink: 0;
  display: flex;
`;

export default class Editor extends React.Component<EditorAppearanceComponentProps, any> {
  static displayName = 'MessageEditor';

  private flashToggle = false;

  private appearance: EditorAppearance = 'message';

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
      secondaryToolbarComponents,
      customContentComponents,
      customSecondaryToolbarComponents,
      addonToolbarComponents,
      maxHeight,
      popupsMountPoint,
      popupsBoundariesElement
    } = this.props;
    const maxContentSizeReached = maxContentSize && maxContentSize.maxContentSizeReached;
    this.flashToggle = maxContentSizeReached && !this.flashToggle;

    return (
      <MessageEditor
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
        <SecondaryToolbarContainer>
          <PluginSlot
            editorView={editorView}
            eventDispatcher={eventDispatcher}
            providerFactory={providerFactory}
            appearance={this.appearance}
            items={secondaryToolbarComponents}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
          />
          {customSecondaryToolbarComponents}
          <AddonToolbar dropdownItems={addonToolbarComponents} />
        </SecondaryToolbarContainer>
      </MessageEditor>
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
