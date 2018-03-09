import * as React from 'react';
import * as PropTypes from 'prop-types';
import { State } from './store';
import { ResourceProvider } from '../api/ConversationResource';

export type Dispatch = (action: any) => void;
export type MapStateToProps = (
  state: State,
  ownProps: any,
) => { [key: string]: any };
export type MapDispatchToProps = (dispatch: Dispatch) => { [key: string]: any };

export interface Props {
  mapStateToProps?: MapStateToProps;
  mapDispatchToProps?: MapDispatchToProps;
  provider: ResourceProvider;
  renderComponent: (props: any) => JSX.Element;
}

export class Connect extends React.Component<Props, any> {
  static contextTypes = {
    provider: PropTypes.object,
  };

  private ready: boolean = false;

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.ready = true;

    const { provider: { store } } = this.context;
    store.subscribe(this.onStateChange);

    // Get initial state
    this.onStateChange(store.getState());
  }

  componentWillUnmount() {
    this.ready = false;
    const { provider: { store } } = this.context;
    store.unsubscribe(this.onStateChange);
  }

  private onStateChange = state => {
    if (!this.ready) {
      return;
    }

    const {
      provider,
      renderComponent,
      mapStateToProps,
      mapDispatchToProps,
      ...ownProps
    } = this.props;

    let newState = {};

    if (mapStateToProps) {
      newState = {
        ...mapStateToProps(state, ownProps),
      };
    }

    if (mapDispatchToProps) {
      const dispatch: Dispatch = action => {
        action(provider);
      };

      newState = {
        ...newState,
        ...mapDispatchToProps(dispatch),
      };
    }

    this.setState(newState);
  };

  render() {
    const { props, state } = this;
    const { renderComponent } = props;

    return renderComponent(state);
  }
}

export const connect = (
  mapStateToProps?: MapStateToProps,
  mapDispatchToProps?: MapDispatchToProps,
) => (Component: any) => {
  const WithConnect = (ownProps: any) => (
    <Connect
      mapStateToProps={mapStateToProps}
      mapDispatchToProps={mapDispatchToProps}
      renderComponent={props => <Component {...props} {...ownProps} />}
      {...ownProps}
    />
  );
  return WithConnect;
};

export interface ProviderProps {
  provider: ResourceProvider;
  renderComponent: (props: any) => JSX.Element;
}

class Provider extends React.Component<ProviderProps, any> {
  static childContextTypes = {
    provider: PropTypes.object,
  };

  getChildContext() {
    return {
      provider: this.props.provider,
    };
  }

  render() {
    const { renderComponent, ...ownProps } = this.props;
    return renderComponent(ownProps);
  }
}

export const withProvider = (Component: any) => {
  const WithProvider = (ownProps: any) => (
    <Provider
      renderComponent={props => <Component {...props} />}
      {...ownProps}
    />
  );
  return WithProvider;
};
