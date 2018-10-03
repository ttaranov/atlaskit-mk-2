import * as React from 'react';
import { ReactNode } from 'react';
import { ErrorMessageWrapper, ErrorImage } from './styled';
import { FileState } from '@atlaskit/media-core';
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

const errorLoadingFileImage = (
  <ErrorImage src={errorLoadingFile} alt="Error loading file" />
);
const cannotViewFileImage = (
  <ErrorImage src={cannotViewFile} alt="Error generating preview" />
);

const messages: MessagesType<ErrorName> = {
  metadataFailed: (
    <div>
      {errorLoadingFileImage}
      <p>Something went wrong.</p>
      <p>It might just be a hiccup.</p>
    </div>
  ),

  previewFailed: (
    <div>
      {cannotViewFileImage}
      <p>We couldn't generate a preview for this file.</p>
    </div>
  ),

  unsupported: (
    <div>
      {cannotViewFileImage}
      <p>We can't preview this file type.</p>
    </div>
  ),

  idNotFound: (
    <div>
      {errorLoadingFileImage}
      <p>The selected item was not found on the list.</p>
    </div>
  ),

  noPDFArtifactsFound: (
    <div>
      {cannotViewFileImage}
      <p>No PDF artifacts found for this file.</p>
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
