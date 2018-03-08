import * as React from 'react';
import { Component } from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import { CardAction } from '../../actions';
import { PreventClickThrough } from '../preventClickThrough';
import { MeatBallsWrapper } from './styled';

export type CardActionsDropdownMenuProps = {
  readonly actions: CardAction[];

  readonly triggerColor?: string;
  readonly onOpenChange?: (attrs: { isOpen: boolean }) => void;
};

export class CardActionsDropdownMenu extends Component<
  CardActionsDropdownMenuProps
> {
  render(): JSX.Element {
    const { actions, triggerColor, onOpenChange } = this.props;

    const iconBefore = (
      <MeatBallsWrapper style={{ color: triggerColor }}>
        <MoreIcon label="more" />
      </MeatBallsWrapper>
    );

    return (
      <PreventClickThrough>
        <DropdownMenu
          onOpenChange={onOpenChange}
          triggerType="button"
          triggerButtonProps={{
            className: 'meat-balls-button',
            appearance: 'subtle',
            iconBefore,
          }}
        >
          <DropdownItemGroup>
            {actions.map(({ label, handler }, index) => (
              <DropdownItem key={index} onClick={() => handler()}>
                {label}
              </DropdownItem>
            ))}
          </DropdownItemGroup>
        </DropdownMenu>
      </PreventClickThrough>
    );
  }
}
