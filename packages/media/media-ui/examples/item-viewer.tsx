import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ItemViewer, Vector2 } from '../src/camera';
import {
  ItemViewerContainer,
  ItemViewerItem,
  ItemViewerMargin,
  Slider,
} from '../example-helpers/styled';

const DEFAULT = {
  CONTAINER_WIDTH: 200,
  CONTAINER_HEIGHT: 200,
  ITEM_WIDTH: 350,
  ITEM_HEIGHT: 450,
  ZOOM: 0,
  MARGIN: 28,
};

export interface ExampleState {
  itemViewer: ItemViewer;
  dragStart?: Vector2;
}

class Example extends React.Component<{}, ExampleState> {
  state: ExampleState = {
    itemViewer: new ItemViewer(
      DEFAULT.CONTAINER_WIDTH,
      DEFAULT.CONTAINER_HEIGHT,
      DEFAULT.ITEM_WIDTH,
      DEFAULT.ITEM_HEIGHT,
      DEFAULT.MARGIN,
      DEFAULT.ZOOM,
    ),
  };

  componentWillMount() {
    this.state.itemViewer.zoomToFit();
  }

  onSliderChange = (e: any) => {
    const value = e.target.valueAsNumber;
    const { itemViewer } = this.state;
    itemViewer.zoom = value / 100;
    this.setState({ itemViewer });
  };

  onMouseDown = (e: any) => {
    this.state.itemViewer.startDrag();
    this.setState({ dragStart: new Vector2(e.clientX, e.clientY) });
  };

  onMouseMove = (e: any) => {
    const { dragStart, itemViewer } = this.state;
    if (dragStart) {
      const delta = new Vector2(
        e.clientX - dragStart.x,
        e.clientY - dragStart.y,
      );
      itemViewer.drag(delta);
      this.setState({ itemViewer });
    }
  };

  onMouseUp = () => {
    this.setState({ dragStart: undefined });
  };

  render() {
    const { itemViewer } = this.state;
    const { containerRect, margin } = itemViewer;
    const containerStyle = {
      width: containerRect.width,
      height: containerRect.height,
    };
    const itemBounds = itemViewer.itemBounds;
    const itemStyle = {
      left: itemBounds.x,
      top: itemBounds.y,
      width: itemBounds.width,
      height: itemBounds.height,
    };
    const marginStyle = {
      left: margin,
      top: margin,
      width: containerRect.width - margin * 2,
      height: containerRect.height - margin * 2,
    };

    return (
      <Page>
        <Grid>
          <GridColumn>
            <h1>Item Viewer</h1>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <ItemViewerContainer
              style={containerStyle}
              onMouseDown={this.onMouseDown}
              onMouseMove={this.onMouseMove}
              onMouseUp={this.onMouseUp}
            >
              <ItemViewerItem style={itemStyle} />
              <ItemViewerMargin style={marginStyle} />
            </ItemViewerContainer>
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <Slider
              type="range"
              min="0"
              max="100"
              defaultValue="0"
              step="1"
              onChange={this.onSliderChange}
            />
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

export default () => <Example />;
