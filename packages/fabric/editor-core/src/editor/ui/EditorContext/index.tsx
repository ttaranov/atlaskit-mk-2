import * as React from 'react';
import { PropTypes } from 'react';
import EditorActions from '../../actions';

export default class EditorContext extends React.Component<any, any> {
  static childContextTypes = {
    editorActions: PropTypes.object
  };

  private editorActions: EditorActions;

  constructor(props) {
    super(props);
    this.editorActions = new EditorActions();
  }

  getChildContext() {
    return {
      editorActions: this.editorActions
    };
  }

  render() {
    return this.props.children;
  }
}
