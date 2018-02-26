import * as React from 'react';

// TODO Factor out dispatch fn here
export type CreateAppOptions<Model, Message, Props> = {
  initialModel: (props: Props) => Model;
  initialMessage?: (props: Props) => Message;
  update: (model: Model, message: Message) => Model;
  effects?: (message: Message) => Promise<Message> | null;
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
      this.state = initialModel(this.props);
    }

    componentDidMount() {
      if (initialMessage) {
        this.dispatch(initialMessage(this.props));
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
          if (effects) {
            const nextMessage = effects(message);
            if (nextMessage) {
              nextMessage.then(
                message => {
                  this.dispatch(message);
                },
                err => {
                  console.error(err);
                }, // TODO: crash hard
              );
            }
          }
        },
      );
    }

    componentDidUpdate(prevProps: Props) {
      // if any of the props change, we fully restart MV
      this.state = initialModel(this.props);
      if (initialMessage) {
        // TODO: we can only call dispatch if props changed (not state)
        // this.dispatch(initialMessage(this.props));
      }
    }

    render() {
      const dispatch = (message: Message) => this.dispatch(message);
      return <Component model={this.state} dispatch={dispatch} />;
    }
  }
  return App;
}
