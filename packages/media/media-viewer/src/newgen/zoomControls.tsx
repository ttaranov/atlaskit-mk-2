import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import ZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import ZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import { ZoomLevel } from './domain';
import {
  ZoomWrapper,
  ZoomControlsWrapper,
  hideControlsClassName,
  ZoomLevelIndicator,
} from './styled';

export interface ZoomControlsProps {
  onChange: (newZoom: number) => void;
  zoom: number;
}

export class ZoomControls extends Component<ZoomControlsProps, {}> {
  zoomIn = () => {
    const { onChange, zoom } = this.props;
    const zoomLevel = new ZoomLevel(zoom / 100);
    if (zoomLevel.canZoomIn) {
      onChange(zoomLevel.zoomIn().value * 100);
    }
  };

  zoomOut = () => {
    const { onChange, zoom } = this.props;
    const zoomLevel = new ZoomLevel(zoom / 100);
    if (zoomLevel.canZoomOut) {
      onChange(zoomLevel.zoomOut().value * 100);
    }
  };

  render() {
    const { zoom } = this.props;
    const zoomLevel = new ZoomLevel(zoom / 100);
    return (
      <ZoomWrapper className={hideControlsClassName}>
        <ZoomControlsWrapper>
          <Button
            isDisabled={!zoomLevel.canZoomOut}
            onClick={this.zoomOut}
            iconBefore={<ZoomOutIcon primaryColor="white" label="zoom out" />}
          />
          <Button
            isDisabled={!zoomLevel.canZoomIn}
            onClick={this.zoomIn}
            iconBefore={<ZoomInIcon primaryColor="white" label="zoom in" />}
          />
        </ZoomControlsWrapper>
        <ZoomLevelIndicator>{zoomLevel.asPercentage}</ZoomLevelIndicator>
      </ZoomWrapper>
    );
  }
}
