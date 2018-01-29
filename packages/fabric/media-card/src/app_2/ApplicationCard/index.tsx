import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Spinner from '@atlaskit/spinner';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ViewModel from '../shared/ViewModel';
import CardFrame from '../../shared/CardFrame';
import CardPreview from '../../shared/CardPreview';
import LinkIcon from '../../shared/LinkIcon';
import CardDetails from '../shared/CardDetails';
import AlertView from '../shared/AlertView';
import ActionsView, { Action } from '../shared/ActionsView';
import Transition from './Transition';
import { ActionsStateWrapper, AlertWrapper } from './styled';

export interface ApplicationCardProps extends ViewModel {}

export interface ApplicationCardState {
  action?: Action;
  actionState?: 'pending' | 'success' | 'failure';
  actionMessage?: string;

  // these fields are duplicated because the Alert state isn't persisted by CSSTransition as it is exiting
  // so it will shrinks in height and/or change type as it is exiting if we're using actionState/actionMessage
  alertType?: 'success' | 'failure';
  alertMessage?: string;
}

function success(
  message?: string,
): Pick<
  ApplicationCardState,
  'actionState' | 'actionMessage' | 'alertType' | 'alertMessage'
> {
  return {
    actionState: 'success',
    actionMessage: message,
    alertType: 'success',
    alertMessage: message,
  };
}

function failure(
  message?: string,
): Pick<
  ApplicationCardState,
  'actionState' | 'actionMessage' | 'alertType' | 'alertMessage'
> {
  return {
    actionState: 'failure',
    actionMessage: message,
    alertType: 'failure',
    alertMessage: message,
  };
}

function dismiss(): Pick<
  ApplicationCardState,
  'actionState' | 'actionMessage'
> {
  return {
    actionState: undefined,
    actionMessage: undefined,
  };
}

export default class ApplicationCard extends React.Component<
  ApplicationCardProps,
  ApplicationCardState
> {
  state: ApplicationCardState = {
    actionState: 'success',
    alertType: 'success',
    alertMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur accumsan egestas orci, pellentesque porttitor dolor vulputate tincidunt. Vivamus vulputate urna nec justo molestie, eu finibus ligula volutpat. Phasellus aliquet tortor eget auctor congue. Pellentesque bibendum quis nunc at fermentum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam hendrerit tortor ac mauris ultricies efficitur. Donec pellentesque elit justo, eget volutpat est convallis ac. Fusce et sollicitudin lacus, eget sollicitudin libero. Fusce blandit neque id mi semper, id fermentum lacus commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };

  timeout?: number;

  get actionHandlerCallbacks() {
    return {
      progress: () => {
        this.setState({
          actionState: 'pending',
          actionMessage: undefined,
        });
      },
      success: (message: string) => {
        this.setState(success(message), () => {
          // hide the alert after 2s
          this.timeout = setTimeout(() => this.setState(dismiss()), 2000);
        });
      },
      failure: () => {
        this.setState(failure('Something went wrong.'));
      },
    };
  }

  handleAction = (action: Action) => {
    // store the action so we can try again later
    this.setState({ action });

    // clear previous success alerts that haven't been cleared
    if (this.timeout) clearTimeout(this.timeout);
    action.handler(this.actionHandlerCallbacks);
  };

  handleTryAgain = () => {
    const { action } = this.state;
    if (action) {
      action.handler(this.actionHandlerCallbacks);
    }
  };

  handleCancel = () => {
    this.setState(dismiss());
  };

  renderActions() {
    const { actions } = this.props;
    const { actionState } = this.state;

    if (actionState === 'pending') {
      return (
        <ActionsStateWrapper>
          <Spinner size="small" />
        </ActionsStateWrapper>
      );
    }

    if (actionState === 'failure') {
      return (
        <ActionsStateWrapper>
          <WarningIcon size="medium" label="" primaryColor={colors.Y300} />
        </ActionsStateWrapper>
      );
    }

    return <ActionsView actions={actions} onAction={this.handleAction} />;
  }

  renderAlert() {
    const { actionState, alertType, alertMessage } = this.state;

    const visible =
      (actionState === 'success' || actionState === 'failure') &&
      alertType !== undefined &&
      alertMessage !== undefined;

    return (
      <AlertWrapper>
        <Transition
          enter={['fade', 'slide-up']}
          exit={['fade', 'slide-down']}
          timeout={600}
        >
          {visible ? (
            <AlertView
              type={alertType || 'failure'}
              message={alertMessage}
              onTryAgain={this.handleTryAgain}
              onCancel={this.handleCancel}
            />
          ) : null}
        </Transition>
      </AlertWrapper>
    );
  }

  render() {
    const {
      onClick,
      link,
      context,
      title,
      description,
      icon,
      preview,
      user,
      users,
      details,
    } = this.props;
    return (
      <CardFrame
        minWidth={240}
        maxWidth={Boolean(preview) ? 400 : 664}
        href={link}
        icon={<LinkIcon src={context && context.icon} />}
        text={context && context.text}
        onClick={onClick}
      >
        {preview ? <CardPreview url={preview} /> : null}
        <CardDetails
          title={title}
          description={description}
          icon={icon}
          user={user}
          users={users}
          details={details}
          actions={this.renderActions()}
        />
        {this.renderAlert()}
      </CardFrame>
    );
  }
}
