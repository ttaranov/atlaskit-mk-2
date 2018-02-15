import * as React from 'react';

export type CreateAppOptions<State, Action, Props> = {
  initialState: State;
  reducer: (prevState: State, action: Action) => State;
  render: (dispatch: (action: Action) => void, state: State, props: Props) => any;
};

export function createApp<State, Action, Props>({
  initialState,
  reducer,
  render,
}: CreateAppOptions<State, Action, Props>): React.ComponentClass<Props> {
  class C extends React.Component<Props, State> {
    constructor() {
      super();
      this.state = initialState;
    }

    dispatch(action: Action): void {
      this.setState(prevState => {
        const newState = reducer(prevState, action);
        console.log('-- action', action, 'new state', newState);
        return newState;
      });
    }

    render() {
      console.log('this.props', this.props)
      return render((action: Action) => this.dispatch(action), this.state, this.props);
    }
  }
  return C;
}