import * as React from 'react';
import { Providers, ProviderState } from './types';

export type Props = { [P in keyof Providers]?: Providers[P] };

export type State = {
  readonly [P in keyof Providers]: ProviderState<Providers[P]>
};

const {
  Provider: ContextProvider,
  Consumer: ContextConsumer,
} = React.createContext({} as State);

function isPromise<V>(value: V | PromiseLike<V>): value is PromiseLike<V> {
  return !!(value as any).then;
}

export default class ProviderContext extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);
    this.state = {} as State;
  }

  static getProvidersFromProps(props: Props): Props {
    const providers = { ...props };
    delete providers['children'];
    return providers;
  }

  componentWillMount() {
    const providers = ProviderContext.getProvidersFromProps(this.props);
    (Object.keys(providers) as [keyof Props]).forEach(key => {
      const value = providers[key];
      if (value) {
        this.updateProvider(providers, key, providers[key]);
      }
    });
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props !== nextProps) {
      const oldProviders = ProviderContext.getProvidersFromProps(this.props);
      const newProviders = ProviderContext.getProvidersFromProps(nextProps);

      // Remove providers that have been removed from the props
      (Object.keys(oldProviders) as [keyof Props])
        .filter(
          oldProviderKey =>
            oldProviders[oldProviderKey] && !newProviders[oldProviderKey],
        )
        .forEach(missingProviderKey =>
          this.updateProvider(newProviders, missingProviderKey, undefined),
        );

      // Update providers that have changed or been added
      (Object.keys(newProviders) as [keyof Props])
        .filter(
          newProviderKey =>
            this.props[newProviderKey] !== newProviders[newProviderKey],
        )
        .forEach(newProviderKey =>
          this.updateProvider(
            newProviders,
            newProviderKey,
            newProviders[newProviderKey],
          ),
        );
    }
  }

  updateProvider<K extends keyof Providers, V = Props[K]>(
    prevProviders: Props,
    providerKey: K,
    providerValue: V | Promise<V>,
  ) {
    if (isPromise(providerValue)) {
      this._updateProvider(
        prevProviders,
        providerKey,
        { status: 'PENDING', value: providerValue },
        () => {
          providerValue.then(
            provider =>
              this._updateProvider(prevProviders, providerKey, {
                status: 'READY',
                value: provider,
              }),
            error =>
              this._updateProvider(prevProviders, providerKey, {
                status: 'ERROR',
                value: error,
              }),
          );
        },
      );
    } else if (!!providerValue) {
      this._updateProvider(prevProviders, providerKey, {
        status: 'READY',
        value: providerValue,
      });
    } else {
      this._updateProvider(prevProviders, providerKey, { status: 'EMPTY' });
    }
  }

  _updateProvider<K extends keyof Providers, V = Providers[K]>(
    prevProviders: Props,
    providerKey: K,
    providerValue: ProviderState<V>,
    callback?: () => void,
  ) {
    this.setState((prevState, props) => {
      // Ignore if the props / provider value has changed by the time the state update is triggered
      if (props[providerKey] !== prevProviders[providerKey]) {
        return {};
      }

      // Ignore if the new value has not changed
      if (
        prevState[providerKey] &&
        prevState[providerKey]!.value === providerValue
      ) {
        return {};
      }

      return { [providerKey]: providerValue };
    }, callback);
  }

  render() {
    const state = this.state;
    return (
      <ContextProvider value={state}>{this.props.children}</ContextProvider>
    );
  }
}

export class WithProviders extends React.PureComponent<{
  providers: [keyof Providers];
  renderNode: (
    providers: { [K in keyof Providers]: ProviderState<Providers[K]> },
  ) => JSX.Element;
}> {
  render() {
    return (
      <ContextConsumer>
        {providers => this.props.renderNode(providers)}
      </ContextConsumer>
    );
  }
}
