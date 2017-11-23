// @flow

import React from 'react';

import Button from '@atlaskit/button';
import Spinner from '@atlaskit/spinner';

import Container from '../styled/Container';
import PrimaryActionContainer from '../styled/PrimaryActionContainer';
import ActionElementContainer from '../styled/ActionElementContainer';
import Header from '../styled/Header';
import Description from '../styled/Description';
import Image from '../styled/Image';
import SpinnerContainer from '../styled/SpinnerContainer';

import type { Size } from '../styled/Container';

type PrimaryAction = {
  label: string,
  onClick: () => void,
  isLoading?: boolean,
};

type SecondaryAction = {
  label: string,
  url: string,
  onClick?: () => void,
};

type DefaultProps = {
  size: Size,
};

type Props = {
  /** Title that briefly describes the page to the user. */
  header: string,
  /** The main block of text that holds some additional information. */
  description?: string,
  /** It affects the width of the main container of this component, "wide" is a default one. */
  size?: Size,
  /** Image that will be shown above the title. The larger side of this image will be shrunk to 160px. */
  imageUrl?: string,
  /** Primary action button for the page, usually it will be something like "Create" (or "Retry" for error pages). */
  primaryAction?: PrimaryAction,
  /** Secondary action button with link to some external resource like documentation or tutorial, it will be opened in a new tab. */
  secondaryAction?: SecondaryAction,
};

export default class EmptyState extends React.PureComponent<Props, void> {
  static defaultProps: DefaultProps = {
    size: 'wide',
  };

  render() {
    const {
      imageUrl,
      header,
      description,
      primaryAction,
      secondaryAction,
      size,
    } = this.props;

    const primaryActionButton = primaryAction ? (
      <PrimaryActionContainer>
        <Button
          appearance="primary"
          isDisabled={primaryAction.isLoading}
          onClick={() => primaryAction.onClick()}
        >
          {primaryAction.label}
        </Button>
        <SpinnerContainer>
          {primaryAction.isLoading && <Spinner />}
        </SpinnerContainer>
      </PrimaryActionContainer>
    ) : null;

    const linkButton = secondaryAction ? (
      <a
        href={secondaryAction.url}
        target="_blank"
        onClick={secondaryAction.onClick}
      >
        {secondaryAction.label}
      </a>
    ) : null;

    return (
      <Container size={size}>
        {imageUrl && <Image src={imageUrl} />}
        <Header>{header}</Header>
        {description && <Description>{description}</Description>}
        {primaryActionButton || linkButton ? (
          <div>
            {primaryActionButton && (
              <ActionElementContainer>
                {primaryActionButton}
              </ActionElementContainer>
            )}
            {linkButton && (
              <ActionElementContainer>{linkButton}</ActionElementContainer>
            )}
          </div>
        ) : null}
      </Container>
    );
  }
}
