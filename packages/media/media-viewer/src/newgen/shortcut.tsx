import * as React from 'react';

export interface Props {
  keyCode: string;
  handler: () => void;
}

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

  private keyHandler = e => {
    const { keyCode, handler } = this.props;
    if (e.key === keyCode) {
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
