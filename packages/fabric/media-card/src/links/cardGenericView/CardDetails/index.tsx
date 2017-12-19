import * as React from 'react';
import { Ellipsify } from '../../../utils/ellipsify';
import { MediaImage } from '../../../utils/mediaImage';
import {
  Wrapper,
  ContentWrapper,
  Title,
  Description,
  Thumbnail,
  TitlePlaceholder,
  DescriptionPlaceholder1,
  DescriptionPlaceholder2,
} from './styled';

export interface CardDetailsProps {
  isPlaceholder?: boolean;
  isThumbnailVisible?: boolean;
  title?: string;
  description?: string;
  thumbnail?: string;
}

export default class CardDetails extends React.Component<CardDetailsProps> {
  renderThumbnail() {
    const {
      isPlaceholder = false,
      isThumbnailVisible = false,
      thumbnail = '',
    } = this.props;

    if (!isThumbnailVisible) {
      return null;
    }

    if (!isPlaceholder && !thumbnail) {
      return null;
    }

    return (
      <Thumbnail isPlaceholder={isPlaceholder}>
        {!isPlaceholder && <MediaImage dataURI={thumbnail} />}
      </Thumbnail>
    );
  }

  renderContent() {
    const { isPlaceholder = false, title = '', description = '' } = this.props;

    if (isPlaceholder) {
      return (
        <ContentWrapper>
          <TitlePlaceholder />
          <DescriptionPlaceholder1 />
          <DescriptionPlaceholder2 />
        </ContentWrapper>
      );
    } else {
      return (
        <ContentWrapper>
          <Title>{title}</Title>
          <Description>
            <Ellipsify text={description} lines={2} endLength={0} />
          </Description>
        </ContentWrapper>
      );
    }
  }

  render() {
    return (
      <Wrapper>
        {this.renderContent()}
        {this.renderThumbnail()}
      </Wrapper>
    );
  }
}
