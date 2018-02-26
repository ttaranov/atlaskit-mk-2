import * as React from 'react';

export type CreateAppOptions<State, Action, Props> = {
  update: (prevState: State, action: Action) => State;
  render: (dispatch: (action: Action) => void, state: State) => any;
  initialState: State;
  initialAction?: (props: Props) => Action;
  effects?: (action: Action) => Promise<Action> | null;
};

export function createApp<State, Action, Props>({
  initialState,
  update,
  render,
  initialAction,
  effects,
}: CreateAppOptions<State, Action, Props>): React.ComponentClass<Props> {
  class C extends React.Component<Props, State> {
    constructor() {
      super();
      this.state = initialState;
    }

    componentDidMount() {
      if (initialAction) {
        this.dispatch(initialAction(this.props));
      }
    }

    dispatch(action: Action): void {
      this.setState(
        prevState => {
          const newState = update(prevState, action);
          console.log('-- action', action, 'new state', newState);
          return newState;
        },
        () => {
          if (effects) {
            const maybeAction = effects(action);
            if (maybeAction) {
              maybeAction.then(action => {
                this.dispatch(action);
              }); // TODO handle errors
            }
          }
        },
      );
    }

    componentDidUpdate(prevProps: Props) {
      // if any of the props change, we fully restart MV
      this.state = initialState;
      if (initialAction) {
        // TODO: we can only call dispatch if props changed (not state)
        // this.dispatch(initialAction(this.props));
      }
    }

    render() {
      return render((action: Action) => this.dispatch(action), this.state);
    }
  }
  return C;
}
