import * as React from 'react';
import * as PropTypes from 'prop-types';

export class ContainerProvider extends React.Component<
  any,
  { ref: HTMLDivElement | null }
> {
  state = {
    ref: null,
  };

  static childContextTypes = {
    containerRef: PropTypes.object,
  };

  getChildContext() {
    return { containerRef: this.state.ref };
  }

  constructor(props, context) {
    super(props, context);
  }

  getRef = ref => {
    if (this.state.ref !== ref) {
      this.setState({ ref });
    }
  };

  render() {
    return <div ref={this.getRef}>{this.props.children}</div>;
  }
}
