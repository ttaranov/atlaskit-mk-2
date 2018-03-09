import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import * as React from 'react';
import {
  akZIndexBlanket,
  akZIndexDialog,
  akBorderRadius,
  akColorN400,
  akColorN0,
  akColorN20,
  akColorN30,
} from '@atlaskit/util-shared-styles';

export const Container: ComponentClass<HTMLAttributes<{}>> = styled.div`
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  z-index: ${akZIndexBlanket};
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Wrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  bottom: 0;
  left: 0;
  opacity: 0.5;
  right: 0;
  top: 0;
  transition: opacity 220ms;
  position: fixed;
  background-color: ${akColorN400};
`;

export const Dialog: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 80%;
  height: 80%;
  display: flex;
  max-width: 800px;
  max-height: 650px;
  color: ${akColorN400};
  flex-direction: column;
  z-index: ${akZIndexDialog};
  background-color: ${akColorN0};
  border-radius: ${akBorderRadius};
`;

export const Header: ComponentClass<HTMLAttributes<{}>> = styled.div`
  min-height: 24px;
  padding: 20px 40px;
  font-size: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export function IconWrapper(props) {
  return <div>{props.children}</div>;
}

export const ContentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  padding: 20px 5%;
  border-bottom-right-radius: ${akBorderRadius};
  overflow: auto;
  box-shadow: inset 0 2px 0 0 ${akColorN30};
  position: relative;
  width: 90%;
`;

export const Line: ComponentClass<HTMLAttributes<{}>> = styled.div`
  background: #fff;
  content: '';
  display: block;
  height: 2px;
  left: 0;
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  min-width: 604px;
`;

export const Content: ComponentClass<HTMLAttributes<{}>> = styled.div`
  min-width: 524px;
  width: 100%;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

export const ColumnLeft: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 44%;
`;

export const ColumnRight: ComponentClass<HTMLAttributes<{}>> = styled.div`
  width: 44%;
`;

export const Row: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  font-size: 18px;
  font-weight: 400;
`;

export const CodeSm: ComponentClass<HTMLAttributes<{}>> = styled.span`
  background-color: ${akColorN20};
  border-radius: ${akBorderRadius};
  width: 24px;
  display: inline-block;
  height: 24px;
  line-height: 24px;
  text-align: center;
`;

export const CodeMd: ComponentClass<HTMLAttributes<{}>> = styled.span`
  background-color: ${akColorN20};
  border-radius: ${akBorderRadius};
  display: inline-block;
  height: 24px;
  line-height: 24px;
  width: 50px;
  text-align: center;
`;

export const CodeLg: ComponentClass<HTMLAttributes<{}>> = styled.span`
  background-color: ${akColorN20};
  border-radius: ${akBorderRadius};
  display: inline-block;
  height: 24px;
  line-height: 24px;
  padding: 0 10px;
  text-align: center;
`;
