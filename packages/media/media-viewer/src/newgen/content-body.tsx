import * as React from 'react';
import { Collection } from './collection';
import { List } from './list';
import { Identifier, ItemSource, MediaViewerFeatureFlags } from './domain';
import { Context } from '@atlaskit/media-core/src/context/context';

export type Props = {
  onClose?: () => void;
  selectedItem?: Identifier;
  featureFlags?: MediaViewerFeatureFlags;
  context: Context;
  itemSource: ItemSource;
};

export default class ContentBody extends React.Component<Props> {
  render() {
    const {
      selectedItem,
      context,
      onClose,
      itemSource,
      featureFlags,
    } = this.props;
    if (itemSource.kind === 'COLLECTION') {
      return (
        <Collection
          pageSize={itemSource.pageSize}
          defaultSelectedItem={selectedItem}
          collectionName={itemSource.collectionName}
          context={context}
          onClose={onClose}
          featureFlags={featureFlags}
        />
      );
    } else if (itemSource.kind === 'ARRAY') {
      return (
        <List
          defaultSelectedItem={selectedItem || itemSource.items[0]}
          items={itemSource.items}
          context={context}
          onClose={onClose}
          featureFlags={featureFlags}
        />
      );
    } else {
      return null as never;
    }
  }
}
