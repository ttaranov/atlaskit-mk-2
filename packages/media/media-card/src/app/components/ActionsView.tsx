/* tslint:disable:variable-name */
import * as React from 'react';
import DropdownMenu from '@atlaskit/dropdown-menu';
import MeatballIcon from '@atlaskit/icon/glyph/more';
import { AppCardAction, AppCardActionCallbackHandlers } from '../model';
import {
  Actions,
  ActionsMenu,
  ActionButtonWrapper,
  FailureMessageBlock,
  FailureMessage,
  SuccessMessage,
  ButtonWrapper,
} from '../styled/ActionsView';
import Spinner from '@atlaskit/spinner';
import Button from '@atlaskit/button';

export const UntypedButton = Button as any;
export const TRY_AGAIN_LINK_TEXT = 'Try again';

export type THEME = 'dark' | 'default';

export interface ActionsViewProps {
  actions: AppCardAction[];
  isInversed: boolean;
  onActionClick?: (
    action: AppCardAction,
    handlers: AppCardActionCallbackHandlers,
  ) => void;
}

export interface ActionsViewState {
  actionInProgress?: number | null;
  successMessage?: string | null;
  failureMessage?: string | null;
  tryAgainLinkText?: string | null;
  tryAgain?: boolean;
}

export interface ActionsViewAction {
  appCardAction: AppCardAction;
  key: number;
}

export class ActionsView extends React.Component<
  ActionsViewProps,
  ActionsViewState
> {
  mounted: boolean;

  state: ActionsViewState = {
    actionInProgress: null,
    successMessage: null,
    failureMessage: null,
    tryAgain: false,
    tryAgainLinkText: null,
  };

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  get actions(): ActionsViewAction[] {
    return this.props.actions.map((action, index) => ({
      appCardAction: action,
      key: index,
    }));
  }

  get primaryAction(): ActionsViewAction | undefined {
    return this.actions[0];
  }

  get secondaryAction(): ActionsViewAction | undefined {
    return this.actions[1];
  }

  get otherActions(): ActionsViewAction[] {
    return this.actions.slice(2);
  }

  handleActionButton = (action: ActionsViewAction) => (event: Event) => {
    const { onActionClick } = this.props;

    // allow the user to click the button but prevent the event bubling up and being handled by the
    // card onClick event
    event.stopPropagation();

    if (onActionClick) {
      onActionClick(
        action.appCardAction,
        this.createCallbackHandlers(action.key),
      );
    }
  };

  updateProgressState(state: ActionsViewState) {
    if (!this.mounted) {
      return;
    }
    this.setState(state);
  }

  createCallbackHandlers(actionType: number): AppCardActionCallbackHandlers {
    return {
      progress: () =>
        this.updateProgressState({
          actionInProgress: actionType,
        }),
      success: message =>
        this.updateProgressState({
          actionInProgress: null,
          successMessage: message || null,
        }),
      failure: (
        message,
        tryAgain = false,
        tryAgainLinkText = TRY_AGAIN_LINK_TEXT,
      ) =>
        this.updateProgressState({
          actionInProgress: null,
          failureMessage: message || null,
          tryAgain,
          tryAgainLinkText,
        }),
    };
  }

  handleOtherAction = ({ item }: any) => {
    const { onActionClick } = this.props;
    const action: ActionsViewAction = item.action;
    if (onActionClick && action) {
      onActionClick(
        action.appCardAction,
        this.createCallbackHandlers(action.key),
      );
    }
  };

  handleMeatballsClick(event: any) {
    event.stopPropagation();
  }

  handleTryAgain = (event: any) => {
    event.stopPropagation();
    this.setState({
      failureMessage: null,
      tryAgain: false,
      tryAgainLinkText: null,
    });
  };

  get theme(): THEME {
    const { isInversed } = this.props;
    return (isInversed && 'dark') || 'default';
  }

  get isInProgress(): boolean {
    return this.state.actionInProgress !== null;
  }

  get isOtherActionInProgress(): boolean {
    if (!this.isInProgress) {
      return false;
    }
    return this.otherActions.some(
      action => action.key === this.state.actionInProgress,
    );
  }

  getActionButton(action: ActionsViewAction | undefined) {
    if (action) {
      const { isInversed } = this.props;
      const { actionInProgress } = this.state;
      const isCurrentActionInProgress = actionInProgress === action.key;
      const spinner = isCurrentActionInProgress ? (
        <Spinner size="small" invertColor={isInversed} />
      ) : null;
      const content = isCurrentActionInProgress
        ? null
        : action.appCardAction.title;
      return (
        <ActionButtonWrapper>
          <ButtonWrapper isDark={isInversed}>
            <UntypedButton
              isDisabled={this.isInProgress}
              onClick={this.handleActionButton(action)}
              theme={this.theme}
              iconAfter={spinner}
            >
              {content}
            </UntypedButton>
          </ButtonWrapper>
        </ActionButtonWrapper>
      );
    }
    return null;
  }

  getMeatballsButton() {
    const { isInversed } = this.props;
    const icon = this.isOtherActionInProgress ? (
      <Spinner size="small" invertColor={isInversed} />
    ) : (
      <MeatballIcon label="actions" size="medium" />
    );
    return (
      <ButtonWrapper isDark={isInversed}>
        <UntypedButton
          isDisabled={this.isInProgress}
          appearance="subtle"
          iconBefore={icon}
          theme={this.theme}
        />
      </ButtonWrapper>
    );
  }

  getDropdown() {
    const { otherActions } = this;

    if (!otherActions.length) {
      return null;
    }

    return (
      <ActionsMenu onClick={this.handleMeatballsClick}>
        {/* FIXME: dropdown trigger is 1px larger cause display: flex-inline on the trigger and wrapped in divs from popper - need to change something upstream */}
        <DropdownMenu
          items={[
            {
              items: otherActions.map(action => ({
                isDisabled: this.isInProgress,
                content: action.appCardAction.title,
                action,
              })),
            },
          ]}
          onItemActivated={this.handleOtherAction}
        >
          {this.getMeatballsButton()}
        </DropdownMenu>
      </ActionsMenu>
    );
  }

  render(): JSX.Element {
    const {
      failureMessage,
      successMessage,
      tryAgain,
      tryAgainLinkText,
    } = this.state;

    if (failureMessage !== null) {
      return (
        <FailureMessageBlock>
          <FailureMessage tryAgain={tryAgain}>{failureMessage}</FailureMessage>
          {tryAgain ? (
            <UntypedButton
              appearance="link"
              onClick={this.handleTryAgain}
              theme={this.theme}
            >
              {tryAgainLinkText}
            </UntypedButton>
          ) : null}
        </FailureMessageBlock>
      );
    }

    if (successMessage !== null) {
      return <SuccessMessage>{successMessage}</SuccessMessage>;
    }

    return (
      <Actions>
        {this.getActionButton(this.primaryAction)}
        {this.getActionButton(this.secondaryAction)}
        {this.getDropdown()}
      </Actions>
    );
  }
}
