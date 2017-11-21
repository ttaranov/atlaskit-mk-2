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
import { EditorView } from 'prosemirror-view';
import { EditorState, Transaction } from 'prosemirror-state';
import { analyticsService as analytics } from '../../analytics';
import { BlockType } from '../../plugins/block-type/types';
import { toggleTable, tooltip, findKeymapByDescription } from '../../keymaps';
import DropdownMenu from '../DropdownMenu';
import ToolbarButton from '../ToolbarButton';
import EditorWidth from '../../utils/editor-width';
import { MacroProvider } from '../../editor/plugins/macro/types';
import tableCommands from '../../plugins/table/commands';
import { Wrapper, ExpandIconWrapper, InnerWrapper } from './styles';

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
  availableWrapperBlockTypes?: BlockType[];
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  editorWidth?: number;
  macroProvider?: MacroProvider | null;
  onShowMediaPicker?: () => void;
  onInsertBlockType?: (name: string, view: EditorView) => void;
  onInsertMacroFromMacroBrowser?: (macroProvider: MacroProvider) => (state: EditorState, dispatch: (tr: Transaction) => void) => void;
}

export interface State {
  isOpen?: boolean;
  button?
}

const blockTypeIcons = {
  codeblock: CodeIcon,
  panel: InfoIcon,
  blockquote: QuoteIcon,
};

export default class ToolbarInsertBlock extends React.Component<Props, State> {
  private buttonRef: ReactElement<any>;

  state: State = {
    isOpen: false
  };

  componentDidMount() {
    this.state.button = ReactDOM.findDOMNode(this.buttonRef) as HTMLElement;
  }

  private onOpenChange = (attrs: any) => {
    this.setState({ isOpen: attrs.isOpen });
  }

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.isOpen });
  }

  render() {
    const { isOpen } = this.state;
    const {
      tableActive,
      tableSupported,
      mediaUploadsEnabled,
      mediaSupported,
      mentionsEnabled,
      mentionsSupported,
      popupsMountPoint,
      popupsBoundariesElement,
      editorWidth,
      isDisabled
    } = this.props;

    const items = this.createItems(editorWidth);

    if (!tableSupported && !mediaSupported && !mentionsSupported && items[0].items.length === 0) {
      return null;
    }

    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
        selected={isOpen}
        disabled={disabled}
        onClick={this.handleTriggerClick}
        iconBefore={
          <Wrapper>
            <AddIcon label="Open or close insert block dropdown"/>
            <ExpandIconWrapper>
              <ExpandIcon label="Open or close insert block dropdown" />
            </ExpandIconWrapper>
          </Wrapper>}
      />
    );

    return (
      <Wrapper>
        <InnerWrapper width={editorWidth! > EditorWidth.BreakPoint6 ? 'large' : 'small'}>
          {mentionsSupported && (!editorWidth || editorWidth > EditorWidth.BreakPoint5) && <ToolbarButton
            spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
            onClick={this.insertMention}
            disabled={isDisabled || !mentionsEnabled}
            title="Mention a person (@)"
            iconBefore={<MentionIcon label="Add mention" />}
          />}
          {mediaSupported && mediaUploadsEnabled && (!editorWidth || editorWidth > EditorWidth.BreakPoint4) && <ToolbarButton
            spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
            onClick={this.openMediaPicker}
            disabled={isDisabled}
            title="Insert files and images"
            iconBefore={<AttachmentIcon label="Insert files and images"/>}
          />}
          {tableSupported && (!editorWidth || editorWidth > EditorWidth.BreakPoint3) && <ToolbarButton
            spacing={(editorWidth && editorWidth > EditorWidth.BreakPoint6) ? 'default' : 'none'}
            onClick={this.createTable}
            selected={tableActive}
            disabled={isDisabled}
            title={tooltip(toggleTable)}
            iconBefore={<TableIcon label="Insert table"/>}
          />}
        </InnerWrapper>
        {items[0].items.length > 0 && (!isDisabled ?
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
          </DropdownMenu> :
          <div>
            <div>{toolbarButtonFactory(true)}</div>
          </div>)}
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
      macroProvider
    } = this.props;
    let items: any[] = [];
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
    if (mediaSupported && mediaUploadsEnabled && editorWidth! <= EditorWidth.BreakPoint4) {
      items.push({
        content: 'Files and images',
        value: { name: 'media' },
        tooltipDescription: 'Files and Images',
        tooltipPosition: 'right',
        elemBefore: <AttachmentIcon label="Insert files and images"/>,
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
        elemBefore: <TableIcon label="Insert table"/>,
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
          elemBefore: <BlockTypeIcon label={`Insert ${blockType} block`}/>,
        });
      });
    }

    if (typeof macroProvider !== 'undefined' && macroProvider) {
      items.push({
        content: 'View more',
        value: { name: 'macro' },
        tooltipDescription: 'View more',
        tooltipPosition: 'right',
        elemBefore: <EditorMoreIcon label="View more"/>,
      });
    }
    return [{
      items,
    }];
  }

  private insertMention = () => {
    analytics.trackEvent(`atlassian.editor.format.mention.button`);
    const { insertMentionQuery } = this.props;
    insertMentionQuery!();
  }

  private createTable = () => {
    analytics.trackEvent(`atlassian.editor.format.table.button`);
    const { editorView } = this.props;
    tableCommands.createTable()(editorView.state, editorView.dispatch);
  }

  private openMediaPicker = () => {
    analytics.trackEvent(`atlassian.editor.format.media.button`);
    const { onShowMediaPicker } = this.props;
    onShowMediaPicker!();
  }

  private onItemActivated = ({ item }): void => {
    const {
      editorView,
      onInsertBlockType,
      onInsertMacroFromMacroBrowser,
      macroProvider
    } = this.props;

    switch(item.value.name) {
      case 'table':
        this.createTable();
        break;
      case 'media':
        this.openMediaPicker();
        break;
      case 'mention':
        this.insertMention!();
        break;
      case 'codeblock':
      case 'blockquote':
      case 'panel':
        analytics.trackEvent(`atlassian.editor.format.${item.value.name}.button`);
        onInsertBlockType!(item.value.name, editorView);
        break;
      case 'macro':
        onInsertMacroFromMacroBrowser!(macroProvider!)(editorView.state, editorView.dispatch);
    }
  }
}
