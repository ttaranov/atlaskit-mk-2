// @ts-ignore: unused variable
import styled, { StyledComponentClass } from 'styled-components';
import {
  HTMLAttributes,
  // @ts-ignore: unused variable
  InputHTMLAttributes,
  // @ts-ignore: unused variable
  ClassAttributes,
  ComponentClass,
} from 'react';

export const CustomVideoWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  width: 100%;
  height: 100%;

  button {
    color: white !important;
  }
`;

export const VideoWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  video {
    flex: 1;
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
  padding-right: 10px;
  display: flex;
  width: 35px;
  overflow: hidden;
  transition: width 0.3s;

  &:hover {
    padding-right: 20px;
    width: 180px;
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
  height: 5px;
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
  min-width: 17px;
  max-width: 100%;
`;

export const Thumb = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 100%;
  background-color: white;
  border: 1px solid #666;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
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

export const LeftControls = styled.div``;

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
`;

export interface MutedIndicatorProps {
  isMuted: boolean;
}

export const MutedIndicator = styled.div`
  width: 29px;
  height: 2px;
  position: absolute;
  top: 5px;
  left: 9px;
  background: white;
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

export const VolumeRange = styled.input`
  margin-left: 30px;
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
      height: 8px;
      transform: translateY(2px);
    }

    .time-range-thumb {
      width: 18px;
      height: 18px;
    }
  }
`;
