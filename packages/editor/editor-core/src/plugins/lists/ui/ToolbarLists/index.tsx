import * as React from 'react';
import { PureComponent } from 'react';
import { EditorView } from 'prosemirror-view';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import TaskIcon from '@atlaskit/icon/glyph/editor/task';
import ExpandIcon from '@atlaskit/icon/glyph/chevron-down';
import { analyticsDecorator as analytics } from '../../../../analytics';
import {
  toggleBulletList as toggleBulletListKeymap,
  toggleOrderedList as toggleOrderedListKeymap,
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
import { toggleBulletList, toggleOrderedList } from '../../commands';

export interface Props {
  editorView: EditorView;
  bulletListActive?: boolean;
  bulletListDisabled?: boolean;
  orderedListActive?: boolean;
  orderedListDisabled?: boolean;
  allowTasks?: boolean;
  disabled?: boolean;
  isSmall?: boolean;
  isSeparator?: boolean;
  isReducedSpacing?: boolean;
  popupsMountPoint?: HTMLElement;
  popupsBoundariesElement?: HTMLElement;
  popupsScrollableElement?: HTMLElement;
}

export interface State {
  isDropdownOpen: boolean;
}

export default class ToolbarLists extends PureComponent<Props, State> {
  state: State = {
    isDropdownOpen: false,
  };

  handleTriggerClick = () => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    });
  };

  createItems = () => {
    const {
      bulletListDisabled,
      orderedListDisabled,
      bulletListActive,
      orderedListActive,
    } = this.props;
    let items = [
      {
        content: 'Bullet List',
        value: { name: 'bullet_list' },
        isDisabled: bulletListDisabled,
        isActive: Boolean(bulletListActive),
        tooltipDescription: 'Numbered list',
        tooltipPosition: 'right',
        elemBefore: <BulletListIcon label="Numbered list" />,
      },
      {
        content: 'Ordered List',
        value: { name: 'ordered_list' },
        isDisabled: orderedListDisabled,
        isActive: Boolean(orderedListActive),
        tooltipDescription: 'Ordered list',
        tooltipPosition: 'right',
        elemBefore: <NumberListIcon label="Ordered list" />,
      },
    ];
    if (this.props.allowTasks) {
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
      allowTasks,
      bulletListActive,
      bulletListDisabled,
      orderedListActive,
      orderedListDisabled,
    } = this.props;
    const { isDropdownOpen } = this.state;
    if (!isSmall) {
      return (
        <ButtonGroup width={isReducedSpacing ? 'small' : 'large'}>
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBulletListClick}
            selected={bulletListActive}
            disabled={bulletListDisabled || disabled}
            title={tooltip(toggleBulletListKeymap)}
            iconBefore={<BulletListIcon label="Unordered list" />}
          />
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleOrderedListClick}
            selected={orderedListActive}
            disabled={orderedListDisabled || disabled}
            title={tooltip(toggleOrderedListKeymap)}
            iconBefore={<NumberListIcon label="Ordered list" />}
          />
          {allowTasks && (
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              onClick={this.handleCreateAction}
              disabled={disabled}
              title="Create action []"
              iconBefore={<TaskIcon label="Create action" />}
            />
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

  @analytics('atlassian.editor.format.list.bullet.button')
  private handleBulletListClick = () => {
    if (!this.props.bulletListDisabled) {
      return toggleBulletList(this.props.editorView);
    }
    return false;
  };

  @analytics('atlassian.editor.format.list.numbered.button')
  private handleOrderedListClick = () => {
    if (!this.props.orderedListDisabled) {
      return toggleOrderedList(this.props.editorView);
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
    }
  };
}
