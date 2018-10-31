import * as React from 'react';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import { ImagePlacer, ImagePlacerAPI } from '../src/ImagePlacer';
import {
  Slider,
  Label,
  ExportedImage,
  ExportedImageWrapper,
} from '../example-helpers/styled';
import { fileToDataURI } from '../src';

export interface ExampleState {
  containerWidth: number;
  containerHeight: number;
  margin: number;
  zoom: number;
  maxZoom: number;
  useConstraints: boolean;
  circular: boolean;
  src?: string;
  file?: File;
  orientation: number;
  exportedDataURI?: string;
}

const CONTAINER_WIDTH = 'Container_Width';
const CONTAINER_HEIGHT = 'Container_Height';
const MARGIN = 'Margin';

class Example extends React.Component<{}, ExampleState> {
  zoomSlider?: HTMLInputElement;

  toDataURI?: () => string;

  state: ExampleState = {
    containerWidth: 200,
    containerHeight: 200,
    margin: 30,
    zoom: 0,
    maxZoom: 2,
    useConstraints: true,
    circular: false,
    orientation: 1,
  };

  onZoomSliderChange = (e: any) => {
    const value = e.target.valueAsNumber;
    const zoom = value / 100;
    this.setState({ zoom });
  };

  onUseConstraintsChanged = (e: any) => {
    const useConstraints = e.target.checked;
    this.setZoomSlider(0);
    this.setState({ zoom: 0, useConstraints });
  };

  onCircularChanged = (e: any) => {
    const circular = e.target.checked;
    this.setState({ circular });
  };

  private setZoomSlider(value: number) {
    if (this.zoomSlider) {
      this.zoomSlider.value = `${value * 100}`;
    }
  }

  onZoomSliderRef = (el: any) => {
    this.zoomSlider = el;
  };

  onZoomChange = (zoom: number) => {
    this.setZoomSlider(zoom);
  };

  onFileInputChange = async (e: any) => {
    const files = [...e.target.files];
    const file = files[0];
    // const src = await fileToDataURI(file);
    // this.setState({ src, file: undefined });
    this.setState({ src: undefined, file });
  };

  onExport = (api: ImagePlacerAPI) => {
    this.toDataURI = api.toDataURI;
  };

  onExportClick = () => {
    if (this.toDataURI) {
      this.setState({ exportedDataURI: this.toDataURI() });
    }
  };

  render() {
    const {
      containerWidth,
      containerHeight,
      margin,
      zoom,
      maxZoom,
      useConstraints,
      circular,
      file,
      src,
      exportedDataURI,
    } = this.state;

    return (
      <Page>
        <Grid>
          <GridColumn>
            <h1>Image Placer</h1>
            <p>todo: orientation</p>
            {this.slider(CONTAINER_WIDTH, containerWidth)}
            {this.slider(CONTAINER_HEIGHT, containerHeight)}
            {this.slider(MARGIN, margin, 0, 100, 5)}
            <Label>
              <span>Circular:</span>
              <input
                type="checkbox"
                defaultChecked={circular}
                onChange={this.onCircularChanged}
              />
            </Label>
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
        <Grid>
          <GridColumn>
            <ImagePlacer
              containerWidth={containerWidth}
              containerHeight={containerHeight}
              src={src}
              file={file}
              margin={margin}
              zoom={zoom}
              maxZoom={maxZoom}
              useConstraints={useConstraints}
              circular={circular}
              onZoomChange={this.onZoomChange}
              onExport={this.onExport}
            />
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
              style={{ width: containerWidth + margin * 2 }}
            />
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            <input type="file" onChange={this.onFileInputChange} />
            {typeof src === 'string' || typeof file !== 'undefined' ? (
              <p>
                <button onClick={this.onExportClick}>Export DataURI</button>
              </p>
            ) : null}
          </GridColumn>
        </Grid>
        <Grid>
          <GridColumn>
            {exportedDataURI ? (
              <ExportedImageWrapper>
                <ExportedImage src={exportedDataURI} style={{ margin }} />
              </ExportedImageWrapper>
            ) : null}
          </GridColumn>
        </Grid>
      </Page>
    );
  }

  private slider(
    title: string,
    defaultValue: number,
    min: number = 0,
    max: number = 500,
    step: number = 50,
  ): JSX.Element {
    const dataListOptions = [];
    for (let i = min; i < max; i += step) {
      dataListOptions.push(<option key={i + title}>{i}</option>);
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
        <datalist id={stepListId}>{dataListOptions}</datalist>
      </Label>
    );
  }

  onFormSliderChange = (e: any, id: string) => {
    const value = e.target.valueAsNumber;
    switch (id) {
      case CONTAINER_WIDTH:
        this.setState({ containerWidth: Math.max(1, value) });
        break;
      case CONTAINER_HEIGHT:
        this.setState({ containerHeight: Math.max(1, value) });
        break;
      case MARGIN:
        this.setState({ zoom: 0, margin: value });
        break;
    }
  };
}

export default () => <Example />;
