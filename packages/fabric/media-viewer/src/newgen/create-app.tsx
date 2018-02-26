import * as React from 'react';

// TODO Factor out dispatch fn here
export type CreateAppOptions<Model, Message, Props> = {
  initialModel: Model;
  initialMessage?: Message;
  update: (model: Model, message: Message) => Model;
  effects: (
    message: Message,
    cfg: Props,
    dispatch: (message: Message) => void,
  ) => void;
  Component: React.StatelessComponent<{
    model: Model;
    dispatch: (message: Message) => void;
  }>;
};

export function createApp<Model, Message, Props>({
  initialModel,
  initialMessage,
  update,
  effects,
  Component,
}: CreateAppOptions<Model, Message, Props>): React.ComponentClass<Props> {
  class App extends React.Component<Props, Model> {
    constructor() {
      super();
      this.state = initialModel;
    }

    componentDidMount() {
      if (initialMessage) {
        this.dispatch(initialMessage);
      }
    }

    dispatch(message: Message): void {
      this.setState(
        model => {
          const newModel = update(model, message);
          console.log('-- message', message, 'new model', newModel);
          return newModel;
        },
        () => {
          effects(message, this.props, message => this.dispatch(message));
        },
      );
    }

    componentDidUpdate(prevProps: Props, prevState: Model) {
      // we can only call dispatch if props changed (not state)
      // otherwise we end in an infinite loop
      // if any of the props change, we fully restart MV
      if (prevState === this.state) {
        this.state = initialModel;
        if (initialMessage) {
          this.dispatch(initialMessage);
        }
      }
    }

    render() {
      const dispatch = (message: Message) => this.dispatch(message);
      return <Component model={this.state} dispatch={dispatch} />;
    }
  }
  return App;
}
