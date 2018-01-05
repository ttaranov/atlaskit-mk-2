import * as React from 'react';
import { PureComponent } from 'react';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import TextStyleIcon from '@atlaskit/icon/glyph/editor/text-style';
import ToolbarButton from '../ToolbarButton';
import { analyticsService as analytics } from '../../analytics';
import { BlockTypeState } from '../../plugins/block-type';
import { BlockType } from '../../plugins/block-type/types';
import { EditorView } from 'prosemirror-view';
import DropdownMenu from '../DropdownMenu';
import EditorWidth from '../../utils/editor-width';
import {
  ButtonContent,
  Separator,
  Wrapper,
  MenuWrapper,
  ExpandIconWrapper,
} from './styles';

export interface Props {
  isDisabled?: boolean;
  editorWidth?: number;
  editorView: EditorView;
  pluginState: BlockTypeState;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

export interface State {
  active: boolean;
  availableBlockTypes: BlockType[];
  currentBlockType: BlockType;
  blockTypesDisabled: boolean;
}

export default class ToolbarBlockType extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    const { pluginState } = props;

    this.state = {
      active: false,
      availableBlockTypes: pluginState.availableBlockTypes,
      currentBlockType: pluginState.currentBlockType,
      blockTypesDisabled: pluginState.blockTypesDisabled,
    };
  }

  componentDidMount() {
    this.props.pluginState.subscribe(this.handlePluginStateChange);
  }

  componentWillUnmount() {
    this.props.pluginState.unsubscribe(this.handlePluginStateChange);
  }

  private onOpenChange = (attrs: any) => {
    this.setState({
      active: attrs.isOpen,
    });
  };

  render() {
    const {
      active,
      currentBlockType,
      blockTypesDisabled,
      availableBlockTypes,
    } = this.state;
    const {
      popupsMountPoint,
      popupsBoundariesElement,
      editorWidth,
    } = this.props;
    const blockTypeTitles = availableBlockTypes
      .filter(blockType => blockType.name === currentBlockType.name)
      .map(blockType => blockType.title);

    const toolbarButtonFactory = (disabled: boolean) => (
      <ToolbarButton
        spacing={
          editorWidth && editorWidth > EditorWidth.BreakPoint10
            ? 'default'
            : 'none'
        }
        selected={active}
        disabled={disabled}
        onClick={this.handleTriggerClick}
        iconAfter={
          <Wrapper>
            {editorWidth! <= EditorWidth.BreakPoint1 && (
              <TextStyleIcon label="Change formatting" />
            )}
            <ExpandIconWrapper>
              <ExpandIcon label="Change formatting" />
            </ExpandIconWrapper>
          </Wrapper>
        }
      >
        {(!editorWidth || editorWidth > EditorWidth.BreakPoint1) && (
          <ButtonContent width={editorWidth}>
            {blockTypeTitles[0] || 'Normal text'}
          </ButtonContent>
        )}
      </ToolbarButton>
    );

    if (!this.props.isDisabled && !blockTypesDisabled) {
      const items = this.createItems();
      return (
        <MenuWrapper>
          <DropdownMenu
            items={items}
            onOpenChange={this.onOpenChange}
            onItemActivated={this.handleSelectBlockType}
            isOpen={active}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            fitHeight={360}
            fitWidth={106}
          >
            {toolbarButtonFactory(false)}
          </DropdownMenu>
          <Separator />
        </MenuWrapper>
      );
    }

    return (
      <Wrapper>
        {toolbarButtonFactory(true)}
        <Separator />
      </Wrapper>
    );
  }

  private handleTriggerClick = () => {
    this.onOpenChange({ isOpen: !this.state.active });
  };

  private createItems = () => {
    const { currentBlockType, availableBlockTypes } = this.state;
    let items: any[] = [];
    availableBlockTypes.forEach((blockType, blockTypeNo) => {
      items.push({
        content: blockType.title,
        value: blockType,
        // ED-2853, hiding tooltips as shortcuts are not working atm.
        // tooltipDescription: tooltip(findKeymapByDescription(blockType.title)),
        // tooltipPosition: 'right',
        isActive: currentBlockType === blockType,
      });
    });
    return [
      {
        items,
      },
    ];
  };

  private handlePluginStateChange = (pluginState: BlockTypeState) => {
    this.setState({
      active: this.state.active,
      availableBlockTypes: pluginState.availableBlockTypes,
      currentBlockType: pluginState.currentBlockType,
      blockTypesDisabled: pluginState.blockTypesDisabled,
    });
  };

  private handleSelectBlockType = ({ item }) => {
    const blockType = item.value;
    const { availableBlockTypes } = this.state;
    this.props.pluginState.toggleBlockType(
      blockType.name,
      this.props.editorView,
    );
    this.setState({
      active: false,
      availableBlockTypes,
      currentBlockType: blockType,
    });

    analytics.trackEvent(`atlassian.editor.format.${blockType.name}.button`);
  };
}
