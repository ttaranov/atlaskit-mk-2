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
  zoomLevel: number;
  onChange: (zoomLevel: number) => void;
  step?: number;
}

export interface ZoomControlsState {}

const minZoomLevel = 0.2;
const maxZoomLevel = 5;
const zoomingStep = 0.2;

export const getZoomLevel = (
  currentZoomLevel: number,
  direction: ZoomDirection,
  step: number = zoomingStep,
): number => {
  const increase = step * currentZoomLevel;
  const newZoomLevel = direction === 'out' ? -increase : increase;
  const zoomLevel = Math.min(
    Math.max(
      Math.round((currentZoomLevel + newZoomLevel) * 100) / 100,
      minZoomLevel,
    ),
    maxZoomLevel,
  );

  return zoomLevel;
};

export class ZoomControls extends Component<
  ZoomControlsProps,
  ZoomControlsState
> {
  static defaultProps: Partial<ZoomControlsProps> = {
    step: zoomingStep,
  };

  zoom = (direction: ZoomDirection) => () => {
    const { onChange, step } = this.props;
    const { zoomLevel: currentZoomLevel } = this.props;
    const zoomLevel = getZoomLevel(currentZoomLevel, direction, step);

    onChange(zoomLevel);
  };

  get canZoomOut(): boolean {
    const { zoomLevel } = this.props;

    return zoomLevel > minZoomLevel;
  }

  get canZoomIn(): boolean {
    const { zoomLevel } = this.props;

    return zoomLevel < maxZoomLevel;
  }

  render() {
    const { canZoomOut, canZoomIn } = this;
    const { zoomLevel } = this.props;

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
        <ZoomLevel>{this.getFriendlyZoomLevel(zoomLevel)} %</ZoomLevel>
      </ZoomWrapper>
    );
  }

  private getFriendlyZoomLevel(zoomLevel: number) {
    return Math.round(zoomLevel * 100);
  }
}
