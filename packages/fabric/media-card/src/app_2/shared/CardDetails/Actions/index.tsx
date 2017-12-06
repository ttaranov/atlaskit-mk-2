import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { ActionViewModel } from '../../../ViewModel';
import { Wrapper } from './styled';

export interface UsersProps {
  compact?: boolean;
  actions?: ActionViewModel[];
  onAction?: (target: any) => void;
}

export default class Actions extends React.Component<UsersProps> {
  createActionHandler = (target: any) => {
    return (event?: MouseEvent) => {
      /* prevent the parent link handler from opening a URL when clicked */
      if (event) {
        event.preventDefault();
      }

      const { onAction } = this.props;
      if (onAction) {
        onAction(target);
      }
    };
  };

  handleOpenChange = ({ event }: { event: MouseEvent }) => {
    /* prevent the parent link handler from opening a URL when clicked */
    if (event) {
      event.preventDefault();
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
            <Button onClick={this.createActionHandler(firstAction.target)}>
              {firstAction.title}
            </Button>
          ) : null}
          {secondAction ? (
            <Button onClick={this.createActionHandler(secondAction.target)}>
              {secondAction.title}
            </Button>
          ) : null}
          {otherActions.length ? (
            <DropdownMenu
              triggerType="button"
              onOpenChange={this.handleOpenChange}
            >
              <DropdownItemGroup>
                {otherActions.map(action => (
                  <DropdownItem
                    key={action.title}
                    onClick={this.createActionHandler(action.target)}
                  >
                    {action.title}
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
