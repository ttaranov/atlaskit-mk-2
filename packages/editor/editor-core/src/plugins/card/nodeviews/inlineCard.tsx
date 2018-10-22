import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';
import { Card } from '@atlaskit/smart-card';

import { EditorView } from 'prosemirror-view';
import wrapComponentWithClickArea from '../../../nodeviews/legacy-nodeview-factory/ui/wrapper-click-area';
import { stateKey as ReactNodeViewState } from '../../../plugins/base/pm-plugins/react-nodeview';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
  getPos: () => number;
  view: EditorView;
  selected?: boolean;
}

class InlineCardNode extends React.PureComponent<Props, {}> {
  onClick = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  render() {
    const { node, selected } = this.props;
    const { url, data } = node.attrs;

    const cardContext = this.context.contextAdapter
      ? this.context.contextAdapter.card
      : undefined;

    const card = (
      <Card
        url={url}
        data={data}
        appearance="inline"
        isSelected={selected}
        onClick={this.onClick}
      />
    );

    return cardContext ? (
      <cardContext.Provider value={cardContext.value}>
        {card}
      </cardContext.Provider>
    ) : (
      card
    );
  }
}

export default class WrappedInline extends React.PureComponent<Props, {}> {
  render() {
    const WrappedComponent = wrapComponentWithClickArea(InlineCardNode, true);
    return (
      <WrappedComponent
        {...this.props}
        pluginState={ReactNodeViewState.getState(this.props.view.state)}
      />
    );
  }
}
