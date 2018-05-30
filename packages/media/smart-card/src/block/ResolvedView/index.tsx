import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Avatar from '@atlaskit/avatar';
import Tooltip from '@atlaskit/tooltip';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { IconImage } from '@atlaskit/media-ui';
import {
  TextWithTooltip,
  IconWithTooltip,
  UserViewModel,
  DetailViewModel,
} from '../CardView/ViewModel';
import ActionsView, { Action } from './ActionsView';
import AlertView from './AlertView';
import UsersView from './UsersView';
import Widgets from './Widgets';
import {
  ContentWrapper,
  LeftWrapper,
  BodyWrapper,
  TopWrapper,
  RightWrapper,
  Title,
  Byline,
  Description,
  Thumbnail,
  ActionsWrapper,
  AlertWrapper,
} from './styled';
import Transition from './Transition';

export interface ResolvedViewProps {
  title?: TextWithTooltip;
  byline?: TextWithTooltip;
  description?: TextWithTooltip;
  icon?: IconWithTooltip;
  user?: UserViewModel;
  users?: UserViewModel[];
  thumbnail?: string;
  details?: DetailViewModel[];
  actions?: Action[];
}

export interface ResolvedViewState {
  pendingAction?: Action;
  actionState?: 'pending' | 'success' | 'failure';
  actionMessage?: string;
}

function getActionPendingState(): Pick<
  ResolvedViewState,
  'actionState' | 'actionMessage'
> {
  return {
    actionState: 'pending',
    actionMessage: undefined,
  };
}

function getActionSuccessState(
  message?: string,
): Pick<ResolvedViewState, 'actionState' | 'actionMessage'> {
  return {
    actionState: 'success',
    actionMessage: message,
  };
}

function getActionFailureState(
  message?: string,
): Pick<ResolvedViewState, 'actionState' | 'actionMessage'> {
  return {
    actionState: 'failure',
    actionMessage: message,
  };
}

function clearActionState(): Pick<
  ResolvedViewState,
  'actionState' | 'actionMessage'
> {
  return {
    actionState: undefined,
    actionMessage: undefined,
  };
}

export class ResolvedView extends React.Component<
  ResolvedViewProps,
  ResolvedViewState
> {
  state: ResolvedViewState = {};

  alertTimeout?: number;

  get actionHandlerCallbacks() {
    return {
      pending: () => this.setState(getActionPendingState()),
      success: (message: string) => {
        this.setState(getActionSuccessState(message), () => {
          // hide the alert after 2s
          this.alertTimeout = setTimeout(
            () => this.setState(clearActionState()),
            2000,
          );
        });
      },
      failure: () =>
        this.setState(getActionFailureState('Something went wrong.')),
    };
  }

  handleAction = (action: Action) => {
    // store the action so we can try it again later if it fails
    this.setState({ pendingAction: action });

    // prevent the next alert from being cleared by any previous success alerts that haven't already been cleared
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }

    // handle the action
    action.handler(this.actionHandlerCallbacks);
  };

  handleActionRetry = () => {
    const { pendingAction } = this.state;
    if (pendingAction) {
      pendingAction.handler(this.actionHandlerCallbacks);
    }
  };

  handleActionDismis = () => {
    this.setState(clearActionState());
  };

  componentWillUnmount() {
    // prevent the alert from being cleared and unmounted
    if (this.alertTimeout) {
      clearTimeout(this.alertTimeout);
    }
  }
  renderIcon() {
    const { icon } = this.props;

    if (!icon) {
      return null;
    }

    // TODO: handle if there is an error loading the image -> show the placeholder
    return (
      <Tooltip content={icon.tooltip}>
        <IconImage src={icon.url} size={24} />
      </Tooltip>
    );
  }

  renderThumbnail() {
    const { thumbnail } = this.props;

    if (!thumbnail) {
      return null;
    }

    // TODO: handle if there is an error loading the image -> show the placeholder
    return <Thumbnail src={thumbnail} />;
  }

  renderUser() {
    const { user } = this.props;

    if (!user) {
      return null;
    }

    return <Avatar size="medium" src={user.icon} name={user.name} />;
  }

  renderActions() {
    const { actions } = this.props;
    const { actionState } = this.state;

    if (actionState === 'pending') {
      return (
        <ActionsWrapper>
          <Spinner size="small" />
        </ActionsWrapper>
      );
    }

    if (actionState === 'failure') {
      return (
        <ActionsWrapper>
          <WarningIcon size="medium" label="" primaryColor={colors.Y300} />
        </ActionsWrapper>
      );
    }

    return (
      <ActionsWrapper>
        <ActionsView actions={actions} onAction={this.handleAction} />
      </ActionsWrapper>
    );
  }

  renderAlert() {
    const { actionState, actionMessage } = this.state;

    const visible =
      (actionState === 'success' || actionState === 'failure') &&
      Boolean(actionMessage);
    const alertType = actionState === 'success' ? 'success' : 'failure';

    return (
      <AlertWrapper>
        <Transition
          enter={['fade', 'slide-up']}
          exit={['fade', 'slide-down']}
          timeout={300}
        >
          {visible ? (
            <AlertView
              type={alertType}
              message={actionMessage}
              onRetry={this.handleActionRetry}
              onDismis={this.handleActionDismis}
            />
          ) : null}
        </Transition>
      </AlertWrapper>
    );
  }

  render() {
    const {
      title,
      byline,
      description,
      icon,
      user,
      thumbnail,
      users,
      details,
    } = this.props;
    return (
      <ContentWrapper>
        {this.renderAlert()}
        <BodyWrapper>
          <TopWrapper>
            {icon || user || thumbnail ? (
              <LeftWrapper>
                {this.renderIcon()}
                {!icon && this.renderUser()}
                {!icon && !user && this.renderThumbnail()}
              </LeftWrapper>
            ) : null}
            <RightWrapper>
              <Tooltip content={title ? title.tooltip : undefined}>
                <Title>{title ? title.text : undefined}</Title>
              </Tooltip>
              <Tooltip content={byline ? byline.tooltip : undefined}>
                <Byline>{byline ? byline.text : undefined}</Byline>
              </Tooltip>
              {description && (
                <Tooltip
                  content={description ? description.tooltip : undefined}
                >
                  <Description>
                    {description ? description.text : undefined}
                  </Description>
                </Tooltip>
              )}
              <Widgets details={details} />
              <UsersView users={users} />
              {this.renderActions()}
            </RightWrapper>
          </TopWrapper>
        </BodyWrapper>
      </ContentWrapper>
    );
  }
}
