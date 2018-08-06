// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
import {
  // @ts-ignore: unused variable
  HTMLAttributes,
  // @ts-ignore: unused variable
  InputHTMLAttributes,
  // @ts-ignore: unused variable
  ClassAttributes,
  // @ts-ignore: unused variable
  ComponentClass,
} from 'react';
import { colors } from '@atlaskit/theme';
import { blanketColor } from '../../styled';

export interface MutedIndicatorProps {
  isMuted: boolean;
}

export const CustomVideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${blanketColor};
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  video {
    flex: 1;
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
  }
`;

export const TimebarWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: white;
  margin: 0 13px 0 9px;
`;

export const VolumeWrapper = styled.div`
  display: flex;
  width: 35px;
  overflow: hidden;
  transition: width 0.3s;
  align-items: center;

  &:hover {
    padding-right: 20px;
    width: 152px;
  }

  input {
    transform: translateX(13px);
    height: 100%;
    cursor: pointer;
  }
`;

export const TimeWrapper = styled.div`
  margin: 0 20px 10px 20px;
`;

export const CurrentTime = styled.div`
  width: 90px;
  color: #a4b4cb;
  user-select: none;
`;

export const TimeLine = styled.div`
  width: 100%;
  height: 2px;
  background-color: #5d646f;
  border-radius: 5px;
  position: relative;
  transition: all 0.1s;
`;

export const CurrentTimeLine = styled.div`
  background-color: #3383ff;
  border-radius: inherit;
  height: inherit;
  position: absolute;
  top: 0;
  max-width: 100%;
`;

export const Thumb = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 100%;
  background-color: white;
  border: 1px solid #666;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(7px, -50%) scale(0);
  transition: all 0.1s;

  &:hover .current-time-tooltip {
    opacity: 1;
  }
`;

export const BufferedTime = styled.div`
  background-color: #aeb1b7;
  height: inherit;
  border-radius: inherit;
  width: 0;
`;

export const LeftControls = styled.div`
  display: flex;
`;

export const RightControls = styled.div`
  display: flex;
  align-items: center;
`;

export const ControlsWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px 0 20px 0;
`;

export const VolumeToggleWrapper = styled.div`
  position: relative;

  button {
    width: 36px;
    color: ${({ isMuted }: MutedIndicatorProps) =>
      isMuted ? `${colors.R300} !important;` : ''};
  }
`;

export const MutedIndicator = styled.div`
  width: 29px;
  height: 2px;
  position: absolute;
  top: 5px;
  left: 9px;
  background: ${colors.R300};
  transform: rotate(32deg) translateY(10px);
  opacity: 0;
  pointer-events: none;

  ${(props: MutedIndicatorProps) =>
    props.isMuted
      ? `
    opacity: 1;
  `
      : ''};
`;

export interface CurrentTimeTooltipProps {
  isDragging: boolean;
}

export const CurrentTimeTooltip = styled.div`
  position: absolute;
  user-select: none;
  top: -28px;
  background-color: #182c4c;
  color: #eff1f3;
  font-size: 12px;
  padding: 3px 7px;
  border-radius: 3px;
  left: 50%;
  transform: translateX(-50%);
  opacity: ${(props: CurrentTimeTooltipProps) =>
    props.isDragging ? '1' : '0'};
  transition: opacity 0.3s;
`;

export const TimeRangeWrapper = styled.div`
  padding: 10px 0;
  cursor: pointer;

  &:hover {
    .timeline {
      height: 4px;
      transform: translateY(2px);
    }

    .time-range-thumb {
      transform: translate(7px, -50%) scale(1);
    }
  }
`;

export const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
