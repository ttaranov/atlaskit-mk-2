import * as React from 'react';

export type CreateAppOptions<Model, Message, Props> = {
  update: (model: Model, message: Message) => Model;
  render: (dispatch: (message: Message) => void, model: Model) => any;
  initialModel: Model;
  initialMessage?: (props: Props) => Message;
  effects?: (message: Message) => Promise<Message> | null;
};

export function createApp<Model, Message, Props>({
  initialModel,
  update,
  render,
  initialMessage,
  effects,
}: CreateAppOptions<Model, Message, Props>): React.ComponentClass<Props> {
  class C extends React.Component<Props, Model> {
    constructor() {
      super();
      this.state = initialModel;
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
      this.state = initialModel;
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
