import * as React from 'react';
import { Component } from 'react';
import PlayIcon from '@atlaskit/icon/glyph/vid-play';
import PauseIcon from '@atlaskit/icon/glyph/vid-pause';
import FullScreenIconOn from '@atlaskit/icon/glyph/vid-full-screen-on';
import FullScreenIconOff from '@atlaskit/icon/glyph/vid-full-screen-off';
import SoundIcon from '@atlaskit/icon/glyph/hipchat/outgoing-sound';
import HDIcon from '@atlaskit/icon/glyph/vid-hd-circle';
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
import { Shortcut, keyCodes } from '../../shortcut';
import {
  toggleFullscreen,
  getFullscreenElement,
  vendorify,
} from './fullscreen';

export interface CustomVideoProps {
  readonly src: string;
  readonly isHDActive?: boolean;
  readonly onHDToggleClick?: () => void;
  readonly isHDAvailable: boolean;
  readonly showControls?: () => void;
  readonly isAutoPlay: boolean;
}

export interface CustomVideoState {
  isFullScreenEnabled: boolean;
}

export type ToggleButtonAction = () => void;

const spinner = (
  <SpinnerWrapper>
    <Spinner invertColor size="xlarge" />
  </SpinnerWrapper>
);
export class CustomVideo extends Component<CustomVideoProps, CustomVideoState> {
  videoWrapperRef?: HTMLElement;

  state: CustomVideoState = {
    isFullScreenEnabled: false,
  };

  componentDidMount() {
    document.addEventListener(
      vendorify('fullscreenchange', false),
      this.onFullScreenChange,
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      vendorify('fullscreenchange', false),
      this.onFullScreenChange,
    );
  }

  onFullScreenChange = () => {
    const { isFullScreenEnabled: currentFullScreenMode } = this.state;
    const isFullScreenEnabled = getFullscreenElement() ? true : false;

    if (currentFullScreenMode !== isFullScreenEnabled) {
      this.setState({
        isFullScreenEnabled,
      });
    }
  };

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
          <HDIcon
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
            iconBefore={<SoundIcon label="volume" />}
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

  onFullScreenClick = () => toggleFullscreen(this.videoWrapperRef);

  saveVideoWrapperRef = el => {
    if (el) {
      this.videoWrapperRef = el;
    }
  };

  renderFullScreenButton = () => {
    const { isFullScreenEnabled } = this.state;
    const icon = isFullScreenEnabled ? (
      <FullScreenIconOff primaryColor="white" label="disable fullscreen" />
    ) : (
      <FullScreenIconOn primaryColor="white" label="enable fullscreen" />
    );

    return (
      <Button
        appearance="toolbar"
        onClick={this.onFullScreenClick}
        iconBefore={icon}
      />
    );
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
              <PauseIcon label="play" />
            ) : (
              <PlayIcon label="pause" />
            );
            const toggleButtonAction = isPlaying ? actions.pause : actions.play;
            const button = (
              <Button
                appearance="toolbar"
                iconBefore={toggleButtonIcon}
                onClick={toggleButtonAction}
              />
            );

            return (
              <VideoWrapper>
                {video}
                {status === 'loading' && spinner}
                <Shortcut
                  keyCode={keyCodes.space}
                  handler={this.shortcutHanler(toggleButtonAction)}
                />
                <Shortcut
                  keyCode={keyCodes.m}
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
                      {this.renderFullScreenButton()}
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
