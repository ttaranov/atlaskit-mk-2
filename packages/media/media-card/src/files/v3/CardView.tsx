import * as React from 'react';
import Button from '@atlaskit/button';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import Spinner from '@atlaskit/spinner';
import { colors } from '@atlaskit/theme';
import { CardAction } from '../../actions';
import { CardDimensions, CardStatus } from '../../index';
import { ImageResizeMode, MediaType } from '@atlaskit/media-core';
import {
  ActionsWrapper,
  Blanket,
  PreviewImage,
  PreviewButtomTextRow,
  PreviewMediaName,
  PreviewProgressBar,
  PreviewProgressBarInsert,
  SpinnerWrapper,
  Wrapper,
} from './styled';

export interface CommonProps {
  readonly mediaName?: string;
  readonly dataURI?: string;
  readonly dimensions?: CardDimensions;
  readonly selected?: boolean;
  readonly progress?: number;
  readonly error?: string;
  readonly onRetry?: () => void;
}

export interface CardViewProps extends CommonProps {
  readonly mediaType?: MediaType;
  readonly fileSize?: string;

  readonly status: CardStatus;

  readonly resizeMode?: ImageResizeMode;

  readonly disableOverlay?: boolean;
  readonly selectable?: boolean;

  readonly actions?: Array<CardAction>;
}

export interface ActionButton {
  icon: React.ReactNode;
  handler: () => void;
}

export interface CardViewControlledProps extends CommonProps {
  readonly withMetadata?: boolean;
  readonly withBlanket?: boolean;
  readonly withCancelButton?: boolean;
  readonly withProcessing?: boolean;
  readonly isProcessing?: boolean;
  readonly onCancel?: () => {};
  readonly isHovered?: boolean;
  readonly actionButtons?: Array<ActionButton>;
}

/**
 * Very dumb view component that has almost zero domain knowledge and complete zero state
 */
export class CardViewControlled extends React.Component<
  CardViewControlledProps
> {
  static defaultProps: Partial<CardViewProps> = {
    dimensions: {
      width: 180,
      height: 120,
    },
  };

  private renderPreviewBottomPart() {
    const {
      withMetadata = false,
      withProcessing = false,
      error,
      progress = -1,
      onRetry,
    } = this.props;

    if (withMetadata) {
      return null;
    }

    const progressBarStyle = { width: `${progress * 100}%` };
    if (progress >= 0) {
      return (
        <PreviewProgressBar>
          <PreviewProgressBarInsert style={progressBarStyle} />
        </PreviewProgressBar>
      );
    }
    if (error) {
      return (
        <PreviewButtomTextRow>
          <ErrorIcon
            primaryColor={colors.R300}
            secondaryColor={colors.N0}
            label="error"
            size="medium"
          />
          <span>{error}</span>
          {onRetry ? (
            <Button appearance="subtle-link" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </PreviewButtomTextRow>
      );
    }
    if (withProcessing) {
      return (
        <PreviewButtomTextRow>
          <SpinnerWrapper>
            <Spinner invertColor={true} size="small" />
          </SpinnerWrapper>
          <span>processing...</span>
        </PreviewButtomTextRow>
      );
    }

    return null;
  }

  private renderBlanket() {
    const { withBlanket = false } = this.props;

    if (withBlanket) {
      return <Blanket />;
    }
    return null;
  }

  private renderCancelButton() {
    const {
      withCancelButton = false,
      isHovered = false,
      onCancel = () => {},
    } = this.props;

    if (withCancelButton) {
      const iconColor = isHovered ? colors.N500 : colors.N0;
      const crossIcon = (
        <EditorCloseIcon primaryColor={iconColor} label="Cancel" />
      );
      return (
        <ActionsWrapper isHoverState={isHovered}>
          <Button onClick={onCancel} iconAfter={crossIcon} />
        </ActionsWrapper>
      );
    }

    return null;
  }

  private renderActionButtons() {
    const { isHovered = false, actionButtons = [] } = this.props;

    if (actionButtons.length > 0 && isHovered) {
      const buttons = actionButtons.map((actionButton, index) => (
        <Button
          key={index}
          onClick={actionButton.handler}
          iconAfter={actionButton.icon}
        />
      ));
      return <ActionsWrapper isHoverState={true}>{buttons}</ActionsWrapper>;
    }

    return null;
  }

  private renderTopButtons() {
    const { withCancelButton = false, actionButtons = [] } = this.props;
    if (withCancelButton) {
      return this.renderCancelButton();
    } else if (actionButtons.length > 0) {
      return this.renderActionButtons();
    }

    return null;
  }

  private renderPreviewMediaName() {
    const { mediaName } = this.props;

    if (mediaName) {
      return <PreviewMediaName>{mediaName}</PreviewMediaName>;
    }

    return null;
  }

  private renderImage() {
    const { dataURI } = this.props;

    // TODO here we can if/else into preview vs grid image display
    return <PreviewImage src={dataURI} />;
  }

  render() {
    const { dimensions, selected = false } = this.props;

    return (
      <Wrapper dimensions={dimensions} selected={selected}>
        {this.renderImage()}
        {this.renderBlanket()}
        {this.renderTopButtons()}
        {this.renderPreviewMediaName()}
        {this.renderPreviewBottomPart()}
      </Wrapper>
    );
  }
}

/**
 * Smarter component that has some internal state like "isHover"
 */
export default class extends React.Component<CardViewProps> {
  render() {
    // TODO here we assemble all the public/client props into values for props like
    // readonly withMetadata?: boolean;
    //   readonly withBlanket?: boolean;
    //   readonly withCancelButton?: boolean;
    //   readonly withProcessing?: boolean;
    return <CardViewControlled withMetadata={true} />;
  }
}
