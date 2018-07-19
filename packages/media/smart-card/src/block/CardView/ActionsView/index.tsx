import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import MeatballIcon from '@atlaskit/icon/glyph/more';
import DropdownMenu, {
  DropdownItemGroup,
  DropdownItem,
} from '@atlaskit/dropdown-menu';
import { Wrapper } from './styled';

export interface ActionHandlerCallbacks {
  progress: () => void;
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

    // display a maximum of 3 actions
    const limitedActions = actions.slice(0, 3);

    if (limitedActions.length === 0) {
      return null;
    }

    let firstAction;
    let secondAction;
    let otherActions;
    if (limitedActions.length === 2) {
      firstAction = limitedActions[0];
      secondAction = limitedActions[1];
      otherActions = [];
    } else {
      firstAction = limitedActions[0];
      otherActions = limitedActions.slice(1);
    }
    console.log({ otherActions });
    return (
      <Wrapper>
        <ButtonGroup>
          {firstAction ? (
            <Button onClick={this.createActionHandler(firstAction)}>
              {firstAction.text}
            </Button>
          ) : null}
          {secondAction ? (
            <Button onClick={this.createActionHandler(secondAction)}>
              {secondAction.text}
            </Button>
          ) : null}
          {otherActions.length ? (
            <DropdownMenu
              triggerType="button"
              triggerButtonProps={{
                appearance: 'subtle',
                iconAfter: <MeatballIcon label="actions" size="medium" />,
              }}
              onOpenChange={this.handleOpenChange}
            >
              <DropdownItemGroup>
                {otherActions.map(action => (
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
