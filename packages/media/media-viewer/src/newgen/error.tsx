import * as React from 'react';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { ErrorMessageWrapper, ErrorImage } from './styled';
import { FileState } from '@atlaskit/media-core';
import { messages as i18nMessages } from '@atlaskit/media-ui';
import { cannotViewFile, errorLoadingFile } from './error-images';

type MessagesType<Key extends string> = { [k in Key]: ReactNode };

export type ErrorName =
  | 'previewFailed'
  | 'metadataFailed'
  | 'unsupported'
  | 'idNotFound'
  | 'noPDFArtifactsFound';

export type Props = Readonly<{
  error: MediaViewerError;
  children?: ReactNode;
}>;

// TODO [i18n]
const errorLoadingFileImage = (
  <ErrorImage src={errorLoadingFile} alt="Error loading file" />
);
// TODO [i18n]
const cannotViewFileImage = (
  <ErrorImage src={cannotViewFile} alt="Error generating preview" />
);

const messages: MessagesType<ErrorName> = {
  metadataFailed: (
    <div>
      {errorLoadingFileImage}
      <p>
        <FormattedMessage {...i18nMessages.something_went_wrong} />
      </p>
      <p>
        <FormattedMessage {...i18nMessages.might_be_a_hiccup} />
      </p>
    </div>
  ),

  previewFailed: (
    <div>
      {cannotViewFileImage}
      <p>
        <FormattedMessage {...i18nMessages.couldnt_generate_preview} />
      </p>
    </div>
  ),

  unsupported: (
    <div>
      {cannotViewFileImage}
      <p>
        <FormattedMessage {...i18nMessages.cant_preview_file_type} />
      </p>
    </div>
  ),

  idNotFound: (
    <div>
      {errorLoadingFileImage}
      <p>
        <FormattedMessage {...i18nMessages.item_not_found_in_list} />
      </p>
    </div>
  ),

  noPDFArtifactsFound: (
    <div>
      {cannotViewFileImage}
      <p>
        <FormattedMessage {...i18nMessages.no_pdf_artifacts} />
      </p>
    </div>
  ),
};

export class MediaViewerError {
  constructor(
    readonly errorName: ErrorName,
    readonly file?: FileState,
    readonly innerError?: Error,
  ) {}
}

export const createError = (
  name: ErrorName,
  innerError?: Error,
  file?: FileState,
): MediaViewerError => {
  return new MediaViewerError(name, file, innerError);
};

export class ErrorMessage extends React.Component<Props, {}> {
  render() {
    const errorMessage = messages[this.props.error.errorName];
    return (
      <ErrorMessageWrapper>
        {errorMessage}
        {this.props.children}
      </ErrorMessageWrapper>
    );
  }
}
