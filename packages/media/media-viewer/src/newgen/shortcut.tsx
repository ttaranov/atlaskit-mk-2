import * as React from 'react';

export interface Props {
  keyCode: number;
  handler: () => void;
}

export const keyCodes = {
  space: 32,
  m: 77,
};

export class Shortcut extends React.Component<Props, {}> {
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
