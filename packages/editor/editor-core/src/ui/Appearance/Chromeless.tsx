import * as React from 'react';
import styled from 'styled-components';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { scrollbarStyles } from '../styles';
import WithFlash from '../WithFlash';

export interface ChromelessEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const ChromelessEditor: any = styled.div`
  line-height: 20px;
  height: auto;
  min-height: 30px;
  ${(props: ChromelessEditorProps) =>
    props.maxHeight
      ? 'max-height: ' + props.maxHeight + 'px;'
      : ''} overflow-x: hidden;
  overflow-y: auto;
  ${scrollbarStyles} max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

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

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'ChromelessEditorAppearance';

  private appearance: EditorAppearance = 'chromeless';
  private containerElement: HTMLElement | undefined;

  private renderChrome = ({ maxContentSize }) => {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      maxHeight,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      disabled,
    } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;

    return (
      <WithFlash animate={maxContentSizeReached}>
        <ChromelessEditor
          maxHeight={maxHeight}
          innerRef={ref => (this.containerElement = ref)}
        >
          <ContentArea>
            {customContentComponents}
            <PluginSlot
              editorView={editorView}
              editorActions={editorActions}
              eventDispatcher={eventDispatcher}
              providerFactory={providerFactory}
              appearance={this.appearance}
              items={contentComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              containerElement={this.containerElement}
              disabled={!!disabled}
            />
            {editorDOMElement}
          </ContentArea>
        </ChromelessEditor>
      </WithFlash>
    );
  };

  render() {
    return (
      <WithPluginState
        plugins={{ maxContentSize: maxContentSizePluginKey }}
        render={this.renderChrome}
      />
    );
  }
}
