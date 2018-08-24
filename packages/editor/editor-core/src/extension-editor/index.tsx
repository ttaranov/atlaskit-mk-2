import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NativeListener from 'react-native-listener';
import { Poll } from './poll';
import { Rsvp } from './rsvp';
import { Tabs } from './tabs';
import { Wrapper } from './styles';

export interface Props {
  showSidebar: boolean;
  node: Object;
}

export interface State {
  showSidebar: boolean;
  node: Object;
  params: Object;
  nodePos: number;
}

export class ExtensionEditor extends React.Component<Props, State> {
  preventDefault = e => {
    if (!(e.target.classList.contains('react') || e.target.closest('.react'))) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  renderExtensions() {
    const { node } = this.props;
    if (!node) {
      return null;
    }

    switch (node.node.attrs.extensionKey) {
      case 'poll': {
        return <Poll {...this.props} />;
      }
      case 'rsvp': {
        return <Rsvp {...this.props} />;
      }
      case 'tabs': {
        return <Tabs {...this.props} />;
      }
      default:
        return null;
    }
  }

  render() {
    const { node, showSidebar } = this.props;

    return ReactDOM.createPortal(
      <Wrapper
        style={{ width: node && node.node && showSidebar ? '320px' : '0' }}
      >
        <NativeListener onClick={this.preventDefault.bind(this)}>
          {this.renderExtensions()}
        </NativeListener>
      </Wrapper>,
      document.body,
    );
  }
}
