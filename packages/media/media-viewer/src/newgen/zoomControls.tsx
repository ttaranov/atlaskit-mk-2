import * as React from 'react';
import { Component } from 'react';
import Button from '@atlaskit/button';
import ZoomOutIcon from '@atlaskit/icon/glyph/media-services/zoom-out';
import ZoomInIcon from '@atlaskit/icon/glyph/media-services/zoom-in';
import { ZoomLevel } from './domain/zoomLevel';
import {
  ZoomWrapper,
  ZoomControlsWrapper,
  hideControlsClassName,
  ZoomLevelIndicator,
} from './styled';

export interface ZoomControlsProps {
  onChange: (newZoomLevel: ZoomLevel) => void;
  zoomLevel: ZoomLevel;
}

export class ZoomControls extends Component<ZoomControlsProps, {}> {
  zoomIn = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomIn) {
      onChange(zoomLevel.zoomIn());
    }
  };

  zoomOut = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomOut) {
      onChange(zoomLevel.zoomOut());
    }
  };

  render() {
    const { zoomLevel } = this.props;
    return (
      <ZoomWrapper className={hideControlsClassName}>
        <ZoomControlsWrapper>
          <Button
            appearance="toolbar"
            isDisabled={!zoomLevel.canZoomOut}
            onClick={this.zoomOut}
            iconBefore={<ZoomOutIcon label="zoom out" />}
          />
          <Button
            appearance="toolbar"
            isDisabled={!zoomLevel.canZoomIn}
            onClick={this.zoomIn}
            iconBefore={<ZoomInIcon label="zoom in" />}
          />
        </ZoomControlsWrapper>
        <ZoomLevelIndicator>{zoomLevel.asPercentage}</ZoomLevelIndicator>
      </ZoomWrapper>
    );
  }
}
