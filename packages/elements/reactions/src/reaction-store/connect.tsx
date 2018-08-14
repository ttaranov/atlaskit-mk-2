import * as React from 'react';
import { State } from './ReactionProvider';
import { Actions, ReactionsContext } from './ReactionsContext';

export type StateMapper<OwnProps, PropsFromState> = (
  state: State,
  props: Readonly<OwnProps>,
) => PropsFromState;

export type ActionMapper<ActionProps, OwnProps> = (
  actions: Actions,
  props: Readonly<OwnProps>,
) => ActionProps;

const initActionCreators = <ActionProps, OwnProps>(
  actionMapper: ActionMapper<ActionProps, OwnProps>,
): ActionMapper<ActionProps, OwnProps> => {
  const dependOnOwnProps = actionMapper.length === 1;
  let actions: Actions;
  let ownProps: OwnProps;
  let actionProps: ActionProps;
  let firstRun = true;
  return (nextActions: Actions, nextOwnProps: OwnProps) => {
    if (
      firstRun ||
      actions !== nextActions ||
      (dependOnOwnProps && ownProps !== nextOwnProps)
    ) {
      firstRun = false;
      actions = nextActions;
      ownProps = nextOwnProps;
      actionProps = actionMapper(nextActions, nextOwnProps);
    }

    return actionProps;
  };
};

export const connectWithReactionsProvider = <
  OwnProps,
  PropsFromState,
  ActionProps,
  ExternalProps
>(
  stateMapper: StateMapper<OwnProps & ExternalProps, PropsFromState>,
  actionsMapper?: ActionMapper<ActionProps, OwnProps & ExternalProps>,
) => (
  Component: React.ComponentType<OwnProps & PropsFromState & ActionProps>,
): React.ComponentType<OwnProps & ExternalProps> => {
  return class Wrapped extends React.Component<OwnProps & ExternalProps> {
    private wrappedActionCreators = actionsMapper
      ? initActionCreators(actionsMapper)
      : undefined;

    renderChild = ({ actions, value }) => (
      <Component
        {...(this.wrappedActionCreators && actions
          ? this.wrappedActionCreators(actions, this.props)
          : {})}
        {...stateMapper(value, this.props)}
        {...this.props}
      />
    );

    render() {
      return (
        <ReactionsContext.Consumer>
          {this.renderChild}
        </ReactionsContext.Consumer>
      );
    }
  };
};
