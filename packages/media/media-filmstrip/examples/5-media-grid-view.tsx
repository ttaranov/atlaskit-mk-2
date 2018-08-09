import * as React from 'react';
import { Component, ChangeEvent } from 'react';
import { MediaGridView, GridItem } from '../src/mediaGrid/mediaGridView';
import { FieldRangeWrapper, GridContainer } from '../example-helpers/styled';
import { gridItems } from '../example-helpers/media-grid-items';

interface ExampleState {
  width: number;
  items: GridItem[];
  isInteractive: boolean;
  showDebugView: boolean;
}

class Example extends Component<{}, ExampleState> {
  state: ExampleState = {
    width: 744,
    items: gridItems,
    isInteractive: true,
    showDebugView: true,
  };

  onWidthChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    const width = Number.parseInt(target.value);

    this.setState({ width });
  };

  addImage = () => {
    const { items } = this.state;
    const index = Math.floor(Math.random() * gridItems.length);
    const newItem = gridItems[index];

    this.setState({
      items: [newItem, ...items],
    });
  };

  onItemsChange = items => {
    this.setState({ items });
  };

  toggleInteractivity = () => {
    this.setState({
      isInteractive: !this.state.isInteractive,
    });
  };

  toggleDebugView = () => {
    this.setState({
      showDebugView: !this.state.showDebugView,
    });
  };

  render() {
    const { width, items, isInteractive, showDebugView } = this.state;

    return (
      <GridContainer style={{ width: width + 20 }}>
        <FieldRangeWrapper>
          <input
            type="range"
            value={width}
            max={window.innerWidth}
            onChange={this.onWidthChange}
          />
          <button onClick={this.addImage}>Add image</button>
          <button onClick={this.toggleInteractivity}>
            Toggle isInteractive
          </button>
          <button onClick={this.toggleDebugView}>Toggle Debug View</button>
        </FieldRangeWrapper>
        <MediaGridView
          items={items}
          onItemsChange={this.onItemsChange}
          width={width}
          isInteractive={isInteractive}
          showDebug={showDebugView}
        />
      </GridContainer>
    );
  }
}

export default () => <Example />;
