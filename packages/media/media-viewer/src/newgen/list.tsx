import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { ItemViewer } from './item-viewer';
import { Identifier } from './domain';
import { HeaderWrapper, ListWrapper } from './styled';
import { getSelectedIndex } from './util';
import { ErrorMessage } from './styled';
import Navigation from './navigation';
import Header from './header';

export type Props = {
  onClose?: () => void;
  onNavigationChange?: (selectedItem: Identifier) => void;
  showControlsCallback: () => void;
  selectedItem: Identifier;
  items: Identifier[];
  context: Context;
};

export type State = {
  selectedItem: Identifier;
};

export class List extends React.Component<Props, State> {
  state: State = { selectedItem: this.props.selectedItem };

  render() {
    const { items } = this.props;
    return this.renderContent(items);
  }

  renderContent(items: Identifier[]) {
    const { context, onClose } = this.props;
    const { selectedItem } = this.state;
    if (getSelectedIndex(items, selectedItem) < 0) {
      return (
        <ErrorMessage>
          The selected item with id '{selectedItem.id}' was not found on the
          list
        </ErrorMessage>
      );
    } else {
      return (
        <ListWrapper>
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
        </ListWrapper>
      );
    }
  }

  onNavigationChange = (selectedItem: Identifier) => {
    const { onNavigationChange, showControlsCallback } = this.props;
    if (onNavigationChange) {
      onNavigationChange(selectedItem);
    }

    showControlsCallback();
    this.setState({ selectedItem });
  };
}
