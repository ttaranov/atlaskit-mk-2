import AkButton from '@atlaskit/button';
import { PureComponent } from 'react';
import * as React from 'react';
import { ActivityProvider } from '@atlaskit/activity';
import { EmojiProvider } from '@atlaskit/emoji';
import { MentionProvider } from '@atlaskit/mention';
import { MediaProvider } from '@atlaskit/media-core';
import Spinner from '@atlaskit/spinner';
import { akColorN40 } from '@atlaskit/util-shared-styles';
import { browser } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { analyticsDecorator as analytics, analyticsService } from '../../analytics';
import { BlockTypeState } from '../../plugins/block-type';
import { CodeBlockState } from '../../plugins/code-block';
import { EmojiState, stateKey as emojiPluginKey } from '../../plugins/emojis';
import { HyperlinkState } from '../../plugins/hyperlink';
import { ImageUploadState } from '../../plugins/image-upload';
import { ListsState } from '../../plugins/lists';
import { MentionsState, stateKey as mentionPluginKey } from '../../plugins/mentions';
import { TextFormattingState } from '../../plugins/text-formatting';
import { ClearFormattingState } from '../../plugins/clear-formatting';
import { PanelState } from '../../plugins/panel';
import { MediaPluginState, stateKey as mediaPluginKey } from '../../plugins/media';
import { TextColorState } from '../../plugins/text-color';
import { TableState } from '../../plugins/table';
import EmojiTypeAhead from '../EmojiTypeAhead';
import HyperlinkEdit from '../HyperlinkEdit';
import LanguagePicker from '../LanguagePicker';
import MentionPicker from '../MentionPicker';
import PanelEdit from '../PanelEdit';
import ToolbarBlockType from '../ToolbarBlockType';
import ToolbarEmojiPicker from '../ToolbarEmojiPicker';
import ToolbarMention from '../ToolbarMention';
import ToolbarFeedback from '../ToolbarFeedback';
import ToolbarHelp from '../ToolbarHelp';
import ToolbarHyperlink from '../ToolbarHyperlink';
import ToolbarLists from '../ToolbarLists';
import ToolbarTextFormatting from '../ToolbarTextFormatting';
import ToolbarAdvancedTextFormatting from '../ToolbarAdvancedTextFormatting';
import ToolbarInsertBlock from '../ToolbarInsertBlock';
import ToolbarInlineCode from '../ToolbarInlineCode';
import ToolbarImage from '../ToolbarImage';
import ToolbarMedia from '../ToolbarMedia';
import ToolbarTextColor from '../ToolbarTextColor';
import TableFloatingToolbar from '../TableFloatingToolbar';
import {
  Container,
  Content,
  Footer,
  FooterActions,
  Toolbar,
  SecondaryToolbar,
  ButtonGroup
} from './styles';
import ToolbarInsertBlockWrapper from '../ToolbarInsertBlock/ToolbarInsertBlockWrapper';

export interface Props {
  editorView: EditorView;
  disabled?: boolean;
  feedbackFormUrl?: string;
  helpDialogPresent?: boolean;
  onCancel?: () => void;
  onInsertImage?: () => void;
  onSave?: () => void;
  packageVersion?: string;
  packageName?: string;
  pluginStateBlockType?: BlockTypeState;
  pluginStateCodeBlock?: CodeBlockState;
  pluginStateHyperlink?: HyperlinkState;
  pluginStateLists?: ListsState;
  pluginStateTextFormatting?: TextFormattingState;
  pluginStateClearFormatting?: ClearFormattingState;
  pluginStateImageUpload?: ImageUploadState;
  pluginStateMentions?: MentionsState;
  pluginStateMedia?: MediaPluginState;
  pluginStateEmojis?: EmojiState;
  pluginStateTextColor?: TextColorState;
  pluginStateTable?: TableState;
  presenceResourceProvider?: any; // AbstractPresenceResource
  saveDisabled?: boolean;
  showSpinner?: boolean;
  emojiProvider?: Promise<EmojiProvider>;
  mentionProvider?: Promise<MentionProvider>;
  activityProvider?: Promise<ActivityProvider>;
  mediaProvider?: Promise<MediaProvider>;
  pluginStatePanel?: PanelState;
  popupsBoundariesElement?: HTMLElement;
  popupsMountPoint?: HTMLElement;
  height?: number;
  maxHeight?: number | undefined;
}

export interface State {
  maxHeightStyle?: any;
  showHelp?: boolean;
}

export default class ChromeExpanded extends PureComponent<Props, State> {
  private editorContainer: HTMLElement;
  private maxHeightContainer: HTMLElement;
  state: State = {
    showHelp: false
  };

  static defaultProps = {
    saveDisabled: false,
  };

  componentWillMount() {
    const { maxHeight } = this.props;
    if (maxHeight) {
      this.setState({
        maxHeightStyle: {
          boxSizing: 'border-box',
          maxHeight: `${maxHeight}px`,
          overflow: 'auto',
          position: 'relative'
        }
      });
    }
  }

  componentDidMount() {
    const { maxHeight } = this.props;
    if (maxHeight) {
      this.addBorders();
    }
  }

  private handleSpinnerComplete() {}

  private getEditorHeight() {
    const { editorView } = this.props;

    return editorView
      ? (editorView.dom as HTMLElement).offsetHeight
      : 0;
  }

  private addBorders = () => {
    const { maxHeight } = this.props;

    if (maxHeight) {
      const editorHeight = this.getEditorHeight();
      let { maxHeightStyle } = this.state;

      if (editorHeight >= maxHeight && !maxHeightStyle.borderBottom) {
        maxHeightStyle = { ...maxHeightStyle, borderBottom: `1px solid ${akColorN40}`, borderTop: `1px solid ${akColorN40}` };
      } else if (editorHeight < maxHeight && maxHeightStyle.borderBottom) {
        maxHeightStyle = { ...maxHeightStyle, borderBottom: null, borderTop: null };
      }

      this.setState({ maxHeightStyle });
    }
  }

  private toggleHelp = (): void => {
    const showHelp = !this.state.showHelp;

    this.setState({
      showHelp
    });
  }

  private onKeyDown = (event: any) => {
    if(this.props.helpDialogPresent) {
      const { showHelp } = this.state;
      if (!showHelp &&
        (browser.mac && event.metaKey && event.key === '/') ||
        (!browser.mac && event.ctrlKey && event.key === '/')) {
        analyticsService.trackEvent('atlassian.editor.help.keyboard');
        this.toggleHelp();
      } else if (showHelp && event.key === 'Escape') {
        this.toggleHelp();
      }
    }
  }

  render() {
    const {
      disabled,
      editorView,
      emojiProvider,
      feedbackFormUrl,
      height,
      helpDialogPresent,
      mentionProvider,
      onCancel,
      onSave,
      packageName,
      packageVersion,
      pluginStateBlockType,
      pluginStateClearFormatting,
      pluginStateCodeBlock,
      pluginStateEmojis,
      pluginStateHyperlink,
      pluginStateImageUpload,
      pluginStateLists,
      pluginStateMedia,
      pluginStateMentions,
      pluginStatePanel,
      pluginStateTextColor,
      pluginStateTextFormatting,
      pluginStateTable,
      saveDisabled,
      showSpinner,
      popupsMountPoint,
      popupsBoundariesElement,
      activityProvider,
    } = this.props;

    const { maxHeightStyle } = this.state;
    const style = {...maxHeightStyle};

    if (height) {
      style.height = `${height}px`;
    }

    const iconAfter = saveDisabled && showSpinner
      ? <Spinner isCompleting={false} onComplete={this.handleSpinnerComplete} />
      : undefined;

    const saveButtonAppearance = saveDisabled || disabled
      ? 'default'
      : 'primary';

    return (
      <Container
        data-editor-chrome={true}
        tabIndex={-1}
        innerRef={this.handleEditorContainerRef}
        onKeyDown={this.onKeyDown}
      >
        <Toolbar>
          {pluginStateBlockType ?
            <ToolbarBlockType
              isDisabled={disabled}
              pluginState={pluginStateBlockType}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
            /> : null
          }
          {pluginStateTextFormatting ?
            <ToolbarTextFormatting
              disabled={disabled}
              pluginState={pluginStateTextFormatting}
              editorView={editorView}
            /> : null
          }
          {pluginStateTextFormatting ?
            <ToolbarInlineCode
              disabled={disabled}
              editorView={editorView}
              pluginState={pluginStateTextFormatting}
            /> : null
          }
          {pluginStateTextColor ?
            <ToolbarTextColor
              disabled={disabled}
              pluginState={pluginStateTextColor}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
            /> : null
          }
          {pluginStateTextFormatting || pluginStateClearFormatting ?
            <ToolbarAdvancedTextFormatting
              isDisabled={disabled}
              pluginStateTextFormatting={pluginStateTextFormatting}
              pluginStateClearFormatting={pluginStateClearFormatting}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
            /> : null
          }
          {pluginStateHyperlink ?
            <ToolbarHyperlink
              disabled={disabled}
              pluginState={pluginStateHyperlink}
              editorView={editorView}
            /> : null
          }
          {pluginStateLists ?
            <ToolbarLists
              disabled={disabled}
              pluginState={pluginStateLists}
              editorView={editorView}
            /> : null
          }
          {(pluginStateTable || pluginStateMedia || pluginStateBlockType) &&
            <ToolbarInsertBlockWrapper
              pluginStateTable={pluginStateTable}
              pluginStateMedia={pluginStateMedia}
              pluginStateBlockType={pluginStateBlockType}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              // tslint:disable-next-line:jsx-no-lambda
              render={state => (
                <ToolbarInsertBlock
                  isDisabled={disabled}
                  editorView={editorView}
                  tableActive={state.tableActive}
                  tableHidden={state.tableHidden}

                  mediaUploadsEnabled={state.mediaUploadsEnabled}
                  onShowMediaPicker={state.showMediaPicker}

                  availableWrapperBlockTypes={state.availableWrapperBlockTypes}
                  onInsertBlockType={state.insertBlockType}
                />
              )}
            />
          }
          <span style={{ flexGrow: 1 }} />
          {feedbackFormUrl ? <ToolbarFeedback packageVersion={packageVersion} packageName={packageName} /> : null}
          {helpDialogPresent && <ToolbarHelp showHelp={this.state.showHelp} toggleHelp={this.toggleHelp} />}
        </Toolbar>
        <Content
          onPaste={this.addBorders}
          onKeyDown={this.addBorders}
        >
          <div style={style} ref={this.handleMaxHeightContainer}>
            {this.props.children}
          </div>
          {pluginStateHyperlink && !disabled ?
            <HyperlinkEdit
              pluginState={pluginStateHyperlink}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
              activityProvider={activityProvider}
            /> : null}

          {pluginStateCodeBlock && !disabled ?
            <LanguagePicker
              pluginState={pluginStateCodeBlock}
              editorView={editorView}
              popupsMountPoint={popupsMountPoint}
              popupsBoundariesElement={popupsBoundariesElement}
            /> : null}

          {pluginStateTable && !disabled &&
            <TableFloatingToolbar
              pluginState={pluginStateTable}
              editorView={editorView}
              popupsMountPoint={this.maxHeightContainer}
              popupsBoundariesElement={this.maxHeightContainer}
            /> }

          {pluginStateMentions && mentionProvider && !disabled ?
            <MentionPicker
              editorView={editorView}
              pluginKey={mentionPluginKey}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsMountPoint={popupsMountPoint}
              mentionProvider={mentionProvider}
            /> : null}

          {pluginStateEmojis && emojiProvider && !disabled ?
            <EmojiTypeAhead
              pluginKey={emojiPluginKey}
              editorView={editorView}
              popupsBoundariesElement={popupsBoundariesElement}
              popupsMountPoint={popupsMountPoint}
              emojiProvider={emojiProvider}
            /> : null}

          {pluginStatePanel ? <PanelEdit pluginState={pluginStatePanel} editorView={editorView} /> : null}
        </Content>
        <Footer>
          <FooterActions>
            <ButtonGroup>
              {!onSave ? null :
                <span onClick={this.handleSave}>
                  <AkButton
                    iconAfter={iconAfter}
                    isDisabled={saveDisabled}
                    appearance={saveButtonAppearance}
                  >
                    Save
                  </AkButton>
                </span>
              }
              {!onCancel ? null :
                <span onClick={this.handleCancel}>
                  <AkButton appearance="subtle">Cancel</AkButton>
                </span>
              }
            </ButtonGroup>
          </FooterActions>
          {/* NOTE (to be refactored in ED-2565): ToolbarEmojiPicker.numFollowingButtons must be changed if buttons are added after ToolbarEmojiPicker in the SecondaryToolbar */}
          <SecondaryToolbar>
            {pluginStateMentions && mentionProvider && !disabled ? <ToolbarMention pluginKey={mentionPluginKey} editorView={editorView} /> : null}
            {pluginStateEmojis && emojiProvider ?
              <ToolbarEmojiPicker
                pluginKey={emojiPluginKey}
                editorView={editorView}
                emojiProvider={emojiProvider}
                numFollowingButtons={2}
                popupsMountPoint={popupsMountPoint}
                popupsBoundariesElement={popupsBoundariesElement}
              /> : null}
            {pluginStateImageUpload && !disabled ? <ToolbarImage pluginState={pluginStateImageUpload} editorView={editorView} /> : null}
            {pluginStateMedia && !disabled ? <ToolbarMedia editorView={editorView} pluginKey={mediaPluginKey} /> : null}
          </SecondaryToolbar>
        </Footer>
      </Container>
    );
  }

  private handleEditorContainerRef = ref => {
    this.editorContainer = ref;
  }

  private handleMaxHeightContainer = (ref) => {
    this.maxHeightContainer = ref;
  }

  @analytics('atlassian.editor.stop.cancel')
  private handleCancel = (): boolean => {
    const { onCancel } = this.props;
    if (onCancel) {
      onCancel();
      return true;
    }
    return false;
  }

  @analytics('atlassian.editor.stop.save')
  private handleSave = (): boolean => {
    const { onSave } = this.props;
    if (onSave) {
      onSave();
      return true;
    }
    return false;
  }
}
