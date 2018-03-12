import * as React from 'react';
import Button from '@atlaskit/button';
import WarningGlyph from '@atlaskit/icon/glyph/warning';
import { akColorY400 } from '@atlaskit/util-shared-styles';
import { CardFrame } from '../CardFrame';
import { linkErrorIcon } from './icons';
import {
  ErrorContainer,
  ErrorMessage,
  ErrorImage,
  ErrorWrapper,
} from './styled';

export interface ErrorCardProps {
  hasPreview: boolean;
  minWidth: number;
  maxWidth: number;
  onRetry?: () => void;
}

export class ErrorCard extends React.Component<ErrorCardProps> {
  render() {
    const { hasPreview, minWidth, maxWidth, onRetry } = this.props;

    const icon = (
      <WarningGlyph label="error" size="small" primaryColor={akColorY400} />
    );

    const retryButton = onRetry ? (
      <Button onClick={onRetry}>Try again</Button>
    ) : null;

    return (
      <CardFrame icon={icon} text="" minWidth={minWidth} maxWidth={maxWidth}>
        <ErrorWrapper hasPreview={hasPreview}>
          <ErrorContainer hasPreview={hasPreview}>
            {hasPreview ? <ErrorImage src={linkErrorIcon} alt="Error" /> : null}
            <ErrorMessage hasPreview={hasPreview}>
              We stumbled a bit here.
            </ErrorMessage>
            {retryButton}
          </ErrorContainer>
        </ErrorWrapper>
      </CardFrame>
    );
  }
}
