// @flow
/* eslint-disable no-mixed-operators */
import styled, { css } from 'styled-components';
import theme from './theme';

const sliderThumbSize = 20;
const sliderThumbBorderThickness = 2;
const sliderLineThickness = 6;
export const overallHeight = 40;

const sliderThumbStyle = css`
  background: ${theme.thumb.background.normal};
  border-radius: ${sliderThumbSize / 2}px;
  box-shadow: 0 0 0 ${sliderThumbBorderThickness}px ${theme.thumb.border.normal};
  cursor: pointer;
  height: ${sliderThumbSize}px;
  width: ${sliderThumbSize}px;
`;

const sliderThumbFocusedStyle = css`
  box-shadow: 0 0 0 ${sliderThumbBorderThickness}px ${theme.thumb.border.focus};
`;

const sliderTrackStyle = css`
  background: ${theme.track.background.normal};
  border-radius: ${sliderLineThickness / 2}px;
  border: 0;
  cursor: pointer;
  height: ${sliderLineThickness}px;
  width: 100%;
`;

const sliderTrackFocusedStyle = css`
  background: ${theme.track.background.focus};
`;

const chromeRangeInputStyle = css`
  &::-webkit-slider-thumb {
    ${sliderThumbStyle} -webkit-appearance: none;
    margin-top: -${sliderThumbSize / 2 - sliderLineThickness / 2}px;
  }

  &::-webkit-slider-runnable-track {
    ${sliderTrackStyle};
  }

  &:focus::-webkit-slider-thumb {
    ${sliderThumbFocusedStyle};
  }

  &:focus::-webkit-slider-runnable-track {
    ${sliderTrackFocusedStyle};
  }
`;

const firefoxRangeInputStyle = css`
  &::-moz-focus-outer {
    border: 0;
  }

  &::-moz-range-thumb {
    ${sliderThumbStyle} border:0;
  }

  &::-moz-range-track {
    ${sliderTrackStyle};
  }

  &:focus::-moz-range-thumb {
    ${sliderThumbFocusedStyle};
  }

  &:focus::-moz-range-track {
    ${sliderTrackFocusedStyle};
  }
`;

const IERangeInputStyle = css`
  &::-ms-thumb {
    ${sliderThumbStyle};
  }
  &::-ms-track {
    background: transparent;
    border-color: transparent;
    color: transparent;
    cursor: pointer;
    height: ${sliderLineThickness}px;
    width: 100%;
  }
  &::-ms-fill-lower {
    background: ${theme.track.background.normal};
    border-radius: ${sliderLineThickness / 2}px;
    border: 0;
  }
  &::-ms-fill-upper {
    background: ${theme.track.background.normal};
    border-radius: ${sliderLineThickness / 2}px;
    border: 0;
  }
  &:focus::-ms-thumb {
    ${sliderThumbFocusedStyle};
  }
  &:focus::-ms-fill-lower {
    ${sliderTrackFocusedStyle};
  }
  &:focus::-ms-fill-upper {
    ${sliderTrackFocusedStyle};
  }
`;

export const rangeInputStyle = css`
  -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
  background: transparent; /* Otherwise white in Chrome */
  height: ${overallHeight}px; /* Otherwise thumb will collide with previous box element */
  width: 100%; /* Specific width is required for Firefox. */

  &:focus {
    outline: none;
  }

  ${chromeRangeInputStyle} ${firefoxRangeInputStyle} ${IERangeInputStyle};
`;

export const Input = styled.input`
  ${rangeInputStyle};
`;
