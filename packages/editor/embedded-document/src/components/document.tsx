import * as React from 'react';
import { Component } from 'react';
import {
  Editor,
  EditorContext,
  WithEditorActions,
} from '@atlaskit/editor-core';
import { ReactRenderer } from '@atlaskit/renderer';
import { Props as BaseProps } from '../context/embedded-document';
import { Mode } from '../context/context';
import { Document as DocumentModel } from '../model';

export interface Props extends BaseProps {
  doc?: DocumentModel;
  isLoading?: boolean;
  hasError?: boolean;

  mode: Mode;
}

const emptyDoc = '{ "type": "doc", "version": 1, "content": [] }';

export default class Document extends Component<Props> {
  private renderToolbar() {
    const { mode, renderToolbar } = this.props;

    if (renderToolbar) {
      return (
        <WithEditorActions render={actions => renderToolbar(mode, actions)} />
      );
    }
  }

  private renderTitle() {
    const { renderTitle, mode, doc } = this.props;

    if (renderTitle) {
      return renderTitle(mode, doc);
    }
  }

  private renderEditor() {
    const { doc } = this.props;
    const { body = emptyDoc } = doc || {};

    return (
      <EditorContext>
        <Editor
          appearance="full-page"
          placeholder="Write something..."
          defaultValue={body}
          primaryToolbarComponents={this.renderToolbar()}
          contentComponents={this.renderTitle()}
        />
      </EditorContext>
    );
  }

  render() {
    const { doc, isLoading, hasError, mode } = this.props;

    if (hasError) {
      return <div>Something went wrong 😔</div>;
    }

    if (isLoading) {
      return <div>Loading document... 🐨</div>;
    }

    switch (mode) {
      case 'create':
      case 'edit':
        return this.renderEditor();

      default:
        const { body = emptyDoc } = doc || {};
        return <ReactRenderer document={JSON.parse(body)} />;
    }
  }
}
