import styled from 'styled-components';
import { HTMLAttributes, ComponentClass } from 'react';
import { colors } from '@atlaskit/theme';
import { ellipsis, borderRadius, size } from '@atlaskit/media-ui';
import { maxAvatarCount } from './UsersView';

const thumbnailWidth = 40;

export const ContentWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
  padding: 8px 12px 12px 12px;
`;

export const BodyWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0; /* for Chrome ellipsis */
  flex-basis: 0; /* for IE ellipsis */
`;

export const TopWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
`;

export const LeftWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  /* FIXME: top padding dependent on content*/
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin-right: 8px;
  min-width: ${thumbnailWidth}px;
`;

export const RightWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  flex-grow: 1;
  min-width: 0; /* for Chrome ellipsis */
  flex-basis: 0; /* for IE ellipsis */
`;

export const Title: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${colors.N900};
  font-size: 16px;
  font-weight: 500;
  line-height: ${20 / 16};
  max-height: ${20 * 4};
`;

export const Byline: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-top: 4px;
  color: ${colors.N300};
  font-size: 12px;
  font-weight: normal;
  line-height: ${16 / 12};
  ${ellipsis('100%')};
`;

export const Description: ComponentClass<HTMLAttributes<{}>> = styled.div`
  margin-top: 7px;
  color: ${colors.N800};
  font-size: 12px;
  font-weight: normal;
  line-height: ${18 / 12};
  max-height: ${18 * 3};
`;

export interface ThumbnailProps {
  src: string;
}

export const Thumbnail: ComponentClass<
  HTMLAttributes<{}> & ThumbnailProps
> = styled.div`
  ${borderRadius} ${size(32)} background-color: ${colors.N30};
  background-image: url(${({ src }: ThumbnailProps) => src});
  background-size: cover;
`;

export const ActionsWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: flex-end;
  margin-left: 8px;
`;
export const AlertWrapper: ComponentClass<HTMLAttributes<{}>> = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  /* z-index has to be 1 higher than the number of avatars in the avatar stack */
  z-index: ${maxAvatarCount + 1};
`;
