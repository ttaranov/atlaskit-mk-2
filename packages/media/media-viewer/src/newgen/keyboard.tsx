import * as React from 'react';
import { Action } from './domain';

export interface Props {
  dispatcher: (action: Action) => void;
}

const ESCAPE_KEY = 27;
const ARROW_RIGHT = 39;
const ARROW_LEFT = 37;

export class KeyboardShortcuts extends React.Component<Props, {}> {

  componentDidMount() {
    document.addEventListener('keydown', this._handleKeyDown);
  }

  componentWillMount() {
    document.removeEventListener('keydown', this._handleKeyDown);
  }

  _handleKeyDown = (event) => {
    const { dispatcher } = this.props
    switch( event.keyCode ) {
      case ESCAPE_KEY:
        return dispatcher({
          type: 'CLOSE'
        });
      case ARROW_LEFT:
        return dispatcher({
          type: 'NAVIGATION_EVENT',
          data: 'prev'
        });
      case ARROW_RIGHT:
        return dispatcher({
          type: 'NAVIGATION_EVENT',
          data: 'next'
        });
    }
  }

  render() { return null; }
}