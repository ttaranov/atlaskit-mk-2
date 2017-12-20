import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import MeatballIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { ActionViewModel } from '../../../shared/ViewModel';
import { Wrapper } from './styled';

export interface UsersProps {
  compact?: boolean;
  actions?: ActionViewModel[];
}

export default class Actions extends React.Component<UsersProps> {
  createActionHandler = (handler?: () => void) => {
    return (event?: MouseEvent) => {
      /* prevent the parent link handler from opening a URL when clicked */
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      if (handler) {
        handler();
      }
    };
  };

  handleOpenChange = ({ event }: { event: MouseEvent }) => {
    /* prevent the parent link handler from opening a URL when clicked */
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  render() {
    const { compact = false, actions = [] } = this.props;

    if (actions.length === 0) {
      return null;
    }

    let firstAction;
    let secondAction;
    let otherActions;
    if (compact) {
      otherActions = actions;
    } else if (actions.length === 2) {
      firstAction = actions[0];
      secondAction = actions[1];
      otherActions = [];
    } else {
      firstAction = actions[0];
      otherActions = actions.slice(1);
    }

    return (
      <Wrapper>
        <ButtonGroup>
          {firstAction ? (
            <Button onClick={this.createActionHandler(firstAction.handler)}>
              {firstAction.text}
            </Button>
          ) : null}
          {secondAction ? (
            <Button onClick={this.createActionHandler(secondAction.handler)}>
              {secondAction.text}
            </Button>
          ) : null}
          {otherActions.length ? (
            <DropdownMenu
              triggerType="button"
              triggerButtonProps={{
                iconAfter: <MeatballIcon label="actions" size="medium" />,
              }}
              onOpenChange={this.handleOpenChange}
            >
              <DropdownItemGroup>
                {otherActions.map(action => (
                  <DropdownItem
                    key={action.text}
                    onClick={this.createActionHandler(action.handler)}
                  >
                    {action.text}
                  </DropdownItem>
                ))}
              </DropdownItemGroup>
            </DropdownMenu>
          ) : null}
        </ButtonGroup>
      </Wrapper>
    );
  }
}
