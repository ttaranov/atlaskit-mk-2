import styled from 'styled-components';
// @ts-ignore: unused variable
// prettier-ignore
import { HTMLAttributes, ClassAttributes, ComponentClass } from 'react';
import { borderRadius, gridSize, colors } from '@atlaskit/theme';

const akGridSize = gridSize();

export const ContentWrapper: ComponentClass<
  HTMLAttributes<{}> & { innerRef?: any }
> = styled.div`
  margin: 0;
  word-wrap: break-word;
  min-width: 0;
  flex: 1 1 auto;
`;

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & { theme?: any }
> = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.theme.appearance === 'card' ? 'column' : 'row'};

  line-height: 20px;
  background-color: ${colors.N30A};
  border-radius: ${borderRadius()}px;
  margin: ${akGridSize}px 0;
  padding: ${akGridSize}px ${akGridSize}px;
  min-height: 36px;
  box-sizing: border-box;
  box-shadow: ${props =>
    props.theme.appearance === 'card'
      ? `0 1px 1px ${colors.N50A}, 0 0 1px 0 ${colors.N60A}`
      : 'none'};

  &:hover {
    box-shadow: ${props =>
      props.theme.appearance === 'card'
        ? `0 4px 8px -2px ${colors.N60A}, 0 0 1px ${colors.N60A}`
        : 'none'};
    transition: box-shadow 0.2s ease-in-out;
  }
`;

export const ParticipantWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  margin: -2px 8px;
`;

export const CardHeadingWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  min-height: 24px;
`;

export const AttributionWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  color: ${colors.N200};
  margin-top: ${akGridSize}px;
  font-size: 12px;
  font-weight: 500;
`;
