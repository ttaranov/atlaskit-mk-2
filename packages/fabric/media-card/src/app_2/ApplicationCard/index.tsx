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
import Transition from '../shared/Transition';
import { ActionsStateWrapper, AlertWrapper } from './styled';

export interface ApplicationCardProps extends ViewModel {}

export interface ApplicationCardState {
  width?: number;
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
    width: undefined,
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
          this.timeout = setTimeout(
            () =>
              this.setState({
                alertType: undefined,
                alertMessage: undefined,
              }),
            2000,
          );
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
    const { alertType, alertMessage } = this.state;

    const visible = Boolean(alertType) && Boolean(alertMessage);

    return (
      <AlertWrapper>
        <Transition
          visible={visible}
          enter={['fade', 'slide-up']}
          exit={['fade', 'slide-down']}
          timeout={600}
        >
          <AlertView
            type={alertType || 'failure'}
            message={alertMessage}
            onTryAgain={this.handleTryAgain}
            onCancel={this.handleCancel}
          />
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
