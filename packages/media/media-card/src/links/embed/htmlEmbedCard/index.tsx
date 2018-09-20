import * as React from 'react';
import * as uuid from 'uuid/v1';
import { getCSSUnitValue } from '../../../utils/getCSSUnitValue';
import { Iframe } from './styled';

export interface HTMLEmbedCardProps {
  html: string;
}

export interface HTMLEmbedCardState {
  width?: number;
  height?: number;
  isLoading: boolean;
}

export class HTMLEmbedCard extends React.Component<
  HTMLEmbedCardProps,
  HTMLEmbedCardState
> {
  // this unique id is used to filter resize messages so that we only update the size of the iframe
  // mounted by this component
  private id: number = uuid();

  private iframe?: HTMLIFrameElement;

  state: HTMLEmbedCardState = {
    isLoading: true,
  };

  handleIframeMount = (element: HTMLIFrameElement) => {
    this.iframe = element;
  };

  handleIframeLoad = () => {
    const { id, iframe } = this;
    const { html } = this.props;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        {
          type: 'embed',
          id,
          html,
        },
        '*',
      );
    }
  };

  handleMessage = (event: MessageEvent) => {
    const { iframe } = this;

    if (!iframe) {
      return;
    }

    if (!event.data || event.data.type !== 'embed:resize') {
      return;
    }

    const { id, width, height } = event.data;

    // only resize the iframe when the message is for the iframe we're rendering
    if (id !== this.id) {
      return;
    }

    this.setState({
      width,
      height,
      isLoading: false,
    });
  };

  componentDidMount() {
    window.addEventListener('message', this.handleMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handleMessage);
  }

  // using inline-styles instead of props on a styled-component for perf reasons since the iframe
  // (which we don't control) could trigger frequent size changes and the runtime overhead of
  // generating and applying new classes may affect perf if it happens frequently enough.
  // See https://github.com/styled-components/styled-components/issues/134
  get style(): React.CSSProperties {
    const { width, height } = this.state;
    return {
      width: width ? getCSSUnitValue(width) : '',
      height: height ? getCSSUnitValue(height) : '',
    };
  }

  render() {
    const { isLoading } = this.state;
    return (
      <Iframe
        innerRef={this.handleIframeMount}
        onLoad={this.handleIframeLoad}
        style={this.style}
        isLoading={isLoading}
        allowFullScreen={true}
        src="https://media-embed-iframe.prod.atl-paas.net/1.0.0"
      />
    );
  }
}
