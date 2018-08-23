import * as React from 'react';
import { Context } from '@atlaskit/media-core';
import { FileIdentifier } from '@atlaskit/media-card';
import { EditorView } from './editorView/editorView';

export interface SmartMediaEditorProps {
  identifier: FileIdentifier;
  context: Context;
  onFinish: (id: string) => void;
}

export class SmartMediaEditor extends React.Component<SmartMediaEditorProps> {
  render() {
    return null;
  }
}
