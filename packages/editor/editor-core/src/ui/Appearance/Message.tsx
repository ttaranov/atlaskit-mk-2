import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { akColorR100 } from '@atlaskit/util-shared-styles';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { pluginKey as isMultilineContentPluginKey } from '../../plugins/is-multiline-content';
import { AddonToolbar, ClickAreaInline } from '../Addon';
import { scrollbarStyles } from '../styles';

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

const MessageEditor: any = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  border: 1px solid
    ${(props: MessageEditorProps) =>
      props.isMaxContentSizeReached ? '#FF8F73' : '#C1C7D0'};
  border-radius: 3px;
  height: auto;
  min-height: 34px;
  box-sizing: border-box;
  word-wrap: break-word;
  animation: ${(props: MessageEditorProps) =>
    props.isMaxContentSizeReached
      ? `.25s ease-in-out ${pulseBackground}`
      : 'none'};

  &.-flash {
    animation: 0.25s ease-in-out ${pulseBackgroundReverse};
  }

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;

const ContentArea: any = styled(ContentStyles)`
  line-height: 20px;
  padding: 6px 16px 4px 8px;
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  max-width: inherit;
  width: ${(props: any) => (props.isMultiline ? '100%' : 'auto')};
  max-height: ${(props: MessageEditorProps) =>
    props.maxHeight ? props.maxHeight + 'px' : 'none'};

  ${scrollbarStyles};
`;

const ToolbarArea: any = styled(ContentStyles)`
  display: flex;
  width: ${(props: any) => (props.isMultiline ? '100%' : 'auto')};
`;

const SecondaryToolbarContainer: any = styled.div`
  padding: 2px 4px 0 0;
  margin-bottom: -1px;
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: flex-end;
  flex-shrink: 0;
  display: flex;
`;

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'MessageEditor';

  private flashToggle = false;
  private appearance: EditorAppearance = 'message';

  private focusEditor = e => {
    if (this.props.editorActions) {
      this.props.editorActions.focus();
    }
  };

  private renderChrome = ({ maxContentSize, isMultilineContent }) => {
    const {
      disabled,
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      contentComponents,
      secondaryToolbarComponents,
      customContentComponents,
      customSecondaryToolbarComponents,
      addonToolbarComponents,
      maxHeight,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
    } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;
    this.flashToggle = maxContentSizeReached && !this.flashToggle;

    return (
      <MessageEditor
        className={this.flashToggle ? '-flash' : ''}
        isMaxContentSizeReached={maxContentSizeReached}
        onClick={this.focusEditor}
      >
        <ContentArea maxHeight={maxHeight} isMultiline={isMultilineContent}>
          {customContentComponents}
          <PluginSlot
            disabled={!!disabled}
            editorView={editorView}
            editorActions={editorActions}
            eventDispatcher={eventDispatcher}
            providerFactory={providerFactory}
            appearance={this.appearance}
            items={contentComponents}
            popupsMountPoint={popupsMountPoint}
            popupsBoundariesElement={popupsBoundariesElement}
            popupsScrollableElement={popupsScrollableElement}
          />
          {editorDOMElement}
        </ContentArea>
        <ToolbarArea isMultiline={isMultilineContent}>
          <ClickAreaInline editorView={editorView} />
          <SecondaryToolbarContainer>
            <PluginSlot
              disabled={disabled || maxContentSizeReached}
              editorView={editorView}
              editorActions={editorActions}
              eventDispatcher={eventDispatcher}
              providerFactory={providerFactory}
              appearance={this.appearance}
              items={secondaryToolbarComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
            />
            {customSecondaryToolbarComponents}
            <AddonToolbar
              dropdownItems={addonToolbarComponents}
              isReducedSpacing={true}
            />
          </SecondaryToolbarContainer>
        </ToolbarArea>
      </MessageEditor>
    );
  };

  render() {
    const { eventDispatcher, editorView } = this.props;

    return (
      <WithPluginState
        editorView={editorView}
        eventDispatcher={eventDispatcher}
        plugins={{
          maxContentSize: maxContentSizePluginKey,
          isMultilineContent: isMultilineContentPluginKey,
        }}
        render={this.renderChrome}
      />
    );
  }
}
