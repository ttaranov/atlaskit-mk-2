import * as React from 'react';
import { Component } from 'react';

import MoreIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';

import { CardAction } from '../../actions';
import { PreventClickThrough } from '../preventClickThrough';
import { CardActionIconButton } from './cardActionIconButton';

export type CardActionsDropdownMenuProps = {
  readonly actions: CardAction[];

  readonly triggerColor?: string;
  readonly onOpenChange?: (attrs: { isOpen: boolean }) => void;
};

export class CardActionsDropdownMenu extends Component<
  CardActionsDropdownMenuProps
> {
  render(): JSX.Element | null {
    const { actions, triggerColor, onOpenChange } = this.props;

    if (actions.length > 0) {
      return (
        <PreventClickThrough>
          <DropdownMenu
            onOpenChange={onOpenChange}
            trigger={
              <CardActionIconButton
                icon={<MoreIcon label="more" />}
                triggerColor={triggerColor}
              />
            }
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
    } else {
      return null;
    }
  }
}
