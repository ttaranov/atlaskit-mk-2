import * as React from 'react';

export type CreateAppOptions<State, Action> = {
  initState: State;
  reducer: (prevState: State, action: Action) => State;
  render: (dispatch: (action: Action) => void, state: State) => any;
};

export function createApp<State, Action>({
  initState,
  reducer,
  render,
}: CreateAppOptions<State, Action>): React.ComponentClass {
  class C extends React.Component<{}, State> {
    constructor() {
      super();
      this.state = initState;
    }

    dispatch(action: Action): void {
      this.setState(prevState => {
        const newState = reducer(prevState, action);
        console.log('-- action', action, 'new state', newState);
        return newState;
      });
    }

    render() {
      return render((action: Action) => this.dispatch(action), this.state);
    }
  }
  return C;
}
