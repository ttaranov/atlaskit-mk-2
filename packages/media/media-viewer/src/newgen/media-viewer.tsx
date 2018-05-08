import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { Identifier } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Blanket, Content } from './styled';
import { ErrorMessage } from './styled';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  collectionName?: string;
  items?: Identifier[];
  context: Context;
};

export class MediaViewer extends React.Component<Props, {}> {
  render() {
    return (
      <Blanket>
        <Content onClick={this.onClickContentClose}>
          {this.renderContent()}
        </Content>
      </Blanket>
    );
  }

  private renderContent() {
    const {
      items,
      collectionName,
      selectedItem,
      context,
      onClose,
    } = this.props;
    if (collectionName) {
      return (
        <Collection
          selectedItem={selectedItem}
          collectionName={collectionName}
          context={context}
          onClose={onClose}
        />
      );
    } else if (items) {
      return (
        <List
          selectedItem={selectedItem || items[0]}
          items={items}
          context={context}
          onClose={onClose}
        />
      );
    } else {
      return <ErrorMessage>No media found</ErrorMessage>;
    }
  }

  private onClickContentClose = e => {
    const { onClose } = this.props;
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };
}
