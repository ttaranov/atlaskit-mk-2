import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ReactElement } from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import AttachmentIcon from '@atlaskit/icon/glyph/editor/attachment';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import QuoteIcon from '@atlaskit/icon/glyph/quote';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import {
  EmojiId,
  EmojiPicker as AkEmojiPicker,
  EmojiProvider,
} from '@atlaskit/emoji';
import { Popup } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import {
  analyticsService as analytics,
  analyticsDecorator,
} from '../../analytics';
import { BlockType } from '../../plugins/block-type/types';
import {
  toggleTable,
  tooltip,
  findKeymapByDescription,
  addLink,
} from '../../keymaps';
import DropdownMenu from '../DropdownMenu';
import ToolbarButton from '../ToolbarButton';
import EditorWidth from '../../utils/editor-width';
import { MacroProvider } from '../../editor/plugins/macro/types';
import tableCommands from '../../plugins/table/commands';
import { Wrapper, ExpandIconWrapper } from './styles';

export interface Props {
  isDisabled?: boolean;
  editorView: EditorView;
  tableActive?: boolean;
  tableHidden?: boolean;
  tableSupported?: boolean;
  mentionsEnabled?: boolean;
  mentionsSupported?: boolean;
  insertMentionQuery?: () => void;
  mediaUploadsEnabled?: boolean;
  mediaSupported?: boolean;
  emojiProvider?: Promise<EmojiProvider>;
  availableWrapperBlockTypes?: BlockType[];
  linkDisabled?: boolean;
  showLinkPanel?: (editorView: EditorView) => void;
  emojiDisabled?: boolean;
  insertEmoji?: (emojiId: EmojiId) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  editorWidth?: number;
  macroProvider?: MacroProvider | null;
  onShowMediaPicker?: () => void;
  onInsertBlockType?: (name: string, view: EditorView) => void;
  onInsertMacroFromMacroBrowser?: (
    macroProvider: MacroProvider,
  ) => (state: EditorState, dispatch: (tr: Transaction) => void) => void;
}

export interface State {
  isOpen: boolean;
  emojiPickerOpen: boolean;
}

const blockTypeIcons = {
  codeblock: CodeIcon,
  panel: InfoIcon,
  blockquote: QuoteIcon,
};

/**
 * Checks if an element is detached (i.e. not in the current document)
 */
const isDetachedElement = el => !document.contains(el);

export default class ToolbarInsertBlock extends React.Component<Props, State> {
  private pickerRef: ReactElement<any>;
  private button?;

  state: State = {
    isOpen: false,
    emojiPickerOpen: false,
  };

  private onOpenChange = (attrs: any) => {
    const state: any = { isOpen: attrs.isOpen };
    if (this.state.emojiPickerOpen && !attrs.open) {
      state.emojiPickerOpen = false;
    }
    this.setState(state);
  };

  private handleTriggerClick = () => {
    const { isOpen } = this.state;
    this.onOpenChange({ isOpen: !isOpen });
  };

  private toggleEmojiPicker = () => {
    const emojiPickerOpen = !this.state.emojiPickerOpen;
    this.setState({ emojiPickerOpen });
  };

  private renderPopup() {
    const { emojiPickerOpen } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      emojiProvider,
    } = this.props;
    if (!emojiPickerOpen || !this.button || !emojiProvider) {
      return null;
    }

    return (
      <Popup
        target={this.button}
        fitHeight={350}
        fitWidth={350}
        offset={[0, 3]}
        mountTo={popupsMountPoint}
        boundariesElement={popupsBoundariesElement}
      >
        <AkEmojiPicker
          emojiProvider={emojiProvider}
          onSelection={this.handleSelectedEmoji}
          onPickerRef={this.onPickerRef}
        />
      </Popup>
    );
  }

  private handleButtonRef = (ref): void => {
    const buttonRef = ref || null;
    if (buttonRef) {
      this.button = ReactDOM.findDOMNode(buttonRef) as HTMLElement;
    }
  };

  private onPickerRef = (ref: any) => {
    if (ref) {
      document.addEventListener('click', this.handleClickOutside);
    } else {
      document.removeEventListener('click', this.handleClickOutside);
    }
    this.pickerRef = ref;
  };

  private handleClickOutside = e => {
    const picker = ReactDOM.findDOMNode(this.pickerRef);
    // Ignore click events for detached elements.
    // Workaround for FS-1322 - where two onClicks fire - one when the upload button is
    // still in the document, and one once it's detached. Does not always occur, and
    // may be a side effect of a react render optimisation
    if (
      !picker ||
      (!isDetachedElement(e.target) && !picker.contains(e.target))
    ) {
      this.toggleEmojiPicker();
    }
  };

  render() {
    const { isOpen } = this.state;
    const {
      tableSupported,
      mediaSupported,
      mentionsSupported,
      popupsMountPoint,
      popupsBoundariesElement,
      editorWidth,
      isDisabled,
    } = this.props;

    const items = this.createItems(editorWidth);

    if (
      !tableSupported &&
      !mediaSupported &&
      !mentionsSupported &&
      items[0].items.length === 0
    ) {
      return null;
    }

    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        ref={this.handleButtonRef}
        spacing={
          editorWidth && editorWidth > EditorWidth.BreakPoint10
            ? 'default'
            : 'none'
        }
        selected={isOpen}
        disabled={disabled}
        onClick={this.handleTriggerClick}
        iconBefore={
          <Wrapper>
            <AddIcon label="Open or close insert block dropdown" />
            <ExpandIconWrapper>
              <ExpandIcon label="Open or close insert block dropdown" />
            </ExpandIconWrapper>
          </Wrapper>
        }
      />
    );

    return (
      <Wrapper>
        {this.renderPopup()}
        {items[0].items.length > 0 &&
          (!isDisabled ? (
            <DropdownMenu
              items={items}
              onItemActivated={this.onItemActivated}
              onOpenChange={this.onOpenChange}
              mountTo={popupsMountPoint}
              boundariesElement={popupsBoundariesElement}
              isOpen={isOpen}
              fitHeight={188}
              fitWidth={175}
            >
              {toolbarButtonFactory(false)}
            </DropdownMenu>
          ) : (
            <div>
              <div>{toolbarButtonFactory(true)}</div>
            </div>
          ))}
      </Wrapper>
    );
  }

  private createItems = (editorWidth?: number) => {
    const {
      tableHidden,
      tableActive,
      tableSupported,
      mediaUploadsEnabled,
      mediaSupported,
      mentionsEnabled,
      mentionsSupported,
      availableWrapperBlockTypes,
      macroProvider,
      linkDisabled,
      emojiDisabled,
      emojiProvider,
    } = this.props;
    let items: any[] = [];
    if (editorWidth! <= EditorWidth.BreakPoint7) {
      items.push({
        content: 'Add link',
        value: { name: 'link' },
        isDisabled: linkDisabled,
        tooltipDescription: tooltip(addLink),
        tooltipPosition: 'right',
        elemBefore: <LinkIcon label="Add link" />,
      });
    }
    if (
      mediaSupported &&
      mediaUploadsEnabled &&
      editorWidth! <= EditorWidth.BreakPoint6
    ) {
      items.push({
        content: 'Files and images',
        value: { name: 'media' },
        tooltipDescription: 'Files and Images',
        tooltipPosition: 'right',
        elemBefore: <AttachmentIcon label="Insert files and images" />,
      });
    }
    if (mentionsSupported && editorWidth! <= EditorWidth.BreakPoint5) {
      items.push({
        content: 'Mention',
        value: { name: 'mention' },
        isDisabled: !mentionsEnabled,
        tooltipDescription: 'Mention a person (@)',
        tooltipPosition: 'right',
        elemBefore: <MentionIcon label="Add mention" />,
      });
    }
    if (emojiProvider && editorWidth! <= EditorWidth.BreakPoint4) {
      items.push({
        content: 'Emoji',
        value: { name: 'emoji' },
        isDisabled: emojiDisabled,
        tooltipDescription: 'Insert emoji (:)',
        tooltipPosition: 'right',
        elemBefore: <EmojiIcon label="Insert emoji" />,
      });
    }
    if (tableSupported && editorWidth! <= EditorWidth.BreakPoint3) {
      items.push({
        content: 'Table',
        value: { name: 'table' },
        isDisabled: tableHidden,
        isActive: tableActive,
        tooltipDescription: tooltip(toggleTable),
        tooltipPosition: 'right',
        elemBefore: <TableIcon label="Insert table" />,
      });
    }
    if (availableWrapperBlockTypes) {
      availableWrapperBlockTypes.forEach(blockType => {
        // tslint:disable-next-line:variable-name
        const BlockTypeIcon = blockTypeIcons[blockType.name];
        items.push({
          content: blockType.title,
          value: blockType,
          tooltipDescription: tooltip(findKeymapByDescription(blockType.title)),
          tooltipPosition: 'right',
          elemBefore: <BlockTypeIcon label={`Insert ${blockType} block`} />,
        });
      });
    }
    if (typeof macroProvider !== 'undefined' && macroProvider) {
      items.push({
        content: 'View more',
        value: { name: 'macro' },
        tooltipDescription: 'View more',
        tooltipPosition: 'right',
        elemBefore: <EditorMoreIcon label="View more" />,
      });
    }
    return [
      {
        items,
      },
    ];
  };

  @analyticsDecorator('atlassian.editor.format.hyperlink.button')
  private toggleLinkPanel = (): boolean => {
    const { showLinkPanel, editorView } = this.props;
    showLinkPanel!(editorView);
    return true;
  };

  @analyticsDecorator('atlassian.editor.format.mention.button')
  private insertMention = (): boolean => {
    const { insertMentionQuery } = this.props;
    insertMentionQuery!();
    return true;
  };

  @analyticsDecorator('atlassian.editor.format.table.button')
  private createTable = (): boolean => {
    const { editorView } = this.props;
    tableCommands.createTable()(editorView.state, editorView.dispatch);
    return true;
  };

  @analyticsDecorator('atlassian.editor.format.media.button')
  private openMediaPicker = (): boolean => {
    const { onShowMediaPicker } = this.props;
    onShowMediaPicker!();
    return true;
  };

  @analyticsDecorator('atlassian.editor.emoji.button')
  private handleSelectedEmoji = (emojiId: any, emoji: any): boolean => {
    this.props.insertEmoji!(emojiId);
    this.toggleEmojiPicker();
    return true;
  };

  private onItemActivated = ({ item }): void => {
    const {
      editorView,
      onInsertBlockType,
      onInsertMacroFromMacroBrowser,
      macroProvider,
    } = this.props;

    switch (item.value.name) {
      case 'link':
        this.toggleLinkPanel();
        break;
      case 'table':
        this.createTable();
        break;
      case 'table':
        this.createTable();
        break;
      case 'media':
        this.openMediaPicker();
        break;
      case 'mention':
        this.insertMention!();
        break;
      case 'emoji':
        this.toggleEmojiPicker();
        break;
      case 'codeblock':
      case 'blockquote':
      case 'panel':
        analytics.trackEvent(
          `atlassian.editor.format.${item.value.name}.button`,
        );
        onInsertBlockType!(item.value.name, editorView);
        break;
      case 'macro':
        analytics.trackEvent(
          `atlassian.editor.format.${item.value.name}.button`,
        );
        onInsertMacroFromMacroBrowser!(macroProvider!)(
          editorView.state,
          editorView.dispatch,
        );
    }
    this.setState({ isOpen: false });
  };
}
