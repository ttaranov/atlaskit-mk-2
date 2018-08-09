// StyledComponentClass and React types are imported to prevent a typescript error caused by inferred types sourced
// from external modules - https://github.com/styled-components/styled-components/issues/1063#issuecomment-320344957
// @ts-ignore: unused variable
// prettier-ignore
import styled, { StyledComponentClass } from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, VideoHTMLAttributes, AudioHTMLAttributes, ImgHTMLAttributes, ComponentClass, ClassAttributes } from 'react';

export const TimeRangeWrapper = styled.div`
  margin-top: 40px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;
export const Group = styled.div`
  width: 250px;
  padding: 20px;
`;

export const ButtonList = styled.ul`
  padding-left: 0;
  list-style: none;
`;
