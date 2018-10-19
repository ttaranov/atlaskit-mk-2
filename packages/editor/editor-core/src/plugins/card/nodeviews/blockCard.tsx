import * as React from 'react';
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

class BlockCardNode extends React.PureComponent<Props, {}> {
  onClick = () => {};

  render() {
    const { node, selected } = this.props;
    const { url, data } = node.attrs;

    // render an empty span afterwards to get around Webkit bug
    // that puts caret in next editable text element
    return (
      <div>
        <Card
          url={url}
          data={data}
          appearance="block"
          isSelected={selected}
          onClick={this.onClick}
        />
        <span contentEditable={true} />
      </div>
    );
  }
}

const ClickableBlockCard = wrapComponentWithClickArea(BlockCardNode);
export default class WrappedInline extends React.PureComponent<Props, {}> {
  render() {
    return (
      <ClickableBlockCard
        {...this.props}
        pluginState={ReactNodeViewState.getState(this.props.view.state)}
      />
    );
  }
}
