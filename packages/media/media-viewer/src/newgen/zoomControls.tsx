import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import ZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import ZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import { ZoomWrapper } from './styled';

export type ZoomDirection = 'out' | 'in';

export interface ZoomControlsProps {
  onChange: (zoomLevel: number) => void;
  step?: number;
}

export interface ZoomControlsState {
  zoomLevel: number;
}

const minZoomLevel = 0.2;
const zoomingStep = 0.2;

export class ZoomControls extends Component<
  ZoomControlsProps,
  ZoomControlsState
> {
  static defaultProps: ZoomControlsProps = {
    onChange() {},
    step: zoomingStep,
  };

  state: ZoomControlsState = {
    zoomLevel: 1,
  };

  zoom = (direction: ZoomDirection) => () => {
    const { onChange, step } = this.props;
    const { zoomLevel: currentZoomLevel } = this.state;
    const newZoomLevel = direction === 'out' ? -step! : step;
    const zoomLevel = Math.max(
      Math.round((currentZoomLevel + newZoomLevel!) * 10) / 10,
      minZoomLevel,
    );

    onChange(zoomLevel);
    this.setState({ zoomLevel });
  };

  render() {
    return (
      <ZoomWrapper>
        <Button
          onClick={this.zoom('out')}
          iconBefore={<ZoomOutIcon primaryColor="white" label="zoom out" />}
        />
        <Button
          onClick={this.zoom('in')}
          iconBefore={<ZoomInIcon primaryColor="white" label="zoom in" />}
        />
      </ZoomWrapper>
    );
  }
}
