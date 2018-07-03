import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import DecisionIcon from '@atlaskit/icon/glyph/editor/decision';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { analyticsDecorator as analytics } from '../../../../analytics';
import {
  toggleBulletList,
  toggleOrderedList,
  tooltip,
} from '../../../../keymaps';
import ToolbarButton from '../../../../ui/ToolbarButton';
import DropdownMenu from '../../../../ui/DropdownMenu';
import {
  ButtonGroup,
  Separator,
  Wrapper,
  ExpandIconWrapper,
} from '../../../../ui/styles';
import { changeToTaskDecision } from '../../../tasks-and-decisions/commands';
import { ListsState } from '../../pm-plugins/main';
import { ListsState as FutureListsState } from '../../pm-plugins/main';

export interface Props {
  editorView: EditorView;
  pluginState: ListsState | FutureListsState;
  disabled?: boolean;
  isSmall?: boolean;
  isSeparator?: boolean;
  isReducedSpacing?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
  enableTaskDecisionToolbar?: boolean;
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
    if (this.props.enableTaskDecisionToolbar) {
      items.push({
        content: 'Create action',
        value: { name: 'action' },
        isDisabled: false,
        isActive: false,
        tooltipDescription: 'Create action',
        tooltipPosition: 'right',
        elemBefore: <TaskIcon label="Create action" />,
      });
    }
    return [
      {
        items,
      },
    ];
  };

  render() {
    const {
      disabled,
      isSmall,
      isReducedSpacing,
      isSeparator,
      enableTaskDecisionToolbar,
    } = this.props;
    const {
      bulletListActive,
      bulletListDisabled,
      orderedListActive,
      orderedListDisabled,
      isDropdownOpen,
    } = this.state;
    if (!isSmall) {
      return (
        <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
          {this.state.bulletListHidden ? null : (
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              onClick={this.handleBulletListClick}
              selected={bulletListActive}
              disabled={bulletListDisabled || disabled}
              title={tooltip(toggleBulletList)}
              iconBefore={<BulletListIcon label="Unordered list" />}
            />
          )}
          {this.state.orderedListHidden ? null : (
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              onClick={this.handleOrderedListClick}
              selected={orderedListActive}
              disabled={orderedListDisabled || disabled}
              title={tooltip(toggleOrderedList)}
              iconBefore={<NumberListIcon label="Ordered list" />}
            />
          )}
          {enableTaskDecisionToolbar && (
            <>
              <ToolbarButton
                spacing={isReducedSpacing ? 'none' : 'default'}
                onClick={this.handleCreateAction}
                disabled={disabled}
                title="Create action []"
                iconBefore={<TaskIcon label="Create action" />}
              />
              <ToolbarButton
                spacing={isReducedSpacing ? 'none' : 'default'}
                onClick={this.handleCreateDecision}
                disabled={disabled}
                title="Create decision <>"
                iconBefore={<DecisionIcon label="Create decision" />}
              />
            </>
          )}
          {isSeparator && <Separator />}
        </ButtonGroup>
      );
    } else {
      const items = this.createItems();
      const {
        popupsMountPoint,
        popupsBoundariesElement,
        popupsScrollableElement,
      } = this.props;
      return (
        <Wrapper>
          <DropdownMenu
            items={items}
            onItemActivated={this.onItemActivated}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            isOpen={isDropdownOpen}
            fitHeight={188}
            fitWidth={175}
          >
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
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
          {isSeparator && <Separator />}
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

  @analytics('atlassian.fabric.action.trigger.button')
  private handleCreateAction = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    changeToTaskDecision(editorView, 'taskList');
    return true;
  };

  @analytics('atlassian.fabric.decision.trigger.button')
  private handleCreateDecision = (): boolean => {
    const { editorView } = this.props;
    if (!editorView) {
      return false;
    }
    changeToTaskDecision(editorView, 'decisionList');
    return true;
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
      case 'action':
        this.handleCreateAction();
        break;
      case 'decision':
        this.handleCreateDecision();
        break;
    }
  };
}
