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
  onChange: (zoomLevel: number, step: number) => void;
  minZoom: number;
  maxZoom: number;
  steps: number;
  step: number;
}

export interface ZoomControlsState {}

export const getZoomLevel = (
  minZoom: number,
  maxZoom: number,
  steps: number,
  step: number,
): number => {
  const logMinZoom = Math.log(minZoom);
  const logMaxZoom = Math.log(maxZoom);

  const logZoom = logMinZoom + (logMaxZoom - logMinZoom) * step / (steps - 1);
  const zoomLevel = Math.min(
    Math.max(Math.round(Math.exp(logZoom) * 100) / 100, minZoom),
    maxZoom,
  );
  return zoomLevel;
};

export class ZoomControls extends Component<
  ZoomControlsProps,
  ZoomControlsState
> {
  zoom = (direction: ZoomDirection) => () => {
    const { onChange } = this.props;
    const step = this.getNewStep(direction);
    onChange(this.getNewZoomLevel(step), step);
  };

  get canZoomOut(): boolean {
    const { minZoom } = this.props;
    console.log('zoom out:', this.getNewZoomLevel(this.getNewStep('out')));

    return this.getNewZoomLevel(this.getNewStep('out')) > minZoom;
  }

  get canZoomIn(): boolean {
    console.log('zoom in:', this.getNewZoomLevel(this.getNewStep('in')));
    const { maxZoom } = this.props;
    return this.getNewZoomLevel(this.getNewStep('in')) < maxZoom;
  }

  render() {
    const { canZoomOut, canZoomIn } = this;
    const { steps, step, minZoom, maxZoom } = this.props;
    const zoomLevel = getZoomLevel(minZoom, maxZoom, steps, step);

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

  private getNewStep(direction: ZoomDirection) {
    const { step } = this.props;
    return direction === 'out' ? step - 1 : step + 1;
  }

  private getNewZoomLevel(step: number) {
    const { steps, minZoom, maxZoom } = this.props;
    return getZoomLevel(minZoom, maxZoom, steps, step);
  }

  private getFriendlyZoomLevel(zoomLevel: number) {
    return Math.round(zoomLevel * 100);
  }
}
