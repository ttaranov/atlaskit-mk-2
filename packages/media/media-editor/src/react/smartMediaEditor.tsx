import * as React from 'react';
import { Context, UploadableFile } from '@atlaskit/media-core';
import { FileIdentifier } from '@atlaskit/media-card';
import { Shortcut } from '@atlaskit/media-ui';
import { EditorView } from './editorView/editorView';
import { Blanket } from './styled';
import { Subscription } from 'rxjs/Subscription';

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  context: Context;
  onFinish: (identifier: FileIdentifier) => void;
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
    const { getFileSubscription, uploadFileSubscription } = this;

    getFileSubscription && getFileSubscription.unsubscribe();
    uploadFileSubscription && uploadFileSubscription.unsubscribe();
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

  onSave = (imageUrl: string) => {
    const { fileName } = this;
    const { context, identifier, onFinish } = this.props;
    const { collectionName } = identifier;
    const uploadableFile: UploadableFile = {
      content: imageUrl,
      collection: collectionName,
      name: fileName,
    };

    this.uploadFileSubscription = context.uploadFile(uploadableFile).subscribe({
      next(state) {
        if (state.status === 'processing') {
          const { id } = state;
          const identifier: FileIdentifier = {
            id,
            mediaItemType: 'file',
            collectionName,
          };

          onFinish(identifier);
          this.uploadFileSubscription &&
            this.uploadFileSubscription.unsubscribe();
        }
      },
    });
  };

  onCancel = () => {
    const { onFinish, identifier } = this.props;

    onFinish(identifier);
  };

  onError = () => {};

  renderEditor = () => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      return <div>loading...</div>;
    }

    return (
      <Blanket>
        <Shortcut keyCode={27} handler={this.onCancel} />
        <EditorView
          imageUrl={imageUrl}
          onSave={this.onSave}
          onCancel={this.onCancel}
          onError={this.onError}
        />
      </Blanket>
    );
  };

  render() {
    return this.renderEditor();
  }
}
