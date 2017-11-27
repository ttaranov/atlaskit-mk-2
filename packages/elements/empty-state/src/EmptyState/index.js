// @flow

import React from 'react';

import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import Container from '../styled/Container';
import ActionsContainer from '../styled/ActionsContainer';
import ButtonGroup from '../styled/ButtonGroup';
import Header from '../styled/Header';
import Description from '../styled/Description';
import Image from '../styled/Image';
import SpinnerContainer from '../styled/SpinnerContainer';

import type { Size } from '../styled/Container';

type PrimaryAction = {|
  label: string,
  onClick: () => void,
|};

type SecondaryAction = {|
  label: string,
  onClick: () => void,
|};

type LinkAction = {|
  label: string,
  url: string,
  onClick?: () => void,
|};

type Props = {
  /** Title that briefly describes the page to the user. */
  header: string,
  /** The main block of text that holds some additional information. */
  description?: string,
  /** It affects the width of the main container of this component, "wide" is a default one. */
  size?: Size,
  /** Image that will be shown above the title. The larger side of this image will be shrunk to 160px. */
  imageUrl?: string,
  /** Maximum width (in pixels) of the image, default value is 160. */
  maxImageWidth?: number,
  /** Maximum height (in pixels) of the image, default value is 160. */
  maxImageHeight?: number,
  /** Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages). */
  primaryAction?: PrimaryAction,
  /** Secondary action button for the page. */
  secondaryAction?: SecondaryAction,
  /** Link action button with link to some external resource like documentation or tutorial, it will be opened in a new tab. */
  linkAction?: LinkAction,
  /** Shows spinner next to the action buttons. Primary and secondary action buttons are disabled when this prop is set to true. */
  isLoading?: boolean,
};

export default class EmptyState extends React.PureComponent<Props, void> {
  static defaultProps: $Shape<Props> = {
    size: 'wide',
    maxImageWidth: 160,
    maxImageHeight: 160,
  };

  render() {
    const {
      header,
      description,
      size,
      imageUrl,
      maxImageWidth,
      maxImageHeight,
      isLoading,
      primaryAction,
      secondaryAction,
      linkAction,
    } = this.props;

    const primaryButton = primaryAction ? (
      <Button
        appearance="primary"
        isDisabled={isLoading}
        onClick={primaryAction.onClick}
      >
        {primaryAction.label}
      </Button>
    ) : null;

    const secondaryButton = secondaryAction ? (
      <Button isDisabled={isLoading} onClick={secondaryAction.onClick}>
        {secondaryAction.label}
      </Button>
    ) : null;

    const linkButton = linkAction ? (
      <Button
        appearance="subtle"
        href={linkAction.url}
        target="_blank"
        onClick={linkAction.onClick}
      >
        {linkAction.label}
      </Button>
    ) : null;

    const actionsContainer =
      primaryButton || secondaryButton || isLoading ? (
        <ActionsContainer>
          <ButtonGroup>
            {primaryButton}
            {secondaryButton}
          </ButtonGroup>
          <SpinnerContainer>{isLoading && <Spinner />}</SpinnerContainer>
        </ActionsContainer>
      ) : null;

    return (
      <Container size={size}>
        {imageUrl && (
          <Image
            src={imageUrl}
            maxImageWidth={maxImageWidth}
            maxImageHeight={maxImageHeight}
          />
        )}
        <Header>{header}</Header>
        {description && <Description>{description}</Description>}
        {actionsContainer}
        {linkButton}
      </Container>
    );
  }
}
