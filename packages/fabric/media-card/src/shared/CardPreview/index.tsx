import * as React from 'react';
import ImageIcon from '@atlaskit/icon/glyph/image';
import { Wrapper, ImageWrapper, IconWrapper } from './styled';
import NoImageIcon from './NoImageIcon';

export interface CardPreviewProps {
  url?: string;
}

export interface CardPreviewState {
  error?: boolean;
}

export default class CardPreview extends React.Component<CardPreviewProps> {
  state = {
    error: false,
  };

  renderContent() {
    const { url } = this.props;
    const { error } = this.state;

    if (error || !url) {
      return (
        <IconWrapper>
          <NoImageIcon />
        </IconWrapper>
      );
    }

    return [
      <IconWrapper key="placeholder">
        <ImageIcon size="xlarge" label="loading" />
      </IconWrapper>,
      <ImageWrapper key="image" url={url} />,
    ];
  }

  tryAndLoadUrl() {
    const { url } = this.props;

    if (!url) {
      return;
    }

    this.setState({ error: false }, () => {
      const img = new Image();
      img.src = url;
      img.onerror = () => {
        this.setState({ error: true });
      };
    });
  }

  componentDidMount() {
    this.tryAndLoadUrl();
  }

  componentDidUpdate(prevProps: CardPreviewProps) {
    const { url: prevURL } = prevProps;
    const { url: nextURL } = this.props;

    if (prevURL !== nextURL) {
      this.tryAndLoadUrl();
    }
  }

  render() {
    return <Wrapper>{this.renderContent()}</Wrapper>;
  }
}
