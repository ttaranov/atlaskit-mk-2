import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import {
  akColorR100,
  akColorN40,
  akBorderRadius,
  akGridSize,
} from '@atlaskit/util-shared-styles';
import Toolbar from '../Toolbar';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { stateKey as mediaPluginKey } from '../../plugins/media/pm-plugins/main';
import { tableCommentEditorStyles } from '../../plugins/table/ui/styles';

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

export interface CommentEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}

// tslint:disable-next-line:variable-name
const CommentEditor: any = styled.div`
  display: flex;
  flex-direction: column;

  min-width: 272px;
  /* Border + Toolbar + Footer + (Paragraph + ((Parahraph + Margin) * (DefaultLines - 1)) */
  /* calc(2px + 40px + 24px + ( 20px + (32px * 2))) */
  min-height: 150px;
  height: auto;
  ${(props: CommentEditorProps) =>
    props.maxHeight
      ? 'max-height: ' + props.maxHeight + 'px;'
      : ''} background-color: white;
  border: 1px solid ${akColorN40};
  box-sizing: border-box;
  border-radius: ${akBorderRadius};

  max-width: inherit;
  word-wrap: break-word;

  animation: ${(props: any) =>
    props.isMaxContentSizeReached
      ? `.25s ease-in-out ${pulseBackground}`
      : 'none'};

  &.-flash {
    animation: 0.25s ease-in-out ${pulseBackgroundReverse};
  }
`;
CommentEditor.displayName = 'CommentEditor';

const TableControlsPadding = 16;

// tslint:disable-next-line:variable-name
const MainToolbar = styled.div`
  position: relative;
  align-items: center;
  padding: ${akGridSize} ${akGridSize} 0;
  display: flex;
  height: auto;

  padding-left: ${TableControlsPadding}px;

  & > div > *:first-child {
    margin-left: 0;
  }
`;
MainToolbar.displayName = 'MainToolbar';

// tslint:disable-next-line:variable-name
const MainToolbarCustomComponentsSlot = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-grow: 1;
  padding-right: ${TableControlsPadding}px;
  > div {
    display: flex;
    flex-shrink: 0;
  }
`;
MainToolbarCustomComponentsSlot.displayName = 'MainToolbar';

// tslint:disable-next-line:variable-name
const ContentArea = styled(ContentStyles)`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  line-height: 24px;

  /** Hack for Bitbucket to ensure entire editorView gets drop event; see ED-3294 **/
  /** Hack for tables controlls. Otherwise marging collapse and controlls are misplaced. **/
  .ProseMirror {
    padding: 0 12px;
  }

  padding: ${TableControlsPadding}px;

  ${tableCommentEditorStyles};
`;
ContentArea.displayName = 'ContentArea';

// tslint:disable-next-line:variable-name
const SecondaryToolbar = styled.div`
  box-sizing: border-box;
  justify-content: flex-end;
  align-items: center;
  display: flex;
  padding: 12px 1px;
`;
SecondaryToolbar.displayName = 'SecondaryToolbar';

export interface EditorAppearanceComponentState {}

export default class Editor extends React.Component<
  EditorAppearanceComponentProps,
  EditorAppearanceComponentState
> {
  static displayName = 'CommentEditorAppearance';

  private flashToggle = false;
  private appearance: EditorAppearance = 'comment';

  private handleSave = () => {
    if (this.props.editorView && this.props.onSave) {
      this.props.onSave(this.props.editorView);
    }
  };

  private handleCancel = () => {
    if (this.props.editorView && this.props.onCancel) {
      this.props.onCancel(this.props.editorView);
    }
  };

  private renderChrome = ({ maxContentSize, mediaState }) => {
    const {
      editorDOMElement,
      editorView,
      editorActions,
      eventDispatcher,
      providerFactory,
      contentComponents,
      customContentComponents,
      customPrimaryToolbarComponents,
      primaryToolbarComponents,
      customSecondaryToolbarComponents,
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      maxHeight,
      onSave,
      onCancel,
      disabled,
    } = this.props;
    const maxContentSizeReached =
      maxContentSize && maxContentSize.maxContentSizeReached;
    this.flashToggle = maxContentSizeReached && !this.flashToggle;

    return (
      <div>
        <CommentEditor
          className={this.flashToggle ? '-flash' : ''}
          isMaxContentSizeReached={maxContentSizeReached}
          maxHeight={maxHeight}
        >
          <MainToolbar>
            <Toolbar
              editorView={editorView!}
              editorActions={editorActions}
              eventDispatcher={eventDispatcher!}
              providerFactory={providerFactory!}
              appearance={this.appearance}
              items={primaryToolbarComponents}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsScrollableElement={popupsScrollableElement}
              disabled={!!disabled}
            />
            <MainToolbarCustomComponentsSlot>
              {customPrimaryToolbarComponents}
            </MainToolbarCustomComponentsSlot>
          </MainToolbar>
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
              disabled={!!disabled}
            />
            {editorDOMElement}
          </ContentArea>
        </CommentEditor>
        <SecondaryToolbar>
          <ButtonGroup>
            {!!onSave && (
              <Button
                appearance="primary"
                onClick={this.handleSave}
                isDisabled={
                  disabled || (mediaState && !mediaState.allUploadsFinished)
                }
              >
                Save
              </Button>
            )}
            {!!onCancel && (
              <Button
                appearance="subtle"
                onClick={this.handleCancel}
                isDisabled={disabled}
              >
                Cancel
              </Button>
            )}
          </ButtonGroup>
          <span style={{ flexGrow: 1 }} />
          {customSecondaryToolbarComponents}
        </SecondaryToolbar>
      </div>
    );
  };

  render() {
    return (
      <WithPluginState
        plugins={{
          maxContentSize: maxContentSizePluginKey,
          mediaState: mediaPluginKey,
        }}
        render={this.renderChrome}
      />
    );
  }
}
