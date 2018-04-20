import * as React from 'react';
import { Component } from 'react';
import FieldRange from '@atlaskit/field-range';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import EditorMediaFullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import HipchatOutgoingSoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import Button from '@atlaskit/button';
import Video from 'react-video-renderer';
import { TimeRange } from './TimeRange';
import {
  CurrentTime,
  VideoWrapper,
  AppWrapper,
  TimebarWrapper,
  VolumeWrapper,
  TimeWrapper,
  LeftControls,
  RightControls,
} from './styled';

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
                  iconBefore={<VidPauseIcon label="play" />}
                  onClick={actions.pause}
                />
              ) : (
                <Button
                  iconBefore={<VidPlayIcon label="pause" />}
                  onClick={actions.play}
                />
              );
            const fullScreenButton = (
              <Button
                iconBefore={<EditorMediaFullWidthIcon label="fullscreen" />}
                onClick={actions.requestFullscreen}
              />
            );

            return (
              <VideoWrapper>
                {video}
                <TimeWrapper>
                  <TimeRange
                    currentTime={videoState.currentTime}
                    bufferedTime={0}
                    // min={0}
                    duration={videoState.duration}
                    // step={2}
                    onChange={this.onTimeChange(actions.navigate)}
                  />
                </TimeWrapper>
                <TimebarWrapper>
                  <LeftControls>{button}</LeftControls>
                  <RightControls>
                    <CurrentTime>
                      {Math.round(videoState.currentTime)} /{' '}
                      {Math.round(videoState.duration)}
                    </CurrentTime>
                    <VolumeWrapper>
                      <HipchatOutgoingSoundIcon label="volume" />
                      {/* <FieldRange
                        value={videoState.volume}
                        min={0}
                        max={1}
                        step={0.01}
                        onChange={this.onVolumeChange(actions.setVolume)}
                      /> */}
                    </VolumeWrapper>
                    {fullScreenButton}
                  </RightControls>
                </TimebarWrapper>
              </VideoWrapper>
            );
          }}
        </Video>
      </AppWrapper>
    );
  }
}
