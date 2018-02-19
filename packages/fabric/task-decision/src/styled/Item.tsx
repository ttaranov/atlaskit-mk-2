import styled from 'styled-components';
import { borderRadius, gridSize, colors } from '@atlaskit/theme';
import { ComponentClass } from 'react';

const akGridSize = gridSize();

// tslint:disable-next-line:variable-name
export const ContentWrapper = styled.div`
  margin: 0;
  word-wrap: break-word;
  min-width: 0;
  flex: 1 1 auto;
`;

// tslint:disable-next-line:variable-name
export const Wrapper = styled.div`
  display: flex;
  flex-direction: ${props =>
    props.theme.appearance === 'card' ? 'column' : 'row'};

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
` as ComponentClass<any>;

// tslint:disable-next-line:variable-name
export const ParticipantWrapper = styled.div`
  margin: -2px 8px;
`;

// tslint:disable-next-line:variable-name
export const CardHeadingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  min-height: 24px;
`;

// tslint:disable-next-line:variable-name
export const AttributionWrapper = styled.div`
  color: ${colors.N200};
  margin-top: ${akGridSize}px;
  font-size: 12px;
  font-weight: 500;
`;
