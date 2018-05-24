import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { Identifier } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Content } from './content';
import { Blanket, ErrorMessage } from './styled';
import { Shortcut } from './shortcut';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  collectionName?: string;
  items?: Identifier[];
  context: Context;
};

export class MediaViewer extends React.Component<Props, {}> {
  render() {
    const { onClose } = this.props;
    return (
      <Blanket>
        {onClose && <Shortcut keyCode={27} handler={onClose} />}
        <Content onClose={onClose}>{this.renderContent()}</Content>
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
}
