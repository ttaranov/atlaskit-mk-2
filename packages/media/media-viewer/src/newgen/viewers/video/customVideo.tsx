import * as React from 'react';
import { Component } from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import EditorMediaFullWidthIcon from '@atlaskit/icon/glyph/editor/media-full-width';
import HipchatOutgoingSoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import Button from '@atlaskit/button';
import Video, {
  SetVolumeFunction,
  NavigateFunction,
} from 'react-video-renderer';
import { TimeRange } from './TimeRange';
import {
  CurrentTime,
  VideoWrapper,
  CustomVideoWrapper,
  TimebarWrapper,
  VolumeWrapper,
  TimeWrapper,
  LeftControls,
  RightControls,
  ControlsWrapper,
  VolumeToggleWrapper,
  MutedIndicator,
  VolumeRange,
} from './styled';
import { formatDuration } from '../../utils/formatDuration';
import { hideControlsClassName } from '../../styled';
import { Shortcut } from '../../shortcut';

export interface CustomVideoProps {
  readonly src: string;
  readonly isHDActive: boolean;
  readonly onHDChange: (isHDActive: boolean) => void;
  readonly showControls?: () => void;
}

export type ToggleButtonAction = () => void;

export class CustomVideo extends Component<CustomVideoProps, {}> {
  onTimeChange = (navigate: NavigateFunction) => (value: number) => {
    navigate(value);
  };

  onVolumeChange = (setVolume: SetVolumeFunction) => (e: any) => {
    const value = e.target.value;
    setVolume(value);
  };

  shortcutHanler = (toggleButtonAction: ToggleButtonAction) => () => {
    const { showControls } = this.props;

    toggleButtonAction();

    if (showControls) {
      showControls();
    }
  };

  private toggleHD = () => {
    const { onHDChange, isHDActive } = this.props;

    onHDChange(!isHDActive);
  };

  render() {
    const { src, isHDActive } = this.props;

    return (
      <CustomVideoWrapper>
        <Video src={src} autoPlay={false}>
          {(video, videoState, actions) => {
            const isPlaying = videoState.status === 'playing';
            const toggleButtonIcon = isPlaying ? (
              <VidPauseIcon label="play" />
            ) : (
              <VidPlayIcon label="pause" />
            );
            const toggleButtonAction = isPlaying ? actions.pause : actions.play;
            const button = (
              <Button
                iconBefore={toggleButtonIcon}
                onClick={toggleButtonAction}
              />
            );
            const fullScreenButton = (
              <Button
                iconBefore={
                  <EditorMediaFullWidthIcon
                    primaryColor="white"
                    label="fullscreen"
                  />
                }
                onClick={actions.requestFullscreen}
              />
            );

            return (
              <VideoWrapper>
                {video}
                <Shortcut
                  keyCode={32}
                  handler={this.shortcutHanler(toggleButtonAction)}
                />
                <ControlsWrapper className={hideControlsClassName}>
                  <TimeWrapper>
                    <TimeRange
                      currentTime={videoState.currentTime}
                      bufferedTime={videoState.buffered}
                      duration={videoState.duration}
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeWrapper>
                  <TimebarWrapper>
                    <LeftControls>{button}</LeftControls>
                    <RightControls>
                      <CurrentTime>
                        {formatDuration(videoState.currentTime)} /{' '}
                        {formatDuration(videoState.duration)}
                      </CurrentTime>
                      <Button
                        isSelected={isHDActive}
                        onClick={this.toggleHD}
                        iconBefore={
                          <VidHdCircleIcon
                            primaryColor="#a0b0cb"
                            secondaryColor="#313d51"
                            label="hd"
                          />
                        }
                      />
                      <VolumeWrapper>
                        <VolumeToggleWrapper>
                          <MutedIndicator isMuted={videoState.isMuted} />
                          <Button
                            onClick={actions.toggleMute}
                            iconBefore={
                              <HipchatOutgoingSoundIcon label="volume" />
                            }
                          />
                        </VolumeToggleWrapper>
                        <VolumeRange
                          type="range"
                          step={0.01}
                          value={videoState.volume}
                          max={1}
                          onChange={this.onVolumeChange(actions.setVolume)}
                        />
                      </VolumeWrapper>
                      {fullScreenButton}
                    </RightControls>
                  </TimebarWrapper>
                </ControlsWrapper>
              </VideoWrapper>
            );
          }}
        </Video>
      </CustomVideoWrapper>
    );
  }
}
