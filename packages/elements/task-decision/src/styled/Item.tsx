import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { borderRadius, gridSize, colors } from '@atlaskit/theme';

const akGridSize = gridSize();

export const ContentWrapper: ComponentClass<
  HTMLAttributes<{}> & { innerRef?: any }
> = styled.div`
  flex: 1 1 auto;

  margin: 0;
  word-wrap: break-word;
  min-width: 0;
`;

export const Wrapper: ComponentClass<
  HTMLAttributes<{}> & { theme?: any }
> = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: ${props =>
    props.theme.appearance === 'card' ? 'column' : 'row'};
  justify-content: flex-end;

  background-color: ${colors.N20};
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

export const HelperTextWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${colors.N200};
  margin-top: ${akGridSize}px;
  font-size: 12px;
  font-weight: 500;
`;

export const EndAdornmentWrapper: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: flex;
  justify-content: flex-end;
  flex-grow: 1;
`;

export const StartAdornmentAndContent: ComponentClass<
  HTMLAttributes<{}>
> = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  min-width: 184px;
`;
