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
import FieldRange from '@atlaskit/field-range';
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
import { Spinner } from '../../loading';

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

  onVolumeChange = (setVolume: SetVolumeFunction) => (value: number) =>
    setVolume(value);

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
    const secondaryColor = isHDActive ? colors.white : colors.DN60;
    return (
      <Button
        appearance="toolbar"
        isSelected={isHDActive}
        onClick={onHDToggleClick}
        iconBefore={
          <HDIcon
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
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
        <FieldRange
          max={1}
          value={volume}
          onChange={this.onVolumeChange(actions.setVolume)}
        />
      </VolumeWrapper>
    );
  };

  onFullScreenClick = () => toggleFullscreen(this.videoWrapperRef);

  saveVideoWrapperRef = (el?: HTMLElement) => (this.videoWrapperRef = el);

  renderFullScreenButton = () => {
    const { isFullScreenEnabled } = this.state;
    const icon = isFullScreenEnabled ? (
      // TODO [i18n]
      <FullScreenIconOff label="disable fullscreen" />
    ) : (
      // TODO [i18n]
      <FullScreenIconOn label="enable fullscreen" />
    );

    return (
      <Button
        appearance="toolbar"
        onClick={this.onFullScreenClick}
        iconBefore={icon}
      />
    );
  };

  renderSpinner = () => (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  );

  render() {
    const { src, isAutoPlay } = this.props;
    return (
      <CustomVideoWrapper innerRef={this.saveVideoWrapperRef}>
        <Video src={src} autoPlay={isAutoPlay}>
          {(video, videoState, actions) => {
            const {
              status,
              currentTime,
              buffered,
              duration,
              isLoading,
            } = videoState;
            const isPlaying = status === 'playing';
            const toggleButtonIcon = isPlaying ? (
              // TODO [i18n]
              <PauseIcon label="play" />
            ) : (
              // TODO [i18n]
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
                {isLoading && this.renderSpinner()}
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
