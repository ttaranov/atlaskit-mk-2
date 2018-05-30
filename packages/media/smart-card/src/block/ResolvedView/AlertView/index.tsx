import * as React from 'react';
import * as debounce from 'lodash.debounce';
import Button from '@atlaskit/button';
import { Ellipsify } from '@atlaskit/media-ui';
import { Wrapper } from './styled';

const contentWidthWhenCardIs400px = 384;

export interface AlertViewProps {
  type: 'success' | 'failure';
  message?: string;
  onRetry: () => void;
  onDismis: () => void;
  style?: {};
}

export interface AlertViewState {
  width?: number;
}

export default class AlertView extends React.Component<
  AlertViewProps,
  AlertViewState
> {
  state: AlertViewState = {};

  el: HTMLDivElement;

  handleRetry = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onRetry } = this.props;
    if (onRetry) {
      onRetry();
    }
  };

  handleDismis = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const { onDismis } = this.props;
    if (onDismis) {
      onDismis();
    }
  };

  handleMount = (el: HTMLDivElement) => {
    this.el = el;
  };

  handleResize = debounce(() => {
    if (this.el) {
      this.setState({ width: this.el.clientWidth });
    }
  }, 250);

  componentDidMount() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnMount() {
    window.removeEventListener('resize', this.handleResize);
  }

  renderContent() {
    const { type, message } = this.props;
    const { width } = this.state;

    const text = type === 'success' ? message : 'Something went wrong.';

    if (width && width < contentWidthWhenCardIs400px) {
      return <Ellipsify text={text} lines={2} inline />;
    } else {
      return <Ellipsify text={text} lines={1} inline />;
    }
  }

  renderRetryAndCancel() {
    const { type } = this.props;

    if (type === 'success') {
      return null;
    }

    return (
      <>
        <Button
          appearance="link"
          spacing="none"
          onClick={this.handleRetry as () => void}
        >
          Try again
        </Button>{' '}
        or{' '}
        <Button
          appearance="link"
          spacing="none"
          onClick={this.handleDismis as () => void}
        >
          cancel
        </Button>.
      </>
    );
  }

  render() {
    const { type, style } = this.props;
    return (
      <Wrapper innerRef={this.handleMount} type={type} style={style}>
        {this.renderContent()} {this.renderRetryAndCancel()}
      </Wrapper>
    );
  }
}
