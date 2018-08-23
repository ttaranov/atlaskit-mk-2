import { ComponentClass } from 'react';
import { EditorViewProps } from '@atlaskit/media-editor';

export default (): Promise<ComponentClass<EditorViewProps>> =>
  import(/* webpackChunkName:"@atlaskit-internal_media-editor-view" */

  '@atlaskit/media-editor').then(module => module.EditorView);
