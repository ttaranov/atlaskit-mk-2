import * as React from 'react';
import { akColorY300 } from '@atlaskit/util-shared-styles';
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
}

function progress(): Pick<
  ApplicationCardState,
  'actionState' | 'actionMessage'
> {
  return {
    actionState: 'pending',
    actionMessage: undefined,
  };
}

function success(
  message?: string,
): Pick<ApplicationCardState, 'actionState' | 'actionMessage'> {
  return {
    actionState: 'success',
    actionMessage: message,
  };
}

function failure(
  message?: string,
): Pick<ApplicationCardState, 'actionState' | 'actionMessage'> {
  return {
    actionState: 'failure',
    actionMessage: message,
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
  state: ApplicationCardState = {};

  timeout?: number;

  get actionHandlerCallbacks() {
    return {
      progress: () => this.setState(progress()),
      success: (message: string) => {
        this.setState(success(message), () => {
          // hide the alert after 2s
          this.timeout = setTimeout(() => this.setState(dismiss()), 2000);
        });
      },
      failure: () => this.setState(failure('Something went wrong.')),
    };
  }

  handleAction = (action: Action) => {
    // store the action so we can try it again later if it fails
    this.setState({ action });

    // prevent the next alert from being cleared by any previous success alerts that haven't already been cleared
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // handle the action
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

  componentWillUnmount() {
    // prevent the alert from being cleared and unmounted
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  }

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
          <WarningIcon size="medium" label="" primaryColor={akColorY300} />
        </ActionsStateWrapper>
      );
    }

    return <ActionsView actions={actions} onAction={this.handleAction} />;
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
        {this.renderAlert()}
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
      </CardFrame>
    );
  }
}
