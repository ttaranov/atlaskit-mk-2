// @flow
import React from 'react';
import type { Node } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  bottom: 0;
  color: rgb(23, 43, 77);
  height: auto;
  left: 0;
  letter-spacing: -0.16px;
  position: relative;
  right: 0;
  text-decoration: none solid rgb(23, 43, 77);
  top: 0;
  width: 100%;
  z-index: 1;
  column-rule-color: rgb(23, 43, 77);
  perspective-origin: 495.5px 22px;
  transform-origin: 495.5px 22px;
  caret-color: rgb(23, 43, 77);
  background: rgb(255, 255, 255) none repeat scroll 0% 0% / auto padding-box
    border-box;
  outline: rgb(23, 43, 77) none 0;
  padding: 20px 24px 24px 16px;
`;

const ChildrenWrapper = styled.div`
  box-sizing: border-box;
  color: rgb(23, 43, 77);
  display: table;
  height: 0;
  letter-spacing: -0.16px;
  text-decoration: none solid rgb(23, 43, 77);
  width: 951px;
  column-rule-color: rgb(23, 43, 77);
  perspective-origin: 475.5px 0;
  transform-origin: 475.5px 0;
  caret-color: rgb(23, 43, 77);
  border: 0 none rgb(23, 43, 77);
  outline: rgb(23, 43, 77) none 0;
`;

export const BlockWithChildren = ({ children }: { children: ?Node }) => (
  <Wrapper>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </Wrapper>
);
