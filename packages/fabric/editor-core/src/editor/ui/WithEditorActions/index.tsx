import * as React from 'react';
import { PropTypes } from 'react';
import EditorActions from '../../actions';

export interface WithEditorActionsProps {
  render(actions: EditorActions): React.ReactElement<any>;
}

export default class WithEditorActions extends React.Component<WithEditorActionsProps, any> {
  static contextTypes = {
    editorActions: PropTypes.object.isRequired
  };

  context: {
    editorActions: EditorActions;
  };

  render() {
    return this.props.render(this.context.editorActions);
  }
}
