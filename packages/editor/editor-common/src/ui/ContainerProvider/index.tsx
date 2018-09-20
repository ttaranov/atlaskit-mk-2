import * as React from 'react';

const { Provider, Consumer } = React.createContext<null | HTMLDivElement>(null);

export class ContainerProvider extends React.Component<any> {
  private ref: HTMLDivElement | null = null;

  constructor(props) {
    super(props);
  }

  getRef = ref => {
    this.ref = ref;
  };

  render() {
    return (
      <div ref={this.getRef}>
        <Provider value={this.ref}>{this.props.children}</Provider>
      </div>
    );
  }
}

export { Consumer as ContainerConsumer };
