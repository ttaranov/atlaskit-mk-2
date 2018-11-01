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
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { WithAnalyticsEventProps } from '@atlaskit/analytics-next-types';
import { channel } from './analytics';
import { ZoomControlsGasPayload, createZoomEvent } from './analytics/zoom';

export type ZoomControlsProps = Readonly<{
  onChange: (newZoomLevel: ZoomLevel) => void;
  zoomLevel: ZoomLevel;
}> &
  WithAnalyticsEventProps;

export class ZoomControlsBase extends Component<ZoomControlsProps, {}> {
  zoomIn = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomIn) {
      const zoom = zoomLevel.zoomIn();
      this.fireAnalytics(createZoomEvent('zoomIn', zoom.value));
      onChange(zoom);
    }
  };

  zoomOut = () => {
    const { onChange, zoomLevel } = this.props;
    if (zoomLevel.canZoomOut) {
      const zoom = zoomLevel.zoomOut();
      this.fireAnalytics(createZoomEvent('zoomOut', zoom.value));
      onChange(zoom);
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
            // TODO [i18n]
            iconBefore={<ZoomOutIcon label="zoom out" />}
          />
          <Button
            appearance="toolbar"
            isDisabled={!zoomLevel.canZoomIn}
            onClick={this.zoomIn}
            // TODO [i18n]
            iconBefore={<ZoomInIcon label="zoom in" />}
          />
        </ZoomControlsWrapper>
        <ZoomLevelIndicator>{zoomLevel.asPercentage}</ZoomLevelIndicator>
      </ZoomWrapper>
    );
  }

  private fireAnalytics = (payload: ZoomControlsGasPayload) => {
    if (this.props.createAnalyticsEvent) {
      const ev = this.props.createAnalyticsEvent(payload);
      ev.fire(channel);
    }
  };
}

export const ZoomControls = withAnalyticsEvents({})(ZoomControlsBase);
