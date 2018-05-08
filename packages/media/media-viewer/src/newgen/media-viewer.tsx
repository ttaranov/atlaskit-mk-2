import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { ItemViewer } from './item-viewer';
import { Identifier } from './domain';
import { Blanket, Content, HeaderWrapper } from './styled';
import { getSelectedIndex } from './util';
import { ErrorMessage } from './styled';
import Navigation from './navigation';
import Header from './header';

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
    return <Blanket>{this.getContent()}</Blanket>;
  }

  getContent() {
    const { context, items, onClose } = this.props;
    const { selectedItem } = this.state;

    if (getSelectedIndex(items, selectedItem) < 0) {
      return (
        <Content onClick={this.onClickContentClose}>
          <ErrorMessage>
            The selected item with id '{selectedItem.id}' was not found on the
            list
          </ErrorMessage>;
        </Content>
      );
    } else {
      return (
        <Content onClick={this.onClickContentClose}>
          <HeaderWrapper>
            <Header
              context={context}
              identifier={selectedItem}
              onClose={onClose}
            />
          </HeaderWrapper>
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

  private onClickContentClose = e => {
    const { onClose } = this.props;
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };
}
