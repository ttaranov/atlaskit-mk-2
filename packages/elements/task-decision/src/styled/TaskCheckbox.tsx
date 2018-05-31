import styled from 'styled-components';
import { keyframes } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { gridSize, borderRadius, colors } from '@atlaskit/theme';

const checkBoxSize = 16;

// reveal the 2 sides of the checkmark by increasing their height
const leftSideCheckmark = keyframes`
  0% {
    height: 2.2px;
    opacity: 1;
  }
  100% {
    height: 5.7px;
    opacity: 1;
  }
`;
const rightSideCheckmark = keyframes`
  0% {
    height: 2.2px;
    opacity: 1;
  }
  100% {
    height: 10px;
    opacity: 1;
  }
`;

// animate a blue box from the center of the checkbox, bouncing outside its bounds and
// then scaling back to its final size
const checkBounce = keyframes`
  0% {
    opacity: 0;
    width: 0;
    height: 0;
    top: 7px;
    left: 7px;
    border-radius: 0px;
  }
  /* set full opacity around the same size as the checkbox */
  40% {
    opacity: 1;
  }
  /* grow beyond its final size */
  50% {
    opacity: 1;
    width: 20px;
    height: 20px;
    top: -3px;
    left: -3px;
    border-radius: ${borderRadius()}px;
  }
  /* scale back to final size, same as checkbox */
  100% {
    opacity: 1;
    width: ${checkBoxSize}px;
    height: ${checkBoxSize}px;
    top: -1px;
    left: -1px;
    border-radius: ${borderRadius()}px;
  }
`;

// create a ripple effect showing when the animated blue box (see checkBounce animation)
// reaches its max size before scaling back down
const bounceRipple = keyframes`
  0% {
    opacity: 1;
    width: 20px;
    height: 20px;
    top: -4px;
    left: -4px;
    border-radius: ${borderRadius()}px;
  }
  100% {
    opacity: 0;
    width: 24px;
    height: 24px;
    top: -6px;
    left: -6px;
    border-radius: ${borderRadius()}px;
  }
`;

export const CheckBoxWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  flex: 0 0 ${checkBoxSize}px;
  width: ${checkBoxSize}px;
  height: ${checkBoxSize}px;
  position: relative;
  align-self: start;
  margin: 2px ${gridSize()}px 0 0;

  & > input[type='checkbox'] {
    position: absolute;
    outline: none;
    margin: 0;
    opacity: 0;
    left: 0;
    top: 50%;
    transform: translateY(-50%);

    + label {
      box-sizing: border-box;
      display: inline-block;
      position: relative;
      cursor: pointer;
      background-color: ${colors.N0};
      border: 1px solid ${colors.N50};
      border-radius: ${borderRadius()}px;
      box-sizing: border-box;
      height: ${checkBoxSize}px;
      width: ${checkBoxSize}px;
      transition: border-color 0.2s ease;

      &::before,
      &::after {
        content: '';
        position: absolute;
        opacity: 0;
        display: inline-block;
        border-radius: ${borderRadius()}px;
        background-color: ${colors.B400};
        width: 0;
        height: 0;
        border: 1px solid transparent;
      }
      > span {
        &::before,
        &::after {
          content: '';
          box-sizing: border-box;
          position: absolute;
          height: 2.2px;
          width: 2.2px;
          background-color: ${colors.N0};
          display: block;
          transform-origin: left top;
          border-radius: 5px;
          z-index: 1;
          opacity: 0;
        }
        &::before {
          top: 11.06px;
          left: 5.8px;
          transform: rotate(-135deg);
          height: 10px;
        }
        &::after {
          top: 7.03px;
          left: 1.45px;
          transform: rotate(-45deg);
          height: 5.7px;
        }
      }
    }
    &:not([disabled]) + label:hover {
      background: ${colors.N30};
      transition: border 0.2s ease-in-out;
    }
    &[disabled] + label {
      opacity: 0.5;
      cursor: default;
    }
    &:checked {
      + label {
        &::after {
          box-sizing: border-box;
          opacity: 1;
          width: ${checkBoxSize}px;
          height: ${checkBoxSize}px;
          top: -1px;
          left: -1px;
          border-radius: ${borderRadius()}px;
        }
        > span::before,
        span::after {
          opacity: 1;
        }
      }
      &:not([disabled]) + label:hover::after {
        background-color: ${colors.B500};
      }
    }
    &.animated:checked {
      + label {
        > span::before,
        span::after {
          opacity: 0;
        }
        > span::before {
          animation: ${rightSideCheckmark} 0.1s ease-in 0.2s forwards;
        }
        > span::after {
          animation: ${leftSideCheckmark} 0.02s linear 0.18s forwards;
        }
        &::before {
          animation: ${bounceRipple} 0.11s ease 0.15s;
        }
        &::after {
          animation: ${checkBounce} 0.3s ease-in-out 0s forwards;
        }
      }
    }
  }
`;
