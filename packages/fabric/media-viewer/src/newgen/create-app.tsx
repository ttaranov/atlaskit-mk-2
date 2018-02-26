import * as React from 'react';

export type CreateAppOptions<State, Message, Props> = {
  update: (prevState: State, message: Message) => State;
  render: (dispatch: (message: Message) => void, state: State) => any;
  initialState: State;
  initialMessage?: (props: Props) => Message;
  effects?: (message: Message) => Promise<Message> | null;
};

export function createApp<State, Message, Props>({
  initialState,
  update,
  render,
  initialMessage,
  effects,
}: CreateAppOptions<State, Message, Props>): React.ComponentClass<Props> {
  class C extends React.Component<Props, State> {
    constructor() {
      super();
      this.state = initialState;
    }

    componentDidMount() {
      if (initialMessage) {
        this.dispatch(initialMessage(this.props));
      }
    }

    dispatch(message: Message): void {
      this.setState(
        prevState => {
          const newState = update(prevState, message);
          console.log('-- message', message, 'new state', newState);
          return newState;
        },
        () => {
          if (effects) {
            const nextMessage = effects(message);
            if (nextMessage) {
              nextMessage.then(message => {
                this.dispatch(message);
              }); // TODO handle errors
            }
          }
        },
      );
    }

    componentDidUpdate(prevProps: Props) {
      // if any of the props change, we fully restart MV
      this.state = initialState;
      if (initialMessage) {
        // TODO: we can only call dispatch if props changed (not state)
        // this.dispatch(initialMessage(this.props));
      }
    }

    render() {
      return render((message: Message) => this.dispatch(message), this.state);
    }
  }
  return C;
}
