import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import ZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import ZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import {
  ZoomWrapper,
  ZoomControlsWrapper,
  hideControlsClassName,
  ZoomLevel,
} from './styled';

export type ZoomDirection = 'out' | 'in';

export interface ZoomControlsProps {
  onChange: (newZoom: number) => void;
  zoom: number;
}

const zoomValues = [20, 50, 100, 200, 500];

export interface ZoomControlsState {}

export class ZoomControls extends Component<
  ZoomControlsProps,
  ZoomControlsState
> {
  zoom = (direction: ZoomDirection) => () => {
    const { onChange } = this.props;
    const newZoom = this.getNewZoomValue(direction);
    if (newZoom) {
      onChange(newZoom);
    }
  };

  get canZoomOut(): boolean {
    return this.getNewZoomValue('out') !== undefined;
  }

  get canZoomIn(): boolean {
    return this.getNewZoomValue('in') !== undefined;
  }

  render() {
    const { canZoomOut, canZoomIn } = this;
    const { zoom } = this.props;
    return (
      <ZoomWrapper className={hideControlsClassName}>
        <ZoomControlsWrapper>
          <Button
            isDisabled={!canZoomOut}
            onClick={this.zoom('out')}
            iconBefore={<ZoomOutIcon primaryColor="white" label="zoom out" />}
          />
          <Button
            isDisabled={!canZoomIn}
            onClick={this.zoom('in')}
            iconBefore={<ZoomInIcon primaryColor="white" label="zoom in" />}
          />
        </ZoomControlsWrapper>
        <ZoomLevel>{zoom} %</ZoomLevel>
      </ZoomWrapper>
    );
  }

  private getNewZoomValue(direction: ZoomDirection): number | undefined {
    const { zoom } = this.props;
    const index = zoomValues.indexOf(zoom);
    return direction === 'out' ? zoomValues[index - 1] : zoomValues[index + 1];
  }
}
