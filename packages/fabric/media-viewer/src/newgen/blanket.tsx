import styled, { keyframes } from 'styled-components';

const fadeInKeyframe = keyframes`
  0%{
    transform: scale(0);
  }
  100%{
    transform: scale(1);
  }
`;

export const fadeIn = `
  animation: ${fadeInKeyframe} .2s forwards
`;

export const Component = styled.div`
  ${fadeIn};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: white;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  background-color: rgba(9, 30, 66, 0.9);
  background-tra: hidden;
  z-index: 9;

  * {
    box-sizing: border-box;
  }

  &:hover {
    .visible-on-hover {
      opacity: 1;
    }
  }

  .visible-on-hover {
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
  }
`;
