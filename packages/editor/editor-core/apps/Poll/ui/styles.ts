import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';

import {
  akColorB100,
  akColorN20,
  akColorN100,
} from '@atlaskit/util-shared-styles';

export const Meta: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${akColorN100};
  margin-top: 5px;
  font-size: 90%;
`;

export const Header: ComponentClass<HTMLAttributes<{}>> = styled.h2`
  font-weight: normal;
  margin: 0;
`;

export const ChoicesContainer: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: 24px 0 12px;

  button,
  > div {
    margin-bottom: 5px;
  }
  > div:last-child,
  button:last-child {
    margin-bottom: none;
  }

  button {
    text-align: left;
    height: auto;
    padding: 8px 5px;
  }
`;

export const CompletedChoiceContainer: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  background: ${akColorN20};
  border-radius: 5px;
  position: relative;

  > div + div {
    padding: 8px 20px;
  }

  .completed-choice-value {
    margin-left: 20px;
  }
  .completed-choice-progress-bar {
    background: ${akColorB100};
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.2;
    border-radius: 5px;
  }
`;

export const ProgressBar: ComponentClass<
  HTMLAttributes<{}> & { width: number }
> = styled.div`
  background: ${akColorB100};
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.2;
  border-radius: 5px;
  width: ${(props: { width: number }) => props.width}%;
  transition: width 1.5s ease-out;
`;

export const SpinnerWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 10px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
