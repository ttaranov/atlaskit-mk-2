import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import { analyticsDecorator as analytics } from '../../analytics';
import { toggleBulletList, toggleOrderedList, tooltip } from '../../keymaps';
import { ListsState } from '../../plugins/lists';
import { ListsState as FutureListsState } from '../../plugins/lists';
import ToolbarButton from '../ToolbarButton';
import EditorWidth from '../../utils/editor-width';
import DropdownMenu from '../DropdownMenu';
import { ButtonGroup, Separator, Wrapper, ExpandIconWrapper } from './styles';

export interface Props {
  editorView: EditorView;
  pluginState: ListsState | FutureListsState;
  disabled?: boolean;
  editorWidth?: number;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
}

export interface State {
  bulletListActive: boolean;
  bulletListDisabled: boolean;
  bulletListHidden: boolean;
  orderedListActive: boolean;
  orderedListDisabled: boolean;
  orderedListHidden: boolean;
  isDropdownOpen: boolean;
}

export default class ToolbarLists extends PureComponent<Props, State> {
  state: State = {
    bulletListActive: false,
    bulletListDisabled: false,
    bulletListHidden: false,
    orderedListActive: false,
    orderedListDisabled: false,
    orderedListHidden: false,
    isDropdownOpen: false,
  };

  componentDidMount() {
    if (this.props.editorView) {
      (this.props.pluginState as FutureListsState).subscribe(
        this.handleFuturePluginStateChange,
      );
    } else {
      (this.props.pluginState as ListsState).subscribe(
        this.handlePluginStateChange,
      );
    }
  }

  componentWillUnmount() {
    if (this.props.editorView) {
      (this.props.pluginState as FutureListsState).unsubscribe(
        this.handleFuturePluginStateChange,
      );
    } else {
      (this.props.pluginState as ListsState).unsubscribe(
        this.handlePluginStateChange,
      );
    }
  }

  handleTriggerClick = () => {
    const isDropdownOpen = !this.state.isDropdownOpen;
    this.setState({
      isDropdownOpen,
    });
  };

  createItems = () => {
    const {
      bulletListDisabled,
      orderedListDisabled,
      bulletListActive,
      orderedListActive,
    } = this.state;
    let items: any[] = [];
    items.push({
      content: 'Bullet List',
      value: { name: 'bullet_list' },
      isDisabled: bulletListDisabled,
      isActive: bulletListActive,
      tooltipDescription: 'Numbered list',
      tooltipPosition: 'right',
      elemBefore: <BulletListIcon label="Numbered list" />,
    });
    items.push({
      content: 'Ordered List',
      value: { name: 'ordered_list' },
      isDisabled: orderedListDisabled,
      isActive: orderedListActive,
      tooltipDescription: 'Ordered list',
      tooltipPosition: 'right',
      elemBefore: <NumberListIcon label="Ordered list" />,
    });
    return [
      {
        items,
      },
    ];
  };

  render() {
    const { editorWidth, disabled } = this.props;
    const {
      bulletListActive,
      bulletListDisabled,
      orderedListActive,
      orderedListDisabled,
      isDropdownOpen,
    } = this.state;
    if (!editorWidth || editorWidth > EditorWidth.BreakPoint9) {
      return (
        <ButtonGroup
          width={editorWidth! > EditorWidth.BreakPoint10 ? 'large' : 'small'}
        >
          {this.state.bulletListHidden ? null : (
            <ToolbarButton
              spacing={
                editorWidth && editorWidth > EditorWidth.BreakPoint10
                  ? 'default'
                  : 'none'
              }
              onClick={this.handleBulletListClick}
              selected={bulletListActive}
              disabled={bulletListDisabled || disabled}
              title={tooltip(toggleBulletList)}
              iconBefore={<BulletListIcon label="Unordered list" />}
            />
          )}
          {this.state.orderedListHidden ? null : (
            <ToolbarButton
              spacing={
                editorWidth && editorWidth > EditorWidth.BreakPoint10
                  ? 'default'
                  : 'none'
              }
              onClick={this.handleOrderedListClick}
              selected={orderedListActive}
              disabled={orderedListDisabled || disabled}
              title={tooltip(toggleOrderedList)}
              iconBefore={<NumberListIcon label="Ordered list" />}
            />
          )}
          <Separator />
        </ButtonGroup>
      );
    } else {
      const items = this.createItems();
      const { popupsMountPoint, popupsBoundariesElement } = this.props;
      return (
        <Wrapper>
          <DropdownMenu
            items={items}
            onItemActivated={this.onItemActivated}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            isOpen={isDropdownOpen}
            fitHeight={188}
            fitWidth={175}
          >
            <ToolbarButton
              spacing={
                editorWidth && editorWidth > EditorWidth.BreakPoint10
                  ? 'default'
                  : 'none'
              }
              selected={bulletListActive || orderedListActive}
              disabled={disabled}
              onClick={this.handleTriggerClick}
              iconBefore={
                <Wrapper>
                  <BulletListIcon label="Add list" />
                  <ExpandIconWrapper>
                    <ExpandIcon label="Open or close insert block dropdown" />
                  </ExpandIconWrapper>
                </Wrapper>
              }
            />
          </DropdownMenu>
        </Wrapper>
      );
    }
  }

  private handlePluginStateChange = (pluginState: ListsState) => {
    this.setState({
      bulletListActive: pluginState.bulletListActive,
      bulletListDisabled: pluginState.bulletListDisabled,
      bulletListHidden: pluginState.bulletListHidden,
      orderedListActive: pluginState.orderedListActive,
      orderedListDisabled: pluginState.orderedListDisabled,
      orderedListHidden: pluginState.orderedListHidden,
    });
  };

  private handleFuturePluginStateChange = (pluginState: FutureListsState) => {
    this.setState({
      bulletListActive: pluginState.bulletListActive,
      bulletListDisabled: pluginState.bulletListDisabled,
      bulletListHidden: pluginState.bulletListHidden,
      orderedListActive: pluginState.orderedListActive,
      orderedListDisabled: pluginState.orderedListDisabled,
      orderedListHidden: pluginState.orderedListHidden,
    });
  };

  @analytics('atlassian.editor.format.list.bullet.button')
  private handleBulletListClick = () => {
    if (!this.state.bulletListDisabled) {
      if (this.props.editorView) {
        return (this.props.pluginState as FutureListsState).toggleBulletList(
          this.props.editorView,
        );
      }
      return (this.props.pluginState as ListsState).toggleBulletList(
        this.props.editorView,
      );
    }
    return false;
  };

  @analytics('atlassian.editor.format.list.numbered.button')
  private handleOrderedListClick = () => {
    if (!this.state.orderedListDisabled) {
      if (this.props.editorView) {
        return (this.props.pluginState as FutureListsState).toggleOrderedList(
          this.props.editorView,
        );
      }
      return (this.props.pluginState as ListsState).toggleOrderedList(
        this.props.editorView,
      );
    }
    return false;
  };

  private onItemActivated = ({ item }) => {
    this.setState({ isDropdownOpen: false });
    switch (item.value.name) {
      case 'bullet_list':
        this.handleBulletListClick();
        break;
      case 'ordered_list':
        this.handleOrderedListClick();
        break;
    }
  };
}
