import * as React from 'react';
import styled from 'styled-components';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { mentionPluginKey } from '../../plugins/mentions';
import WithFlash from '../WithFlash';

export interface MobileEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const MobileEditor: any = styled.div`
  height: 100%;
  min-height: 30px;
  width: 100%;
  max-width: inherit;
  box-sizing: border-box;
  word-wrap: break-word;

  div > .ProseMirror {
    outline: none;
    white-space: pre-wrap;
    padding: 0;
    margin: 0;
  }
`;
MobileEditor.displayName = 'MobileEditor';

// tslint:disable-next-line:variable-name
const ContentArea = styled(ContentStyles)`
  height: 100%;

  .ProseMirror {
    /** Make it full page minus the padding */
    min-height: calc(100vh - 40px);
  }
`;
ContentArea.displayName = 'ContentArea';

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  any
> {
  static displayName = 'MobileEditor';

  private appearance: EditorAppearance = 'mobile';
  private containerElement: HTMLElement | undefined;

  private handleRef = ref => {
    this.containerElement = ref;
    if (this.props.onUiReady) {
      this.props.onUiReady(ref);
    }
  };

  private renderMobile = ({ maxContentSize, mentions }) => {
    const {
      editorView,
      eventDispatcher,
      providerFactory,
      customContentComponents,
      maxHeight,
      disabled,
      editorDOMElement,
    } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;
    return (
      <WithFlash animate={maxContentSizeReached}>
        <MobileEditor
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
              containerElement={this.containerElement}
              disabled={!!disabled}
            />
            {editorDOMElement}
          </ContentArea>
        </MobileEditor>
      </WithFlash>
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
          mentions: mentionPluginKey,
        }}
        render={this.renderMobile}
      />
    );
  }
}
