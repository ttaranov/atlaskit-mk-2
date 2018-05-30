import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import MeatballIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { Wrapper } from './styled';

export interface ActionHandlerCallbacks {
  pending: () => void;
  success: (message?: string) => void;
  failure: () => void;
}

export interface ActionHandler {
  (callbacks: ActionHandlerCallbacks): void;
}

export interface Action {
  text: string;
  // I chose an action handler over a generic data blob because there's no ambiguity in which action the
  // blob originated from when multiple actions contain the same blob - edge case I know, but why not
  handler: ActionHandler;
}

export interface ActionsViewProps {
  actions?: Action[];
  onAction?: (action: Action) => void;
}

export default class ActionsView extends React.Component<ActionsViewProps> {
  createActionHandler = (action: Action) => {
    return (event?: MouseEvent) => {
      /* prevent the parent link handler from opening a URL when clicked */
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      const { onAction } = this.props;
      if (onAction) {
        onAction(action);
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
    const { actions = [] } = this.props;

    if (actions.length === 0) {
      return null;
    }

    let buttonActions;
    let menuActions;
    if (actions.length > 3) {
      buttonActions = actions.slice(0, 2);
      menuActions = actions.slice(2);
    } else {
      buttonActions = actions.slice(0, 3);
      menuActions = actions.slice(3);
    }

    return (
      <Wrapper>
        <ButtonGroup>
          {buttonActions.map(action => (
            <Button
              key={action.text}
              spacing="compact"
              onClick={this.createActionHandler(action)}
            >
              {action.text}
            </Button>
          ))}
          {menuActions.length ? (
            <DropdownMenu
              triggerType="button"
              triggerButtonProps={{
                appearance: 'subtle',
                spacing: 'compact',
                iconAfter: <MeatballIcon label="actions" size="medium" />,
              }}
              onOpenChange={this.handleOpenChange}
            >
              <DropdownItemGroup>
                {menuActions.map(action => (
                  <DropdownItem
                    key={action.text}
                    onClick={this.createActionHandler(action)}
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
