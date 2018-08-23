import * as React from 'react';
import { ExtensionEditorContainer } from './styles';
import FieldText from '@atlaskit/field-text';
import { FormWrapper } from './styles';
import * as ReactDOM from 'react-dom';
import NativeListener from 'react-native-listener';
import { setNodeSelection } from '../utils';
import { resolveMacro } from '../plugins/macro/actions';
import { replaceSelectedNode } from 'prosemirror-utils';
import Button from '@atlaskit/button';
import { Poll } from './poll';
import { Rsvp } from './rsvp';
import { Tabs } from './tabs';
//

import Form, {
  Field,
  FormHeader,
  FormSection,
  FormFooter,
} from '@atlaskit/form';

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
    const { showSidebar, node } = this.props;
    if (!showSidebar || !node) {
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
    const { showSidebar, node } = this.props;
    if (!showSidebar || !node) {
      return null;
    }

    return ReactDOM.createPortal(
      <NativeListener onClick={this.preventDefault.bind(this)}>
        {this.renderExtensions()}
      </NativeListener>,
      document.body,
    );
  }
}
