import * as React from 'react';
import { Actions, Context } from './Context';
import { State } from './ReactionContext';

export type Props<PropsFromState extends {}, PropsFromActions extends {}> = {
  stateMapper?: (state: State) => PropsFromState;
  actionsMapper?: (actions: Actions) => PropsFromActions;
  children: (props: PropsFromState & PropsFromActions) => React.ReactNode;
};

export class ReactionConsumer<
  PropsFromState extends {},
  PropsFromActions extends {}
> extends React.PureComponent<Props<PropsFromState, PropsFromActions>> {
  private previousActions: Actions | undefined;
  private propsFromActions: PropsFromActions | undefined;

  private getPropsFromActions = (actions: Actions) => {
    const { actionsMapper } = this.props;
    if (actionsMapper) {
      if (
        !this.previousActions ||
        !this.propsFromActions ||
        this.previousActions !== actions
      ) {
        this.propsFromActions = actionsMapper(actions);
      }
    }
    this.previousActions = actions;
    return this.propsFromActions;
  };

  private getPropsFromState = (state: State) => {
    const { stateMapper } = this.props;
    if (stateMapper) {
      return stateMapper(state);
    }
    return undefined;
  };

  private renderChildren = context => {
    if (context) {
      const { actions, value } = context;
      const props = Object.assign(
        {},
        this.getPropsFromState(value),
        this.getPropsFromActions(actions),
      );
      return this.props.children(props);
    }
    throw new Error(
      'ReactionContext is required. See https://atlaskit.atlassian.com/packages/elements/reactions.',
    );
  };

  render() {
    return <Context.Consumer>{this.renderChildren}</Context.Consumer>;
  }
}
