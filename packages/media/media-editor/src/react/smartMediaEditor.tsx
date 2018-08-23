import * as React from 'react';
import { Context, UploadableFile } from '@atlaskit/media-core';
import { FileIdentifier } from '@atlaskit/media-card';
import { Shortcut } from '@atlaskit/media-ui';
import Spinner from '@atlaskit/spinner';
import { EditorView } from './editorView/editorView';
import { Blanket } from './styled';
import { Subscription } from 'rxjs/Subscription';

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  context: Context;
  onUploadStart: (
    deferredIdentifier: Promise<FileIdentifier>,
    preview: string,
  ) => void;
  onFinish: (identifier: FileIdentifier, preview?: string) => void;
}

export interface SmartMediaEditorState {
  imageUrl?: string;
}

export class SmartMediaEditor extends React.Component<
  SmartMediaEditorProps,
  SmartMediaEditorState
> {
  fileName: string;
  state: SmartMediaEditorState = {};
  getFileSubscription?: Subscription;
  uploadFileSubscription?: Subscription;

  componentDidMount() {
    const { identifier } = this.props;

    this.getFile(identifier);
  }

  componentWillUnmount() {
    // const { getFileSubscription, uploadFileSubscription } = this;
    // getFileSubscription && getFileSubscription.unsubscribe();
    // uploadFileSubscription && uploadFileSubscription.unsubscribe();
  }

  getFile = (identifier: FileIdentifier) => {
    const { context } = this.props;
    const { id, collectionName } = identifier;

    this.getFileSubscription = context
      .getFile(id, { collectionName })
      .subscribe({
        next: state => {
          if (state.status === 'processed') {
            const { name } = state;

            this.fileName = name;
            // we can only ask for the image once the file is processed
            this.setImageUrl(identifier);
            this.getFileSubscription && this.getFileSubscription.unsubscribe();
          }
        },
      });
  };

  setImageUrl = async (identifier: FileIdentifier) => {
    const { context } = this.props;
    const imageUrl = await context.getImageUrl(identifier.id, {
      collection: identifier.collectionName,
    });

    this.setState({
      imageUrl,
    });
  };

  onSave = (imageData: string) => {
    const { fileName } = this;
    const { context, identifier, onUploadStart, onFinish } = this.props;
    const { collectionName } = identifier;
    const uploadableFile: UploadableFile = {
      content: imageData,
      collection: collectionName,
      name: fileName,
    };
    const deferredIdentifier = new Promise<FileIdentifier>(resolve => {
      this.uploadFileSubscription = context
        .uploadFile(uploadableFile)
        .subscribe({
          next(state) {
            if (state.status === 'processing') {
              const { id } = state;
              const identifier: FileIdentifier = {
                id,
                mediaItemType: 'file',
                collectionName,
              };

              resolve(identifier);
              onFinish(identifier, imageData);
              this.uploadFileSubscription &&
                this.uploadFileSubscription.unsubscribe();
            }
          },
        });
    });

    onUploadStart(deferredIdentifier, imageData);
  };

  onCancel = () => {
    const { onFinish, identifier } = this.props;

    onFinish(identifier);
  };

  onError = () => {};

  renderLoading = () => {
    return <Spinner />;
  };

  renderEditor = (imageUrl: string) => {
    return (
      <EditorView
        imageUrl={imageUrl}
        onSave={this.onSave}
        onCancel={this.onCancel}
        onError={this.onError}
      />
    );
  };

  render() {
    const { imageUrl } = this.state;
    const content = imageUrl
      ? this.renderEditor(imageUrl)
      : this.renderLoading();

    return (
      <Blanket>
        <Shortcut keyCode={27} handler={this.onCancel} />
        {content}
      </Blanket>
    );
  }
}
