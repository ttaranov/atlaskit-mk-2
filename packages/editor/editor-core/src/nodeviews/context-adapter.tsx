import * as React from 'react';
import * as PropTypes from 'prop-types';

// injects contexts via old context API to children
// and gives access to the original Provider so that
// the child can re-emit it
export const createContextAdapter = createContextAdapter => {
  return class extends React.Component<{}, { hasRendered: {} }> {
    static childContextTypes = {
      contextAdapter: PropTypes.object,
    };

    contextState = {};

    getChildContext() {
      return { contextAdapter: this.zipProvidersWithValues() };
    }

    zipProvidersWithValues() {
      return Object.keys(createContextAdapter).reduce((zipped, name) => {
        zipped[name] = {
          Provider: createContextAdapter[name].Provider,
          Consumer: createContextAdapter[name].Consumer,
          value: this.contextState[name],
        };

        return zipped;
      }, {});
    }

    render() {
      const { children } = this.props;

      // render all the consumers, and react to their value changes independently
      const consumers = Object.keys(createContextAdapter).map((name, idx) => {
        const Consumer = createContextAdapter[name].Consumer;
        return (
          <Consumer key={idx}>
            {value => {
              // update local copy of value provided from Consumer
              if (this.contextState[name] !== value) {
                this.contextState[name] = value;
                this.forceUpdate();
              }
            }}
          </Consumer>
        );
      });

      return (
        <>
          {consumers}
          {children}
        </>
      );
    }
  };
};
