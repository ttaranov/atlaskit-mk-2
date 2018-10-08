import * as React from 'react';
import { PureComponent } from 'react';
import { defineMessages, injectIntl, InjectedIntlProps } from 'react-intl';
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
  Separator,
  Wrapper,
  ExpandIconWrapper,
  Shortcut,
} from '../../../../ui/styles';
import { insertTaskDecision } from '../../../tasks-and-decisions/commands';
import { toggleBulletList, toggleOrderedList } from '../../commands';
import ButtonGroup from '../../../../ui/ButtonGroup';

export const messages = defineMessages({
  unorderedList: {
    id: 'fabric.editor.unorderedList',
    defaultMessage: 'Bullet list',
    description: 'A list with bullets. Also known as an “unordered” list',
  },
  orderedList: {
    id: 'fabric.editor.orderedList',
    defaultMessage: 'Numbered list',
    description: 'A list with ordered items 1… 2… 3…',
  },
  action: {
    id: 'fabric.editor.action',
    defaultMessage: 'Action item',
    description: 'Also known as a “task”, “to do item”, or a checklist',
  },
  lists: {
    id: 'fabric.editor.lists',
    defaultMessage: 'Lists',
    description: 'Menu shows ordered/bullet list and unordered/numbered lists',
  },
});

export interface Props {
  editorView: EditorView;
  bulletListActive?: boolean;
  bulletListDisabled?: boolean;
  orderedListActive?: boolean;
  orderedListDisabled?: boolean;
  allowTasks?: boolean;
  disabled?: boolean;
  focused?: boolean;
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

class ToolbarLists extends PureComponent<Props & InjectedIntlProps, State> {
  state: State = {
    isDropdownOpen: false,
  };

  private onOpenChange = (attrs: any) => {
    this.setState({
      isDropdownOpen: attrs.isDropdownOpen,
    });
  };

  private handleTriggerClick = () => {
    this.onOpenChange({ isDropdownOpen: !this.state.isDropdownOpen });
  };

  createItems = () => {
    const {
      bulletListDisabled,
      orderedListDisabled,
      bulletListActive,
      orderedListActive,
      intl: { formatMessage },
    } = this.props;
    const labelUnorderedList = formatMessage(messages.unorderedList);
    const labelOrderedList = formatMessage(messages.orderedList);
    const labelAction = formatMessage(messages.action);

    let items = [
      {
        content: labelUnorderedList,
        value: { name: 'bullet_list' },
        isDisabled: bulletListDisabled,
        isActive: Boolean(bulletListActive),
        elemAfter: <Shortcut>{tooltip(toggleBulletListKeymap)}</Shortcut>,
      },
      {
        content: labelOrderedList,
        value: { name: 'ordered_list' },
        isDisabled: orderedListDisabled,
        isActive: Boolean(orderedListActive),
        elemAfter: <Shortcut>{tooltip(toggleOrderedListKeymap)}</Shortcut>,
      },
    ];
    if (this.props.allowTasks) {
      items.push({
        content: labelAction,
        value: { name: 'action' },
        isDisabled: false,
        isActive: false,
        // Action shortcut is not a keymap, it's a input rule.
        elemAfter: <Shortcut>[]</Shortcut>,
      });
    }
    return [{ items }];
  };

  render() {
    const {
      disabled,
      focused,
      isSmall,
      isReducedSpacing,
      isSeparator,
      allowTasks,
      bulletListActive,
      bulletListDisabled,
      orderedListActive,
      orderedListDisabled,
      intl: { formatMessage },
    } = this.props;
    const { isDropdownOpen } = this.state;
    console.log('list focused', focused);
    if (!isSmall) {
      const labelUnorderedList = formatMessage(messages.unorderedList);
      const labelOrderedList = formatMessage(messages.orderedList);
      const labelAction = formatMessage(messages.action);
      return (
        <ButtonGroup
          width={isReducedSpacing ? 'small' : 'large'}
          focused={focused}
        >
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleBulletListClick}
            selected={bulletListActive}
            disabled={bulletListDisabled || disabled}
            title={tooltip(toggleBulletListKeymap, labelUnorderedList)}
            iconBefore={<BulletListIcon label={labelUnorderedList} />}
          />
          <ToolbarButton
            spacing={isReducedSpacing ? 'none' : 'default'}
            onClick={this.handleOrderedListClick}
            selected={orderedListActive}
            disabled={orderedListDisabled || disabled}
            title={tooltip(toggleOrderedListKeymap, labelOrderedList)}
            iconBefore={<NumberListIcon label={labelOrderedList} />}
          />
          {allowTasks && (
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              onClick={this.handleCreateAction}
              disabled={disabled}
              title={`${labelAction} []`}
              iconBefore={<TaskIcon label={labelAction} />}
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

      const labelLists = formatMessage(messages.lists);
      return (
        <Wrapper>
          <DropdownMenu
            items={items}
            onItemActivated={this.onItemActivated}
            mountTo={popupsMountPoint}
            boundariesElement={popupsBoundariesElement}
            scrollableElement={popupsScrollableElement}
            isOpen={isDropdownOpen}
            onOpenChange={this.onOpenChange}
            fitHeight={188}
            fitWidth={175}
          >
            <ToolbarButton
              spacing={isReducedSpacing ? 'none' : 'default'}
              selected={bulletListActive || orderedListActive}
              disabled={disabled}
              focused={focused}
              onClick={this.handleTriggerClick}
              title={labelLists}
              iconBefore={
                <Wrapper>
                  <BulletListIcon label={labelLists} />
                  <ExpandIconWrapper>
                    <ExpandIcon label={labelLists} />
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
    insertTaskDecision(editorView, 'taskList');
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

export default injectIntl(ToolbarLists);
