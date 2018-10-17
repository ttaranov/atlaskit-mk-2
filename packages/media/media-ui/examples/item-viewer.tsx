import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ItemViewer, Vector2 } from '../src/camera';
import {
  ItemViewerContainer,
  ItemViewerItem,
  ItemViewerMargin,
  Slider,
  Label,
} from '../example-helpers/styled';

const DEFAULT = {
  CONTAINER_WIDTH: 200,
  CONTAINER_HEIGHT: 200,
  ITEM_WIDTH: 50,
  ITEM_HEIGHT: 50,
  ZOOM: 0,
  MARGIN: 28,
};

export interface ExampleState {
  itemViewer: ItemViewer;
  dragStart?: Vector2;
}

class Example extends React.Component<{}, ExampleState> {
  zoomSlider?: HTMLInputElement;

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
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onZoomSliderChange = (e: any) => {
    const value = e.target.valueAsNumber;
    const { itemViewer } = this.state;
    itemViewer.setZoom(value / 100);
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

  onUseConstraintsChanged = (e: any) => {
    const value = e.target.checked;
    const itemViewer = this.state.itemViewer;
    itemViewer.setUseConstraints(value);
    this.setZoomSlider(0);
    this.setState({ itemViewer });
  };

  private setZoomSlider(value: number) {
    if (this.zoomSlider) {
      this.zoomSlider.value = `${value * 100}`;
    }
  }

  onWheel = (e: any) => {
    const itemViewer = this.state.itemViewer;
    const rawZoom = itemViewer.zoom + e.deltaY / 100;
    const clampedZoom = Math.min(Math.max(0, rawZoom), 1);
    itemViewer.setZoom(clampedZoom);
    this.setZoomSlider(clampedZoom);
    this.setState({ itemViewer });
  };

  onZoomSliderRef = (el: any) => {
    this.zoomSlider = el;
  };

  render() {
    const { itemViewer } = this.state;
    const {
      containerRect,
      originalItemRect,
      margin,
      useConstraints,
      zoom,
    } = itemViewer;
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
      width: containerRect.width - margin * 2,
      height: containerRect.height - margin * 2,
      borderWidth: margin,
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
              onWheel={this.onWheel}
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
              defaultValue={`${zoom}`}
              step="1"
              onChange={this.onZoomSliderChange}
              innerRef={this.onZoomSliderRef}
            />
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <Label>
              <span>Zoom: </span>
              <input type="text" readOnly={true} value={itemViewer.zoom} />
            </Label>
            <Label>
              <span>Origin: </span>
              <input
                type="text"
                readOnly={true}
                value={itemViewer.mapCoords(0, 0).toString()}
              />
            </Label>
            {this.newSlider('Container_Width', containerRect.width)}
            {this.newSlider('Container_Height', containerRect.height)}
            {this.newSlider('Item_Width', originalItemRect.width)}
            {this.newSlider('Item_Height', originalItemRect.height)}
            {this.newSlider('Margin', margin, 0, 100, 5)}
            <Label>
              <span>Use Constraints:</span>
              <input
                type="checkbox"
                defaultChecked={useConstraints}
                onChange={this.onUseConstraintsChanged}
              />
            </Label>
          </GridColumn>
        </Grid>
      </Page>
    );
  }

  private newSlider(
    title: string,
    defaultValue: number,
    min: number = 0,
    max: number = 500,
    step: number = 50,
  ): JSX.Element {
    const options = [];
    for (let i = min; i < max; i += step) {
      options.push(<option key={i + title}>{i}</option>);
    }
    const displayTitle = title.replace(/_/g, ' ');
    const stepListId = `stepList_${displayTitle}`;
    return (
      <Label>
        <span>{displayTitle}:</span>
        <Slider
          type="range"
          min={min}
          max={max}
          defaultValue={`${defaultValue}`}
          step={step}
          list={stepListId}
          onChange={(e: any) => this.onFormSliderChange(e, title)}
        />
        {defaultValue}
        <datalist id={stepListId}>{options}</datalist>
      </Label>
    );
  }

  onFormSliderChange = (e: any, id: string) => {
    const value = e.target.valueAsNumber;
    const { itemViewer } = this.state;
    const { containerRect, itemRect, originalItemRect } = itemViewer;
    switch (id) {
      case 'Container_Width':
        itemViewer.setContainerSize(Math.max(1, value), containerRect.height);
        break;
      case 'Container_Height':
        itemViewer.setContainerSize(containerRect.width, Math.max(1, value));
        break;
      case 'Item_Width':
        itemViewer.setItemSize(Math.max(1, value), originalItemRect.height);
        break;
      case 'Item_Height':
        itemViewer.setItemSize(originalItemRect.width, Math.max(1, value));
        break;
      case 'Margin':
        itemViewer.setMargin(value);
        break;
    }
    this.setState({ itemViewer });
  };
}

export default () => <Example />;
