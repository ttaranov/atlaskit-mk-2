import * as React from 'react';
import { PluginKey } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { EventDispatcher } from '../../event-dispatcher';

export interface State {
  [name: string]: any;
}

export interface Props {
  eventDispatcher?: EventDispatcher;
  editorView?: EditorView;
  plugins: { [name: string]: PluginKey };
  render: (pluginsState: State) => React.ReactElement<any>;
}

/**
 * Wraps component in a high order component that watches state changes of given plugins
 * and passes those states to the wrapped component.
 *
 * Example:
 * <WithPluginState
 *   eventDispatcher={eventDispatcher}
 *   editorView={editorView}
 *   plugins={{
 *     hyperlink: hyperlinkPluginKey
 *   }}
 *   render={renderComponent}
 * />
 *
 * renderComponent: ({ hyperlink }) => React.Component;
 */
export default class WithPluginState extends React.Component<State, any> {
  state = {};
  private listeners = {};
  private debounce: number | null = null;
  private notAppliedState = {};

  private handlePluginStateChange = (
    propName: string,
    skipEqualityCheck?: boolean,
  ) => (pluginState: any) => {
    // skipEqualityCheck is being used for old plugins since they are mutating plugin state instead of creating a new one
    if (this.state[propName] !== pluginState || skipEqualityCheck) {
      this.updateState({ [propName]: pluginState });
    }
  };

  /**
   * Debounces setState calls in order to reduce number of re-renders caused by several plugin state changes.
   */
  private updateState(stateSubset) {
    this.notAppliedState = { ...this.notAppliedState, ...stateSubset };

    if (this.debounce) {
      clearTimeout(this.debounce);
    }

    this.debounce = setTimeout(() => {
      this.setState(this.notAppliedState);
      this.debounce = null;
      this.notAppliedState = {};
    }, 10);
  }

  private subscribe(props: Props): void {
    const { eventDispatcher, editorView, plugins } = props;
    if (!eventDispatcher || !editorView) {
      return;
    }

    const pluginsState = Object.keys(plugins).reduce((acc, propName) => {
      const pluginKey = plugins[propName];
      if (!pluginKey) {
        return acc;
      }
      acc[propName] = pluginKey.getState(editorView.state);

      const isPluginWithSubscribe = acc[propName] && acc[propName].subscribe;
      const handler = this.handlePluginStateChange(
        propName,
        isPluginWithSubscribe,
      );

      if (isPluginWithSubscribe) {
        acc[propName].subscribe(handler);
      } else {
        eventDispatcher.on((pluginKey as any).key, handler);
      }

      this.listeners[(pluginKey as any).key] = { handler, pluginKey };

      return acc;
    }, {});

    this.setState(pluginsState);
  }

  componentWillMount() {
    this.subscribe(this.props as Props);
  }

  componentWillReceiveProps(nextProps: Props, prevProps: Props) {
    if (
      nextProps.eventDispatcher &&
      nextProps.eventDispatcher &&
      !prevProps.eventDispatcher
    ) {
      this.subscribe(nextProps);
    }
  }

  componentWillUnmount() {
    const { eventDispatcher } = this.props;
    if (!eventDispatcher) {
      return;
    }

    Object.keys(this.listeners).forEach(key => {
      const pluginState = this.listeners[key].pluginKey.getState(
        this.props.editorView.state,
      );
      if (pluginState && pluginState.unsubscribe) {
        pluginState.unsubscribe(this.listeners[key].handler);
      } else {
        eventDispatcher.off(key, this.listeners[key].handler);
      }
    });

    this.listeners = [];
  }

  render() {
    const { render } = this.props;
    return render(this.state);
  }
}
