import * as React from 'react';
import { Component } from 'react';
import FieldRange from '@atlaskit/field-range';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import Button from '@atlaskit/button';
import Video from 'react-video-renderer';
import {
  CurrentTime,
  VideoWrapper,
  AppWrapper,
  TimebarWrapper,
  VolumeWrapper,
  TimeWrapper,
} from './styled';

console.log('Video', Video);

export interface CustomVideoState {}

export interface CustomVideoProps {
  src: string;
}

export class CustomVideo extends Component<CustomVideoProps, CustomVideoState> {
  state: CustomVideoState = {};

  onTimeChange = (navigate: Function) => (value: number) => {
    navigate(value);
  };

  onVolumeChange = (setVolume: Function) => (value: number) => {
    setVolume(value);
  };

  render() {
    const { src } = this.props;

    return (
      <AppWrapper>
        <Video src={src} autoPlay={true}>
          {(video, videoState, actions) => {
            const button =
              videoState.status === 'playing' ? (
                <Button
                  appearance="primary"
                  iconBefore={<VidPauseIcon label="play" />}
                  onClick={actions.pause}
                />
              ) : (
                <Button
                  appearance="primary"
                  iconBefore={<VidPlayIcon label="pause" />}
                  onClick={actions.play}
                />
              );
            const fullScreenButton = (
              <Button
                appearance="primary"
                iconBefore={<VidFullScreenOnIcon label="fullscreen" />}
                onClick={actions.requestFullscreen}
              />
            );

            return (
              <VideoWrapper>
                {video}
                <TimebarWrapper>
                  {button}
                  <CurrentTime>
                    {Math.round(videoState.currentTime)} /{' '}
                    {Math.round(videoState.duration)}
                  </CurrentTime>
                  <TimeWrapper>
                    <FieldRange
                      value={videoState.currentTime}
                      min={0}
                      max={videoState.duration}
                      // step={2}
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeWrapper>
                  <VolumeWrapper>
                    <FieldRange
                      value={videoState.volume}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={this.onVolumeChange(actions.setVolume)}
                    />
                  </VolumeWrapper>
                  {fullScreenButton}
                </TimebarWrapper>
              </VideoWrapper>
            );
          }}
        </Video>
      </AppWrapper>
    );
  }
}
