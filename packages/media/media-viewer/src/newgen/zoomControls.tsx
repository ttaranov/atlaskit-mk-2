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

export class ZoomControls extends Component<ZoomControlsProps, {}> {
  private zoomLevel: ZoomLevelCalculator;

  constructor(props) {
    super(props);
    const { zoom } = this.props;
    this.zoomLevel = new ZoomLevelCalculator([20, 50, 100, 200, 500], zoom);
  }

  zoom = (direction: ZoomDirection) => () => {
    const { onChange } = this.props;
    const newZoom = this.getNewZoomValue(direction);
    if (newZoom) {
      onChange(newZoom);
    }
  };

  get canZoomOut(): boolean {
    return this.zoomLevel.decrease() !== undefined;
  }

  get canZoomIn(): boolean {
    return this.zoomLevel.increase() !== undefined;
  }

  render() {
    const { canZoomOut, canZoomIn } = this;
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
        <ZoomLevel>{this.zoomLevel.toString()}</ZoomLevel>
      </ZoomWrapper>
    );
  }

  private getNewZoomValue(direction: ZoomDirection): number | undefined {
    return direction === 'out'
      ? this.zoomLevel.decrease()
      : this.zoomLevel.increase();
  }
}

class ZoomLevelCalculator {
  constructor(
    private readonly allowedZoomLevels: number[],
    private readonly zoomLevel: number,
  ) {
    if (this.getIndex() < 0) {
      throw new Error('current zoomLevel not in the allowed range');
    }
  }

  increase(): number | undefined {
    return this.allowedZoomLevels[this.getIndex() + 1];
  }

  decrease(): number | undefined {
    return this.allowedZoomLevels[this.getIndex() - 1];
  }

  // use this to convert the floating point number to a nice clean percentage including the `%` symbol.
  toString(): string {
    return `${this.zoomLevel} %`;
  }

  valueOf(): number {
    return this.zoomLevel;
  }

  private getIndex() {
    return this.allowedZoomLevels.indexOf(this.zoomLevel);
  }
}
