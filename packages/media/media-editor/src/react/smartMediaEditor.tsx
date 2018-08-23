import * as React from 'react';
import { Context, UploadableFile } from '@atlaskit/media-core';
import { FileIdentifier } from '@atlaskit/media-card';
import { EditorView } from './editorView/editorView';
import { Blanket } from './styled';

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  context: Context;
  onFinish: (identifier: FileIdentifier) => void;
}

export interface SmartMediaEditorState {
  imageUrl?: string;
}

// TODO This is copy paste from media-viewer
export interface ShortcutProps {
  keyCode: number;
  handler: () => void;
}

export class Shortcut extends React.Component<ShortcutProps, {}> {
  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.release();
  }

  render() {
    return null;
  }

  private keyHandler = (e: KeyboardEvent) => {
    const { keyCode, handler } = this.props;
    if (e.keyCode === keyCode) {
      handler();
    }
  };

  private init = () => {
    document.addEventListener('keydown', this.keyHandler);
  };

  private release = () => {
    document.removeEventListener('keydown', this.keyHandler);
  };
}

export class SmartMediaEditor extends React.Component<
  SmartMediaEditorProps,
  SmartMediaEditorState
> {
  fileName: string;
  state: SmartMediaEditorState = {};

  componentDidMount() {
    const { identifier } = this.props;

    this.getFile(identifier);
  }

  getFile = (identifier: FileIdentifier) => {
    const { context } = this.props;
    const { id, collectionName } = identifier;
    // TODO: unsubscribe when unmounting
    const subscription = context.getFile(id, { collectionName }).subscribe({
      next: state => {
        if (state.status === 'processed') {
          const { name } = state;

          this.fileName = name;
          // we can only ask for the image once the file is processed
          this.setImageUrl(identifier);
          subscription.unsubscribe();
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

    const subscription = context.uploadFile(uploadableFile).subscribe({
      next(state) {
        if (state.status === 'processing') {
          const { id } = state;
          const identifier: FileIdentifier = {
            id,
            mediaItemType: 'file',
            collectionName,
          };

          onFinish(identifier);
          subscription.unsubscribe();
        }
      },
    });
  };

  onCancel = () => {
    this.props.onFinish(this.props.identifier);
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
