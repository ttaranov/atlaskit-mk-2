import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { ProviderFactory } from '@atlaskit/editor-common';
import Checkbox from '@atlaskit/checkbox';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
  providerFactory: ProviderFactory;
  getPos: () => number;
}

export default class CheckboxView extends React.PureComponent<Props, {}> {
  render() {
    const { node } = this.props;

    return (
      <span onClick={this.handleChange}>
        <Checkbox
          initiallyChecked={node.attrs.checked}
          value={node.attrs.checked}
        />
      </span>
    );
  }

  private handleChange = event => {
    // don't even ask
    if (event.target.tagName === 'INPUT') {
      return;
    }
    const { node, getPos, view } = this.props;
    const { dispatch, state } = view;
    const pos = getPos();
    dispatch(
      state.tr.setNodeMarkup(
        pos,
        node.type,
        {
          ...node.attrs,
          checked: !node.attrs.checked,
        },
        node.marks,
      ),
    );
  };
}
