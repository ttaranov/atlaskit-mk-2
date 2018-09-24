// @flow
import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 24px;
  position: relative;
`;

export const SpinnerBackdrop = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SpinnerContainer = styled.div`
  position: relative;
  top: 0;
`;
