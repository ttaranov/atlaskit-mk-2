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
 * renderComponent: ({ hyperlink }) => React.Compoment;
 */
export default class WithPluginState extends React.Component<State, any> {
  state = {};
  private listeners = {};

  private handlePluginStateChange(propName: string, pluginState: any): void {
    if (this.state[propName] !== pluginState) {
      this.setState({ [propName]: pluginState });
    }
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
      const handler = this.handlePluginStateChange.bind(this, propName);
      eventDispatcher.on((pluginKey as any).key, handler);

      this.listeners[(pluginKey as any).key] = handler;

      acc[propName] = pluginKey.getState(editorView.state);
      return acc;
    }, {});

    this.setState(pluginsState);
  }

  componentWillMount() {
    this.subscribe(this.props as Props);
  }

  componentWillReceiveProps(nextProps: Props, prevProps: Props) {
    if (nextProps.eventDispatcher && nextProps.eventDispatcher && !prevProps.eventDispatcher) {
      this.subscribe(nextProps);
    }
  }

  componentWillUnmount() {
    const { eventDispatcher } = this.props;
    if (!eventDispatcher) {
      return;
    }

    Object.keys(this.listeners).forEach(key => eventDispatcher.off(key, this.listeners[key]));
  }

  render() {
    const { render } = this.props;
    return render(this.state);
  }
}
