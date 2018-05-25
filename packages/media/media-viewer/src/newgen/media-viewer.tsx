import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { Identifier, ItemSource } from './domain';
import { List } from './list';
import { Collection } from './collection';
import { Content } from './content';
import { Blanket } from './styled';
import { Shortcut } from './shortcut';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  context: Context;
  itemSource: ItemSource;
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
    const { selectedItem, context, onClose, itemSource } = this.props;
    if (itemSource.kind === 'COLLECTION') {
      return (
        <Collection
          pageSize={itemSource.pageSize}
          selectedItem={selectedItem}
          collectionName={itemSource.collectionName}
          context={context}
          onClose={onClose}
        />
      );
    } else if (itemSource.kind === 'ARRAY') {
      return (
        <List
          selectedItem={selectedItem || itemSource.items[0]}
          items={itemSource.items}
          context={context}
          onClose={onClose}
        />
      );
    }
  }
}
