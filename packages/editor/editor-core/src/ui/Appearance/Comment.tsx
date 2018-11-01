import * as React from 'react';
import styled from 'styled-components';
import Button, { ButtonGroup } from '@atlaskit/button';
import { colors, borderRadius, gridSize } from '@atlaskit/theme';
import Toolbar from '../Toolbar';
import PluginSlot from '../PluginSlot';
import WithPluginState from '../WithPluginState';
import ContentStyles from '../ContentStyles';
import { EditorAppearanceComponentProps, EditorAppearance } from '../../types';
import { pluginKey as maxContentSizePluginKey } from '../../plugins/max-content-size';
import { stateKey as mediaPluginKey } from '../../plugins/media/pm-plugins/main';
import { ClickAreaBlock } from '../Addon';
import { tableCommentEditorStyles } from '../../plugins/table/ui/styles';
import WithFlash from '../WithFlash';
import {
  akEditorMenuZIndex,
  WidthConsumer,
  akEditorMobileBreakoutPoint,
} from '@atlaskit/editor-common';
import WidthEmitter from '../WidthEmitter';
import { GRID_GUTTER } from '../../plugins/grid';
import * as classnames from 'classnames';

export interface CommentEditorProps {
  isMaxContentSizeReached?: boolean;
  maxHeight?: number;
}
const CommentEditorMargin = 14;
const CommentEditorSmallerMargin = 8;

// tslint:disable-next-line:variable-name
const CommentEditor: any = styled.div`
  display: flex;
  flex-direction: column;

  .less-margin .ProseMirror {
    margin: 12px ${CommentEditorSmallerMargin}px ${CommentEditorSmallerMargin}px;
  }

  min-width: 272px;
  /* Border + Toolbar + Footer + (Paragraph + ((Parahraph + Margin) * (DefaultLines - 1)) */
  /* calc(2px + 40px + 24px + ( 20px + (32px * 2))) */
  min-height: 150px;
  height: auto;
  ${(props: CommentEditorProps) =>
    props.maxHeight
      ? 'max-height: ' + props.maxHeight + 'px;'
      : ''} background-color: white;
  border: 1px solid ${colors.N40};
  box-sizing: border-box;
  border-radius: ${borderRadius()}px;

  max-width: inherit;
  word-wrap: break-word;
`;
CommentEditor.displayName = 'CommentEditor';
const TableControlsPadding = 16;

// tslint:disable-next-line:variable-name
const MainToolbar = styled.div`
  position: relative;
  align-items: center;
  padding: ${gridSize()}px ${gridSize()}px 0;
  display: flex;
  height: auto;
  z-index: ${akEditorMenuZIndex};

  padding-left: ${TableControlsPadding}px;

  & > div > *:first-child {
    margin-left: 0;
  }

  .block-type-btn {
    padding-left: 0;
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
    margin: 12px ${CommentEditorMargin}px ${CommentEditorMargin}px;
  }

  .gridParent {
    margin-left: ${CommentEditorMargin - GRID_GUTTER}px;
    margin-right: ${CommentEditorMargin - GRID_GUTTER}px;
    width: calc(100% + ${CommentEditorMargin - GRID_GUTTER}px);
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

  private appearance: EditorAppearance = 'comment';
  private containerElement: HTMLElement | undefined;

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
    return (
      <WithFlash animate={maxContentSizeReached}>
        <CommentEditor maxHeight={maxHeight} className="akEditor">
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
          <ClickAreaBlock editorView={editorView}>
            <WidthConsumer>
              {({ width }) => {
                return (
                  <ContentArea
                    innerRef={ref => (this.containerElement = ref)}
                    className={classnames('ak-editor-content-area', {
                      'less-margin': width < akEditorMobileBreakoutPoint,
                    })}
                  >
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
                );
              }}
            </WidthConsumer>
          </ClickAreaBlock>
          <WidthEmitter
            editorView={editorView!}
            contentArea={this.containerElement}
          />
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
      </WithFlash>
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
