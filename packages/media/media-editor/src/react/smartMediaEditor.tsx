import * as React from 'react';
import { Context, UploadableFile } from '@atlaskit/media-core';
import { FileIdentifier } from '@atlaskit/media-card';
import { EditorView } from './editorView/editorView';

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
  state: SmartMediaEditorState = {};

  componentDidMount() {
    const { identifier } = this.props;

    this.setImageUrl(identifier);
  }

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
    const { context, identifier, onFinish } = this.props;
    const uploadableFile: UploadableFile = {
      content: imageUrl,
      collection: identifier.collectionName,
      name: 'hector_rocks.jpeg', // TODO: get the real file name from /file/id endpoint
    };

    context.uploadFile(uploadableFile).subscribe({
      next(state) {
        console.log(state);
      },
    });
  };

  onCancel = () => {};

  onError = () => {};

  renderEditor = () => {
    const { imageUrl } = this.state;
    if (!imageUrl) {
      return <div>loading...</div>;
    }

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
    return this.renderEditor();
  }
}
