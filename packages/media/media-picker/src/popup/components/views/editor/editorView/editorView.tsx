import {
  EditorView,
  EditorViewStateProps,
  EditorViewOwnProps,
} from '@atlaskit/media-editor';
import { connect } from 'react-redux';
// @ts-ignore: unused variable
import { ComponentClass } from 'react';
import { State } from '../../../../domain';

export { EditorView } from '@atlaskit/media-editor';

export default connect<EditorViewStateProps, {}, EditorViewOwnProps>(
  ({ editorData }: State) => ({
    imageUrl: editorData ? editorData.imageUrl || '' : '',
  }),
)(EditorView);
