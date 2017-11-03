import * as React from 'react';
import AddIcon from '@atlaskit/icon/glyph/editor/add';
import ExpandIcon from '@atlaskit/icon/glyph/editor/expand';
import TableIcon from '@atlaskit/icon/glyph/editor/table';
import MediaIcon from '@atlaskit/icon/glyph/editor/image';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import InfoIcon from '@atlaskit/icon/glyph/editor/info';
import QuoteIcon from '@atlaskit/icon/glyph/quote';
import EditorMoreIcon from '@atlaskit/icon/glyph/editor/more';
import { EditorView } from 'prosemirror-view';
import { analyticsService as analytics } from '../../analytics';
import { BlockType } from '../../plugins/block-type/types';
import { toggleTable, tooltip, findKeymapByDescription } from '../../keymaps';
import DropdownMenu from '../DropdownMenu';
import ToolbarButton from '../ToolbarButton';
import { TriggerWrapper, ExpandIconWrapper } from './styles';
import tableCommands from '../../plugins/table/commands';
import { MacroProvider } from '../../editor/plugins/macro/types';

export interface Props {
  isDisabled?: boolean;
  editorView: EditorView;
  tableActive?: boolean;
  tableHidden?: boolean;
  mediaUploadsEnabled?: boolean;
  availableWrapperBlockTypes?: BlockType[];
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  macroProvider?: MacroProvider | null;
  onShowMediaPicker?: () => void;
  onInsertBlockType?: (name: string, view: EditorView) => void;
  onInsertMacroFromMacroBrowser?: (view: EditorView, macroProvider: MacroProvider) => void;
}

export interface State {
  isOpen?: boolean;
}

const blockTypeIcons = {
  codeblock: CodeIcon,
  panel: InfoIcon,
  blockquote: QuoteIcon,
};

export default class ToolbarInsertBlock extends React.Component<Props, State> {
  state: State = {
    isOpen: false
  };

  private onOpenChange = (attrs: any) => {
    this.setState({ isOpen: attrs.isOpen });
  }

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.isOpen });
  }

  render() {
    const { isOpen } = this.state;
    const { popupsMountPoint, popupsBoundariesElement } = this.props;
    const items = this.createItems();

    if (items[0].items.length  === 0) {
      return null;
    }

    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        selected={isOpen}
        disabled={disabled}
        onClick={this.handleTriggerClick}
        iconBefore={
          <TriggerWrapper>
            <AddIcon label="Open or close insert block dropdown"/>
            <ExpandIconWrapper>
              <ExpandIcon label="Open or close insert block dropdown" />
            </ExpandIconWrapper>
          </TriggerWrapper>}
      />
    );

    if (!this.props.isDisabled && items[0].items.length > 0) {
      return (
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
      );
    } else {
      return (
        <span>
          <div>{toolbarButtonFactory(true)}</div>
        </span>
      );
    }
  }

  private createItems = () => {
    const {
      tableHidden,
      tableActive,
      mediaUploadsEnabled,
      availableWrapperBlockTypes,
      macroProvider
    } = this.props;
    let items: any[] = [];

    if (tableHidden === false) {
      items.push({
        content: 'Table',
        value: { name: 'table' },
        isActive: tableActive,
        tooltipDescription: tooltip(toggleTable),
        tooltipPosition: 'right',
        elemBefore: <TableIcon label="Insert table"/>,
      });
    }

    if (mediaUploadsEnabled) {
      items.push({
        content: 'Files and images',
        value: { name: 'media' },
        tooltipDescription: 'Files and Images',
        tooltipPosition: 'right',
        elemBefore: <MediaIcon label="Insert files and images"/>,
      });
    }

    if (typeof availableWrapperBlockTypes !== 'undefined' && availableWrapperBlockTypes) {
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

  private onItemActivated = ({ item }) => {
    const {
      editorView,
      onShowMediaPicker,
      onInsertBlockType,
      onInsertMacroFromMacroBrowser,
      macroProvider
    } = this.props;

    analytics.trackEvent(`atlassian.editor.format.${item.value.name}.button`);

    switch(item.value.name) {
      case 'table':
        tableCommands.createTable()(editorView.state, editorView.dispatch);
        break;
      case 'media':
        onShowMediaPicker!();
        break;
      case 'codeblock':
      case 'blockquote':
      case 'panel':
        onInsertBlockType!(item.value.name, editorView);
        break;
      case 'macro':
        onInsertMacroFromMacroBrowser!(editorView, macroProvider!);
    }
  }
}
