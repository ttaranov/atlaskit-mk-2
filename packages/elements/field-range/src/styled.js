// @flow
/* eslint-disable no-mixed-operators */
import styled, { css } from 'styled-components';
import { colors } from '@atlaskit/theme';
import { thumb, track } from './theme';

const sliderThumbSize = 16;
const sliderThumbBorderThickness = 2;
const sliderLineThickness = 4;
export const overallHeight = 40;

const sliderThumbStyle = css`
  background: ${thumb.default.background};
  border-radius: 50%;
  box-shadow: 0 0 1px ${colors.N60A}, 0 2px 8px -2px ${colors.N50A};
  height: ${sliderThumbSize}px;
  width: ${sliderThumbSize}px;
`;

const sliderThumbFocusedStyle = css`
  border: ${sliderThumbBorderThickness}px solid ${colors.B200};
  box-sizing: content-box;
`;

const sliderTrackStyle = css`
  backgound: ${colors.N30A};
  background: ${props =>
    `linear-gradient(${track.default.lower}, ${track.default.lower}) 0/ ${
      props.value
    }% 100% no-repeat ${track.default.upper}`};
  border-radius: ${sliderLineThickness / 2}px;
  border: 0;
  cursor: pointer;
  height: ${sliderLineThickness}px;
  width: 100%;
`;

const sliderTrackFocusedStyle = css`
  background: ${props =>
    `linear-gradient(${track.hover.lower}, ${track.hover.lower}) 0/ ${
      props.value
    }% 100% no-repeat ${track.hover.upper}`};
`;

const chromeRangeInputStyle = css`
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    margin-top: -${sliderThumbSize / 2 - sliderLineThickness / 2}px;
    ${sliderThumbStyle};
  }

  &::-webkit-slider-runnable-track {
    ${sliderTrackStyle};
  }

  &:focus::-webkit-slider-thumb {
    ${sliderThumbFocusedStyle};
  }

  &:focus::-webkit-slider-runnable-track {
  &:hover::-webkit-slider-runnable-track,
  &:active::-webkit-slider-runnable-track {
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

  &:hover::-moz-range-track,
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
    background: ${track.default.lower};
    border-radius: ${sliderLineThickness / 2}px;
    border: 0;
  }
  &::-ms-fill-upper {
    background: ${track.default.upper};
    border-radius: ${sliderLineThickness / 2}px;
    border: 0;
  }
  &:focus::-ms-thumb {
    ${sliderThumbFocusedStyle};
  }
  &:focus::-ms-fill-lower {
    background: ${track.hover.lower};
  }
  &:hover::-ms-fill-upper,
  &:focus::-ms-fill-upper {
    background: ${track.hover.upper};
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
