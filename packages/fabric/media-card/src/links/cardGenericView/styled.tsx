/* tslint:disable:variable-name */
import styled from 'styled-components';
import {
  akColorN800,
  akColorN300,
  akColorN30,
  akColorY400,
  akBorderRadius,
} from '@atlaskit/util-shared-styles';
import {
  size,
  ellipsis,
  borderRadius,
  withAppearance,
  linkCardShadow,
  centerSelf,
  center,
  absolute,
} from '../../styles';
import { MediaImage, MediaImageProps } from '../../utils/mediaImage';
import ElementPlaceholder, {
  ElementPlaceholderProps,
} from '../../utils/elementPlaceholder';

// We need to do this in order to make TS find implicit interfaces
// https://github.com/Microsoft/TypeScript/issues/9944
export interface DummyInterface
  extends MediaImageProps,
    ElementPlaceholderProps {}

const detailsHeight = '92px';
const headerHeight = '32px';

// This preserves the 16:9 aspect ratio
const aspectRatio = `
  height: 0;
  padding-bottom: 56.25%;
`;

export const Title = styled.div`
  ${ellipsis('100%')} line-height: 21px;
  font-weight: 500;
  color: ${akColorN800};
  user-select: text;
  font-size: 16px;
  margin-bottom: 6px;
`;

export const Description = styled.div`
  user-select: text;
  overflow: hidden;
  color: ${akColorN300};
  line-height: 18px;

  .ellipsed-text {
    font-size: 12px;
    white-space: initial;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Link = styled.div`
  display: flex;
  align-items: center;
  width: calc(100% - 40px);
`;

export const ErrorWrapper = styled.div`
  // Needed to keep error state consistent
  padding-top: ${detailsHeight};
  position: relative;
  ${withAppearance({
    square: `
      ${aspectRatio}
    `,
    horizontal: `
      ${size()}
      ${center}
    `,
  })};
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  ${absolute()} ${size()} ${withAppearance({
      horizontal: `
      flex-direction: row;
      width: 100%;
      justify-content: space-around;
    `,
      square: `
      flex-direction: column;
      justify-content: center;
    `,
    })};
`;

export const ErrorMessage = styled.div`
  ${withAppearance({
    square: `
      margin: 16px 0 24px 0;
    `,
  })};
`;

export const ContentWrapper = styled.div`
  ${borderRadius} ${linkCardShadow} background-color: white;
  height: calc(100% - ${headerHeight});
  transition: box-shadow 0.3s;

  .link-wrapper:hover & {
    box-shadow: 0 4px 8px -2px rgba(23, 43, 77, 0.32),
      0 0 1px rgba(23, 43, 77, 0.25);
  }

  ${withAppearance({
    square: `
      justify-content: center;
    `,
    horizontal: `
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
    `,
    auto: `
      display: flex;
      flex-direction: row-reverse;
    `,
  })};
`;

export const Header = styled.div`
  height: ${headerHeight};
  display: flex;
  align-items: center;
  color: ${akColorN300};
`;

export const Icon = styled.img`
  ${borderRadius} ${size(16)} margin-right: 4px;
`;

export const SiteName = styled.span`
  color: ${akColorN300};
  overflow: hidden;
  text-overflow: ellipsis;
  height: 16px;
  font-size: 12px;
`;

export const Thumbnail = styled(MediaImage)`
  ${borderRadius} background-color: ${akColorN30};
  ${withAppearance({
    square: `
      ${aspectRatio}
      border-radius: 3px 3px 0 0;
    `,
    horizontal: `
      ${size(68)}
      margin: 8px;
      flex: initial;
    `,
    auto: `
      ${size(68)}
      margin: 8px;
      flex: initial;
    `,
  })};
`;

export const ImagePlaceholderWrapper = styled.div`
  ${aspectRatio} position: relative;
  background-color: ${akColorN30};
  color: rgba(9, 30, 66, 0.13);

  // Needed to center the icon, because we use padding-bottom for the aspectRatio
  > * {
    ${centerSelf};
  }
`;

export const WarningIconWrapper = styled.span`
  color: ${akColorY400};
  margin-right: 4px;
`;

export const LinkIconWrapper = styled.span`
  margin-right: 4px;
`;

export const ErrorImage = styled.img`
  height: 94px;
`;

// Those elements are used to display the "loading" status of the LinkCard.
export const ThumbnailPlaceholder = styled(ElementPlaceholder)`
  margin: 8px;
`;

export const IconPlaceholder = styled(ElementPlaceholder)`
  margin-right: 4px;
`;

export const TitlePlaceholder = styled(ElementPlaceholder)`
  margin-bottom: 10px;
`;

export const DescriptionPlaceholder = styled(ElementPlaceholder)`
  margin-bottom: 10px;
`;

export const Details = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 8px 0 16px;
  height: 100%;

  ${withAppearance({
    square: `
      height: ${detailsHeight};
      flex-grow: 0;
      min-width: initial;
      border-radius: 0 0 ${akBorderRadius} ${akBorderRadius};
    `,
    horizontal: `
      flex: 1;
      overflow: hidden;
    `,
  })};
`;
