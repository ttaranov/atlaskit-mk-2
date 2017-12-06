import * as React from 'react';
import { Component } from 'react';
import { CardAction } from '@atlaskit/media-core';
import ImageIcon from '@atlaskit/icon/glyph/image';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import LinkIcon from '@atlaskit/icon/glyph/link';
import Button from '@atlaskit/button';
import { CardDimensions, CardAppearance } from '../../index';
// We are being verbose requiring utilities "utils" to avoid circular dependencies
import { Ellipsify } from '../../utils/ellipsify';
import { Wrapper } from '../styled';
import {
  Title,
  Description,
  ErrorContainer,
  ContentWrapper,
  Header,
  Icon,
  SiteName,
  Thumbnail,
  ImagePlaceholderWrapper,
  WarningIconWrapper,
  ErrorMessage,
  LinkIconWrapper,
  ErrorImage,
  ThumbnailPlaceholder,
  IconPlaceholder,
  TitlePlaceholder,
  DescriptionPlaceholder,
  ErrorWrapper,
  Details,
} from './styled';
import ElementPlaceholder from '../../utils/elementPlaceholder';
import { noImageIcon, linkErrorIcon } from './icons';
import { defaultLinkCardAppearance } from '../card';

export interface LinkCardGenericViewProps {
  linkUrl: string;
  title: string;
  site?: string;
  description?: string;
  thumbnailUrl?: string;
  iconUrl?: string;

  appearance?: CardAppearance;
  dimensions?: CardDimensions;

  isLoading?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  actions?: Array<CardAction>;
}

export interface LinkCardGenericViewState {
  thumbnailError?: boolean;
  iconError?: boolean;
}

const shouldNotDisplayThumbnail = (thumbnailUrl, thumbnailError): Boolean =>
  !thumbnailUrl || thumbnailError;

export class LinkCardGenericView extends Component<
  LinkCardGenericViewProps,
  LinkCardGenericViewState
> {
  static defaultProps = {
    title: '',
    description: '',
    actions: [],
    appearance: defaultLinkCardAppearance,
  };

  state: LinkCardGenericViewState = {
    thumbnailError: false,
    iconError: false,
  };

  private thumbnailError = () => {
    this.setState({
      thumbnailError: true,
    });
  };

  private iconError = () => {
    this.setState({
      iconError: true,
    });
  };

  private get siteName() {
    const { linkUrl, site, isLoading, errorMessage } = this.props;

    if (errorMessage) {
      return null;
    }

    if (isLoading) {
      return <ElementPlaceholder dimensions={{ width: 125, height: 12 }} />;
    }

    return <SiteName>{site || linkUrl}</SiteName>;
  }

  private get isHorizontal() {
    const { appearance } = this.props;
    return appearance === 'horizontal';
  }

  private getThumbnail = (): JSX.Element | null => {
    const { isHorizontal } = this;
    const { thumbnailUrl, errorMessage, isLoading, appearance } = this.props;
    const { thumbnailError } = this.state;

    if (errorMessage) {
      return null;
    }

    if (isLoading || shouldNotDisplayThumbnail(thumbnailUrl, thumbnailError)) {
      if (isHorizontal) {
        if (isLoading) {
          return (
            <ThumbnailPlaceholder
              key="thumbnail"
              dimensions={{ width: 68, height: 68 }}
            />
          );
        }

        return null;
      }

      const icon = thumbnailUrl ? (
        <ImageIcon label="image" size="xlarge" />
      ) : (
        noImageIcon
      );

      return (
        <ImagePlaceholderWrapper key="thumbnail">
          {icon}
        </ImagePlaceholderWrapper>
      );
    }
    const dataURI = thumbnailUrl || '';

    return (
      <Thumbnail
        appearance={appearance}
        key="thumbnail"
        dataURI={dataURI}
        onError={this.thumbnailError}
      />
    );
  };

  private getIcon = (): JSX.Element | null => {
    const { iconError } = this.state;
    const { title, iconUrl, isLoading, errorMessage } = this.props;

    if (isLoading) {
      return <IconPlaceholder dimensions={{ width: 16, height: 16 }} />;
    }

    if (errorMessage) {
      return (
        <WarningIconWrapper>
          <WarningIcon label="error" size="small" />
        </WarningIconWrapper>
      );
    }

    return iconUrl && !iconError ? (
      <Icon src={iconUrl} alt={title} onError={this.iconError} />
    ) : (
      <LinkIconWrapper>
        <LinkIcon label="icon" size="small" />
      </LinkIconWrapper>
    );
  };

  private getHeader() {
    const { siteName } = this;
    const icon = this.getIcon();

    return (
      <Header>
        {icon}
        {siteName}
      </Header>
    );
  }

  render() {
    const { appearance, errorMessage } = this.props;
    const content = errorMessage ? this.renderError() : this.renderContent();
    const header = this.getHeader();

    return (
      <Wrapper appearance={appearance}>
        {header}
        <ContentWrapper appearance={appearance}>{content}</ContentWrapper>
      </Wrapper>
    );
  }

  private renderContent = () => {
    let title;
    let description;
    const {
      title: linkTitle,
      description: linkDescription,
      isLoading,
      appearance,
    } = this.props;
    const thumbnail = this.getThumbnail();

    if (isLoading) {
      title = <TitlePlaceholder dimensions={{ height: 16 }} />;
      description = [
        <DescriptionPlaceholder
          key="descriptionRow1"
          dimensions={{ width: '80%', height: 12 }}
        />,
        <ElementPlaceholder
          key="descriptionRow2"
          dimensions={{ width: '60%', height: 12 }}
        />,
      ];
    } else {
      title = linkTitle ? <Title>{linkTitle}</Title> : null;
      description = (
        <Description>
          <Ellipsify text={linkDescription || ''} lines={2} endLength={0} />
        </Description>
      );
    }

    return [
      thumbnail,
      <Details appearance={appearance} key="details">
        {title}
        {description}
      </Details>,
    ];
  };

  renderError = () => {
    const { isHorizontal } = this;
    const { appearance, onRetry } = this.props;
    const retryButton = onRetry ? (
      <Button onClick={onRetry}>Try again</Button>
    ) : null;

    return (
      <ErrorWrapper appearance={appearance}>
        <ErrorContainer appearance={appearance}>
          {isHorizontal ? null : <ErrorImage src={linkErrorIcon} alt="Error" />}
          <ErrorMessage appearance={appearance}>
            We stumbled a bit here.
          </ErrorMessage>
          {retryButton}
        </ErrorContainer>
      </ErrorWrapper>
    );
  };
}

export default LinkCardGenericView;
