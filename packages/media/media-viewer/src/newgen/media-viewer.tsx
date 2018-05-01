import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { ItemViewer } from './item-viewer';
import { Identifier } from './domain';
import { Blanket, Content } from './styled';
import Navigation from './navigation';
import { getSelectedIndex } from './util';
import { ErrorMessage } from './styled';

export type Props = {
  onClose?: () => void;
  selectedItem: Identifier;
  items: Identifier[];
  context: Context;
};

export type State = {
  selectedItem: Identifier;
};

export class MediaViewer extends React.Component<Props, State> {
  state: State = { selectedItem: this.props.selectedItem };

  render() {
    const { onClose } = this.props;
    return <Blanket onClick={onClose}>{this.getContent()}</Blanket>;
  }

  getContent() {
    const { context, items } = this.props;
    const { selectedItem } = this.state;

    if (getSelectedIndex(items, selectedItem) < 0) {
      return (
        <Content>
          <ErrorMessage>
            The selected item with id '{selectedItem.id}' was not found on the
            list
          </ErrorMessage>;
        </Content>
      );
    } else {
      return (
        <Content>
          <ItemViewer context={context} identifier={selectedItem} />
          <Navigation
            items={items}
            selectedItem={selectedItem}
            onChange={this.onNavigationChange}
          />
        </Content>
      );
    }
  }

  onNavigationChange = (selectedItem: Identifier) => {
    this.setState({ selectedItem });
  };
}
