import { HTMLAttributes } from 'react';
import styled from 'styled-components';
import { fontFamily, colors } from '@atlaskit/theme';
import { borderRadius } from '@atlaskit/media-ui';

export interface FrameProps {
  minWidth?: number;
  maxWidth?: number;
}

export const Frame: React.ComponentClass<
  FrameProps & HTMLAttributes<{}>
> = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 12px;
  color: ${colors.N300};
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 500;
  border-radius: 3px;
  background-color: ${colors.N20A};
  ${borderRadius} ${({ minWidth }: FrameProps) =>
      (minWidth && `min-width: ${minWidth}px;`) || ''} ${({
      maxWidth,
    }: FrameProps) => (maxWidth && `max-width: ${maxWidth}px;`) || ''} > * {
    /* fix spinner alignment (cause it is inline-block) */
    display: inline-flex;
  }
`;

export const Text: React.ComponentClass<HTMLAttributes<{}>> = styled.span`
  margin-left: 12px;
`;
