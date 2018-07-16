// @flow

import React, { Component, type ComponentType } from 'react';
import { channel } from 'emotion-theming';
import PropTypes from 'prop-types';

import type { GlobalTheme, ProductTheme } from './types';

type State = { theme: GlobalTheme | ProductTheme | void };

// export default (defaultTheme: ProductTheme) => (
export default (defaultTheme: any) => (WrappedComponent: ComponentType<*>) => {
  return class WithTheme extends Component<{}, State> {
    static contextTypes = {
      [channel]: PropTypes.object,
    };

    static displayName = `WithTheme(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    state = {
      theme: undefined,
    };

    unsubscribeId: number;

    subscribeToContext() {
      if (this.unsubscribeId && this.unsubscribeId !== -1) {
        return;
      }

      const themeContext = this.context[channel];

      if (themeContext !== undefined) {
        this.unsubscribeId = themeContext.subscribe(theme => {
          this.setState({ theme });
        });
      }
    }

    componentWillMount() {
      this.subscribeToContext();
    }

    componentDidUpdate() {
      this.subscribeToContext();
    }

    componentWillUnmount() {
      if (this.unsubscribeId && this.unsubscribeId !== -1) {
        this.context[channel].unsubscribe(this.unsubscribeId);
      }
    }

    render() {
      const theme = this.state.theme || defaultTheme;
      return <WrappedComponent theme={theme} {...this.props} />;
    }
  };
};
