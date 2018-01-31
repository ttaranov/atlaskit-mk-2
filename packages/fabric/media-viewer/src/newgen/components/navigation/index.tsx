import * as React from 'react';
import { Component } from 'react';
import { Card, Filmstrip } from './styled';
import { MediaViewerItem } from '../../domain';

export interface NavigationProps {
  items: MediaViewerItem[];
  selectedItem: MediaViewerItem;
  onNavigate: (selected: MediaViewerItem, index: number, total: number) => void
}

export interface NavigationState {

}

export class Navigation extends Component<NavigationProps, NavigationState> {
  
  render() {
    return this.renderFilmstrip();
  }

  onArrowClick(direction: number) {
    const {onNavigate, selectedItem, items} = this.props;    
    const currentItem = items.find(i => i.identifier.id === selectedItem.identifier.id);
    const nextItemIndex = items.indexOf(currentItem);
    const nextItem = items[nextItemIndex + direction];    
    if (onNavigate && nextItem) {
      onNavigate(nextItem, nextItemIndex, items.length);
    }
  }  

  cardClick(item: MediaViewerItem) {
    const {onNavigate, items} = this.props;
    if (onNavigate) {
      const itemIndex = items.indexOf(item);
      onNavigate(item, itemIndex, items.length);
    }
  }

  private renderFilmstrip() {
    return (
      <Filmstrip>
        {this.renderArrowLeft()}
        {this.props.items.map((item: MediaViewerItem) => this.renderCard(item))}
        {this.renderArrowRight()}
      </Filmstrip>
    )
  }

  private isSelectedItem(item: MediaViewerItem) {
    const {selectedItem} = this.props;
    return item.identifier.id === selectedItem.identifier.id;
  }

  private renderCard(item: MediaViewerItem) {
    return (
      <Card selected={this.isSelectedItem(item)} onClick={() => this.cardClick(item)}>
        {item.identifier.id}
      </Card>
    );
  }

  private renderArrowLeft() {
    return (
      <button onClick={(ev) => this.onArrowClick(-1)}>Left arrow</button>
    );
  }
  private renderArrowRight() {
    return (
      <button onClick={(ev) => this.onArrowClick(1)}>Right arrow</button>
    );
  }
}