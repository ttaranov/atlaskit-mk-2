import * as React from 'react';
import { ReactElement } from 'react';
import * as ReactDOM from 'react-dom';
import { EditorView } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import EditorImageIcon from '@atlaskit/icon/glyph/editor/image';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import MentionIcon from '@atlaskit/icon/glyph/editor/mention';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import QuoteIcon from '@atlaskit/icon/glyph/quote';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import EmojiIcon from '@atlaskit/icon/glyph/editor/emoji';
import DateIcon from '@atlaskit/icon/glyph/editor/date';
import PlaceholderTextIcon from '@atlaskit/icon/glyph/media-services/text';
import LayoutTwoEqualIcon from '@atlaskit/icon/glyph/editor/layout-two-equal';
import HorizontalRuleIcon from '@atlaskit/icon/glyph/editor/horizontal-rule';
import {
  EmojiId,
  EmojiPicker as AkEmojiPicker,
  EmojiProvider,
} from '@atlaskit/emoji';
import { Popup } from '@atlaskit/editor-common';
import EditorActions from '../../../../actions';
import {
  analyticsService as analytics,
  withAnalytics,
} from '../../../../analytics';
import {
  toggleTable,
  tooltip,
  findKeymapByDescription,
  addLink,
} from '../../../../keymaps';
import { InsertMenuCustomItem } from '../../../../types';
import DropdownMenu from '../../../../ui/DropdownMenu';
import ToolbarButton from '../../../../ui/ToolbarButton';
import { Wrapper, ButtonGroup, ExpandIconWrapper } from '../../../../ui/styles';
import { BlockType } from '../../../block-type/types';
import { MacroProvider } from '../../../macro/types';
import { createTable } from '../../../table/actions';
import { insertDate, openDatePicker } from '../../../date/actions';
import { showPlaceholderFloatingToolbar } from '../../../placeholder-text/actions';
import { createHorizontalRule } from '../../../rule/pm-plugins/input-rule';
import { TriggerWrapper } from './styles';
import { insertLayoutColumns } from '../../../layout/actions';
import { changeToTaskDecision } from '../../../tasks-and-decisions/commands';
import { Command } from '../../../../commands';
import { showLinkToolbar } from '../../../hyperlink/commands';

export interface Props {
  buttons: number;
  isReducedSpacing: boolean;
  isDisabled?: boolean;
  editorView: EditorView;
  editorActions?: EditorActions;
  tableSupported?: boolean;
  mentionsEnabled?: boolean;
  decisionSupported?: boolean;
  mentionsSupported?: boolean;
  insertMentionQuery?: () => void;
  mediaUploadsEnabled?: boolean;
  mediaSupported?: boolean;
  imageUploadSupported?: boolean;
  imageUploadEnabled?: boolean;
  handleImageUpload?: (editorView: EditorView) => {};
  dateEnabled?: boolean;
  horizontalRuleEnabled?: boolean;
  placeholderTextEnabled?: boolean;
  layoutSectionEnabled?: boolean;
  emojiProvider?: Promise<EmojiProvider>;
  availableWrapperBlockTypes?: BlockType[];
  linkSupported?: boolean;
  linkDisabled?: boolean;
  emojiDisabled?: boolean;
  insertEmoji?: (emojiId: EmojiId) => void;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  macroProvider?: MacroProvider | null;
  insertMenuItems?: InsertMenuCustomItem[];
  onShowMediaPicker?: () => void;
  onInsertBlockType?: (name: string) => Command;
  onInsertMacroFromMacroBrowser?: (
    macroProvider: MacroProvider,
    node?: PMNode,
    isEditing?: boolean,
  ) => (state, dispatch) => void;
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
const isDetachedElement = el => !document.body.contains(el);
const noop = () => {};

export default class ToolbarInsertBlock extends React.PureComponent<
  Props,
  State
> {
  private pickerRef: ReactElement<any>;
  private button?;

  state: State = {
    isOpen: false,
    emojiPickerOpen: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    // If number of visible buttons changed, close emoji picker
    if (nextProps.buttons !== this.props.buttons) {
      this.setState({ emojiPickerOpen: false });
    }
  }

  private onOpenChange = (attrs: { isOpen: boolean; open?: boolean }) => {
    const state = {
      isOpen: attrs.isOpen,
      emojiPickerOpen: this.state.emojiPickerOpen,
    };
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
      popupsScrollableElement,
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
        scrollableElement={popupsScrollableElement}
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

  private handleDropDownButtonRef = (ref, items) => {
    items.forEach(item => item.handleRef && item.handleRef(ref));
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
      popupsMountPoint,
      popupsBoundariesElement,
      popupsScrollableElement,
      isDisabled,
      buttons: numberOfButtons,
      isReducedSpacing,
    } = this.props;

    const items = this.createItems();
    const buttons = items.slice(0, numberOfButtons);
    const dropdownItems = items.slice(numberOfButtons);

    if (items.length === 0) {
      return null;
    }

    const toolbarButtonFactory = (disabled: boolean, items) => (
      <ToolbarButton
        ref={el => this.handleDropDownButtonRef(el, items)}
        selected={isOpen}
        disabled={disabled}
        onClick={this.handleTriggerClick}
        spacing={isReducedSpacing ? 'none' : 'default'}
        iconBefore={
          <TriggerWrapper>
            <AddIcon label="Open or close insert block dropdown" />
            <ExpandIconWrapper>
              <ExpandIcon label="Open or close insert block dropdown" />
            </ExpandIconWrapper>
          </TriggerWrapper>
        }
      />
    );

    return (
      <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
        {buttons.map(btn => (
          <ToolbarButton
            ref={btn.handleRef || noop}
            key={btn.content}
            spacing={isReducedSpacing ? 'none' : 'default'}
            disabled={isDisabled || btn.isDisabled}
            iconBefore={btn.elemBefore}
            selected={btn.isActive}
            title={btn.content}
            onClick={() => this.onItemActivated({ item: btn })}
          />
        ))}
        <Wrapper>
          {this.renderPopup()}
          {dropdownItems.length > 0 &&
            (!isDisabled ? (
              <DropdownMenu
                items={[{ items: dropdownItems }]}
                onItemActivated={this.onItemActivated}
                onOpenChange={this.onOpenChange}
                mountTo={popupsMountPoint}
                boundariesElement={popupsBoundariesElement}
                scrollableElement={popupsScrollableElement}
                isOpen={isOpen}
                fitHeight={188}
                fitWidth={175}
              >
                {toolbarButtonFactory(false, dropdownItems)}
              </DropdownMenu>
            ) : (
              <div>{toolbarButtonFactory(true, dropdownItems)}</div>
            ))}
        </Wrapper>
      </ButtonGroup>
    );
  }

  private createItems = () => {
    const {
      tableSupported,
      mediaUploadsEnabled,
      mediaSupported,
      imageUploadSupported,
      imageUploadEnabled,
      mentionsEnabled,
      mentionsSupported,
      availableWrapperBlockTypes,
      decisionSupported,
      macroProvider,
      linkSupported,
      linkDisabled,
      emojiDisabled,
      emojiProvider,
      insertMenuItems,
      dateEnabled,
      placeholderTextEnabled,
      horizontalRuleEnabled,
      layoutSectionEnabled,
    } = this.props;
    let items: any[] = [];

    if (linkSupported) {
      items.push({
        content: 'Add link',
        value: { name: 'link' },
        isDisabled: linkDisabled,
        tooltipDescription: tooltip(addLink),
        tooltipPosition: 'right',
        elemBefore: <LinkIcon label="Add link" />,
      });
    }
    if (mediaSupported && mediaUploadsEnabled) {
      items.push({
        content: 'Files and images',
        value: { name: 'media' },
        tooltipDescription: 'Files and Images',
        tooltipPosition: 'right',
        elemBefore: <EditorImageIcon label="Insert files and images" />,
      });
    }
    if (imageUploadSupported) {
      items.push({
        content: 'Insert image',
        value: { name: 'image upload' },
        isDisabled: !imageUploadEnabled,
        tooltipDescription: 'Insert image',
        tooltipPosition: 'right',
        elemBefore: <EditorImageIcon label="Insert image" />,
      });
    }
    if (mentionsSupported) {
      items.push({
        content: 'Mention',
        value: { name: 'mention' },
        isDisabled: !mentionsEnabled,
        tooltipDescription: 'Mention a person (@)',
        tooltipPosition: 'right',
        elemBefore: <MentionIcon label="Add mention" />,
      });
    }
    if (emojiProvider) {
      items.push({
        content: 'Emoji',
        value: { name: 'emoji' },
        isDisabled: emojiDisabled,
        tooltipDescription: 'Insert emoji (:)',
        tooltipPosition: 'right',
        elemBefore: <EmojiIcon label="Insert emoji" />,
        handleRef: this.handleButtonRef,
      });
    }
    if (tableSupported) {
      items.push({
        content: 'Table',
        value: { name: 'table' },
        tooltipDescription: tooltip(toggleTable),
        tooltipPosition: 'right',
        elemBefore: <TableIcon label="Insert table" />,
      });
    }
    if (availableWrapperBlockTypes) {
      availableWrapperBlockTypes.forEach(blockType => {
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
    if (decisionSupported) {
      items.push({
        content: 'Decision',
        value: { name: 'decision' },
        tooltipDescription: 'Insert decision',
        tooltipPosition: 'right',
        elemBefore: <DecisionIcon label="Insert decision" />,
      });
    }
    if (
      horizontalRuleEnabled &&
      this.props.editorView.state.schema.nodes.rule
    ) {
      items.push({
        content: 'Divider',
        value: { name: 'horizontalrule' },
        tooltipDescription: 'Insert divider',
        tooltipPosition: 'right',
        elemBefore: <HorizontalRuleIcon label="Insert divider" />,
      });
    }

    if (dateEnabled) {
      items.push({
        content: 'Date',
        value: { name: 'date' },
        tooltipDescription: 'Insert date',
        tooltipPosition: 'right',
        elemBefore: <DateIcon label="Insert date" />,
      });
    }

    if (placeholderTextEnabled) {
      items.push({
        content: 'Placeholder Text',
        value: { name: 'placeholder text' },
        tooltipDescription: 'Add placeholder text',
        tooltipPosition: 'right',
        elemBefore: <PlaceholderTextIcon label="Add placeholder text" />,
      });
    }

    if (layoutSectionEnabled) {
      items.push({
        content: 'Columns',
        value: { name: 'layout' },
        tooltipDescription: 'Insert columns',
        tooltipPosition: 'right',
        elemBefore: <LayoutTwoEqualIcon label="Insert columns" />,
      });
    }

    if (insertMenuItems) {
      items = items.concat(insertMenuItems);
      // keeping this here for backwards compatibility so confluence
      // has time to implement this button before it disappears.
      // Should be safe to delete soon. If in doubt ask Leandro Lemos (llemos)
    } else if (typeof macroProvider !== 'undefined' && macroProvider) {
      items.push({
        content: 'View more',
        value: { name: 'macro' },
        tooltipDescription: 'View more',
        tooltipPosition: 'right',
        elemBefore: <EditorMoreIcon label="View more" />,
      });
    }
    return items;
  };

  private toggleLinkPanel = withAnalytics(
    'atlassian.editor.format.hyperlink.button',
    (): boolean => {
      const { editorView } = this.props;
      showLinkToolbar()(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private insertMention = withAnalytics(
    'atlassian.fabric.mention.picker.trigger.button',
    (): boolean => {
      const { insertMentionQuery } = this.props;
      insertMentionQuery!();
      return true;
    },
  );

  private createTable = withAnalytics(
    'atlassian.editor.format.table.button',
    (): boolean => {
      const { editorView } = this.props;
      createTable(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private createDate = withAnalytics(
    'atlassian.editor.format.date.button',
    (): boolean => {
      const { editorView } = this.props;
      insertDate()(editorView.state, editorView.dispatch);
      openDatePicker(editorView.domAtPos.bind(editorView))(
        editorView.state,
        editorView.dispatch,
      );
      return true;
    },
  );

  private createPlaceholderText = withAnalytics(
    'atlassian.editor.format.placeholder.button',
    (): boolean => {
      const { editorView } = this.props;
      showPlaceholderFloatingToolbar(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private insertLayoutColumns = withAnalytics(
    'atlassian.editor.format.layout.button',
    (): boolean => {
      const { editorView } = this.props;
      insertLayoutColumns(editorView.state, editorView.dispatch);
      return true;
    },
  );

  private openMediaPicker = withAnalytics(
    'atlassian.editor.format.media.button',
    (): boolean => {
      const { onShowMediaPicker } = this.props;
      onShowMediaPicker!();
      return true;
    },
  );

  private insertDecision = withAnalytics(
    'atlassian.editor.format.decision.button',
    (): boolean => {
      const { editorView } = this.props;
      if (!editorView) {
        return false;
      }
      changeToTaskDecision(editorView, 'decisionList');
      return true;
    },
  );

  private insertHorizontalRule = withAnalytics(
    'atlassian.editor.format.horizontalrule.button',
    (): boolean => {
      const { editorView } = this.props;
      editorView.dispatch(
        createHorizontalRule(
          editorView.state,
          editorView.state.selection.from,
          editorView.state.selection.to,
        ),
      );
      return true;
    },
  );

  private handleSelectedEmoji = withAnalytics(
    'atlassian.editor.emoji.button',
    (emojiId: EmojiId): boolean => {
      this.props.insertEmoji!(emojiId);
      this.toggleEmojiPicker();
      return true;
    },
  );

  private onItemActivated = ({ item }): void => {
    const {
      editorView,
      editorActions,
      onInsertBlockType,
      onInsertMacroFromMacroBrowser,
      macroProvider,
      handleImageUpload,
    } = this.props;

    switch (item.value.name) {
      case 'link':
        this.toggleLinkPanel();
        break;
      case 'table':
        this.createTable();
        break;
      case 'image upload':
        if (handleImageUpload) {
          handleImageUpload(editorView);
        }
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
        const { state, dispatch } = editorView;
        onInsertBlockType!(item.value.name)(state, dispatch);
        break;
      case 'decision':
        this.insertDecision();
        break;
      case 'horizontalrule':
        this.insertHorizontalRule();
        break;
      case 'macro':
        analytics.trackEvent(
          `atlassian.editor.format.${item.value.name}.button`,
        );
        onInsertMacroFromMacroBrowser!(macroProvider!)(
          editorView.state,
          editorView.dispatch,
        );
        break;
      case 'date':
        this.createDate();
        break;
      case 'placeholder text':
        this.createPlaceholderText();
        break;
      case 'layout':
        this.insertLayoutColumns();
        break;
      default:
        if (item && item.onClick) {
          item.onClick(editorActions);
          break;
        }
    }
    this.setState({ isOpen: false });
    if (!editorView.hasFocus()) {
      editorView.focus();
    }
  };
}
