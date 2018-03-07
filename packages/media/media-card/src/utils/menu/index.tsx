import * as React from 'react';
import { Component, MouseEvent } from 'react';
import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu from '@atlaskit/dropdown-menu';

import { CardAction, CardEventHandler } from '../../actions';
import { Wrapper, DeleteBtn, MeatBallsWrapper } from './styled';

export interface MenuProps {
  actions?: Array<CardAction>;
  onToggle?: (attrs: { isOpen: boolean }) => void;
  triggerColor?: string;
}

export class Menu extends Component<MenuProps, {}> {
  static defaultProps = {
    actions: [],
    onToggle: () => null,
  };

  render() {
    const actions = this.props.actions || [];

    if (!actions.length) {
      return null;
    }

    const primaryAction = actions.find(
      ({ icon }) => icon !== undefined && icon !== null,
    );

    const otherActions = actions.filter(action => action !== primaryAction);

    if (primaryAction) {
      return (
        <Wrapper>
          {this.renderPrimaryActionButton(primaryAction)}
          {this.renderOtherActionButtons(otherActions)}
        </Wrapper>
      );
    } else {
      return <Wrapper>{this.renderOtherActionButtons(otherActions)}</Wrapper>;
    }
  }

  private renderPrimaryActionButton(action: CardAction) {
    const { triggerColor } = this.props;

    return (
      <DeleteBtn
        onClick={this.deleteBtnClick(action.handler)}
        style={{ color: triggerColor }}
      >
        {action.icon}
      </DeleteBtn>
    );
  }

  private renderOtherActionButtons(actions: CardAction[]) {
    if (actions.length === 0) {
      return null;
    } else {
      const primaryAction = actions.find(
        ({ icon }) => icon !== undefined && icon !== null,
      );
      const otherActions = actions.filter(action => action !== primaryAction);

      if (primaryAction && otherActions.length === 0) {
        return this.renderPrimaryActionButton(primaryAction);
      } else {
        return this.renderDropdown(actions);
      }
    }
  }

  private renderDropdown(actions: Array<CardAction>) {
    // Note: handler here does not do anything within DropdownMenu it is called by this.onItemActivated
    const items = actions.map(i => ({ content: i.label, handler: i.handler }));
    const dropdownItems = [{ items }];

    return (
      <span onClick={this.meatballsBtnClick}>
        <DropdownMenu
          items={dropdownItems}
          onOpenChange={this.props.onToggle}
          onItemActivated={this.onItemActivated}
          triggerType="button"
          triggerButtonProps={{
            className: 'meat-balls-button',
            appearance: 'subtle',
            iconBefore: this.renderIconBefore(),
          }}
        />
      </span>
    );
  }

  private renderIconBefore = () => {
    const { triggerColor } = this.props;

    return (
      <MeatBallsWrapper style={{ color: triggerColor }}>
        <MoreIcon label="more" />
      </MeatBallsWrapper>
    );
  };

  private meatballsBtnClick(e: MouseEvent<HTMLElement>) {
    // we don't want the click to through to the consumers onClick API function
    e.stopPropagation();
    e.preventDefault();
  }

  private deleteBtnClick(handler: CardEventHandler) {
    return (e: MouseEvent<HTMLDivElement>) => {
      // we don't want the click to through to the consumers onClick API function
      e.stopPropagation();
      e.preventDefault();
      handler();
    };
  }

  private onItemActivated = attrs => {
    if (attrs.item && attrs.item.handler) {
      attrs.item.handler();
    }
  };
}

export default Menu;
