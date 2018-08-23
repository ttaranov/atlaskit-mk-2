import * as React from 'react';
import { Context } from '@atlaskit/media-core';

export interface SmartMediaEditorProps {
  id: string;
  context: Context;
  onFinish: (id: string) => void;
}

export class SmartMediaEditor extends React.Component<SmartMediaEditorProps> {
  render() {
    return null;
  }
}
