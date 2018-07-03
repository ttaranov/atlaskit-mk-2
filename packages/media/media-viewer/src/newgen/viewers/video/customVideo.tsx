import * as React from 'react';
import { Component } from 'react';
import VidPlayIcon from '@atlaskit/icon/glyph/vid-play';
import VidPauseIcon from '@atlaskit/icon/glyph/vid-pause';
import VidFullScreenOnIcon from '@atlaskit/icon/glyph/vid-full-screen-on';
import HipchatOutgoingSoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import VidHdCircleIcon from '@atlaskit/icon/glyph/vid-hd-circle';
import Button from '@atlaskit/button';
import Video, {
  SetVolumeFunction,
  NavigateFunction,
  VideoState,
  VideoActions,
} from 'react-video-renderer';
import { colors } from '@atlaskit/theme';
import Spinner from '@atlaskit/spinner';
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
  SpinnerWrapper,
} from './styled';
import { formatDuration } from '../../utils/formatDuration';
import { hideControlsClassName } from '../../styled';
import { Shortcut } from '../../shortcut';
import { toggleFullscreen } from './fullscreen';

export interface CustomVideoProps {
  readonly src: string;
  readonly isHDActive?: boolean;
  readonly onHDToggleClick?: () => void;
  readonly isHDAvailable: boolean;
  readonly showControls?: () => void;
  readonly isAutoPlay: boolean;
}

export type ToggleButtonAction = () => void;

const spinner = (
  <SpinnerWrapper>
    <Spinner invertColor size="xlarge" />
  </SpinnerWrapper>
);
export class CustomVideo extends Component<CustomVideoProps> {
  videoWrapperRef?: HTMLElement;

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

  renderHDButton = () => {
    const { isHDAvailable, isHDActive, onHDToggleClick } = this.props;

    if (!isHDAvailable) {
      return;
    }
    const primaryColor = isHDActive ? colors.B200 : colors.DN400;
    return (
      <Button
        appearance="toolbar"
        isSelected={isHDActive}
        onClick={onHDToggleClick}
        iconBefore={
          <VidHdCircleIcon
            primaryColor={primaryColor}
            secondaryColor="#313d51"
            label="hd"
          />
        }
      />
    );
  };

  renderVolume = ({ isMuted, volume }: VideoState, actions: VideoActions) => {
    return (
      <VolumeWrapper>
        <VolumeToggleWrapper isMuted={isMuted}>
          <MutedIndicator isMuted={isMuted} />
          <Button
            appearance="toolbar"
            onClick={actions.toggleMute}
            iconBefore={<HipchatOutgoingSoundIcon label="volume" />}
          />
        </VolumeToggleWrapper>
        <VolumeRange
          type="range"
          step={0.01}
          value={volume}
          max={1}
          onChange={this.onVolumeChange(actions.setVolume)}
        />
      </VolumeWrapper>
    );
  };

  onFullScreenClick = () => {
    toggleFullscreen(this.videoWrapperRef);
  };

  saveVideoWrapperRef = el => {
    if (el) {
      this.videoWrapperRef = el;
    }
  };

  render() {
    const { src, isAutoPlay } = this.props;

    return (
      <CustomVideoWrapper innerRef={this.saveVideoWrapperRef}>
        <Video src={src} autoPlay={isAutoPlay}>
          {(video, videoState, actions) => {
            const { status, currentTime, buffered, duration } = videoState;
            const isPlaying = status === 'playing';
            const toggleButtonIcon = isPlaying ? (
              <VidPauseIcon label="play" />
            ) : (
              <VidPlayIcon label="pause" />
            );
            const toggleButtonAction = isPlaying ? actions.pause : actions.play;
            const button = (
              <Button
                appearance="toolbar"
                iconBefore={toggleButtonIcon}
                onClick={toggleButtonAction}
              />
            );
            const fullScreenButton = (
              <Button
                appearance="toolbar"
                onClick={this.onFullScreenClick}
                iconBefore={
                  <VidFullScreenOnIcon
                    primaryColor="white"
                    label="fullscreen"
                  />
                }
              />
            );

            return (
              <VideoWrapper>
                {video}
                {status === 'loading' && spinner}
                <Shortcut
                  keyCode={32}
                  handler={this.shortcutHanler(toggleButtonAction)}
                />
                <Shortcut
                  keyCode={77}
                  handler={this.shortcutHanler(actions.toggleMute)}
                />
                <ControlsWrapper className={hideControlsClassName}>
                  <TimeWrapper>
                    <TimeRange
                      currentTime={currentTime}
                      bufferedTime={buffered}
                      duration={duration}
                      onChange={this.onTimeChange(actions.navigate)}
                    />
                  </TimeWrapper>
                  <TimebarWrapper>
                    <LeftControls>
                      {button}
                      {this.renderVolume(videoState, actions)}
                    </LeftControls>
                    <RightControls>
                      <CurrentTime>
                        {formatDuration(currentTime)} /{' '}
                        {formatDuration(duration)}
                      </CurrentTime>
                      {this.renderHDButton()}
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
