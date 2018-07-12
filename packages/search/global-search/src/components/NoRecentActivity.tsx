import * as React from 'react';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { akTypographyMixins } from '@atlaskit/util-shared-styles';
import MaginfyingGlassImage from '../assets/MagnifyingGlassImage';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${gridSize() * 4}px 0;
`;

const ImageWrapper = styled.div`
  width: 20%;
  height: 20%;
  margin-top: ${gridSize() * 11}px;
`;

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: ${gridSize() * 3}px;
`;

const Title = styled.h4`
  ${akTypographyMixins.h600};
  margin-bottom: ${gridSize() * 2}px;
  margin-top: 0;
`;

export interface Props {
  advancedSearchUrl: string;
}

const Text = ({ url }) => (
  <TextWrapper>
    <Title>
      <FormattedMessage id="global-search.no-recent-activity-title" />
    </Title>
    <div>
      <FormattedHTMLMessage
        id="global-search.no-recent-activity-body"
        values={{ url: url }}
      />
    </div>
  </TextWrapper>
);
export default class NoRecentActivity extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <ImageWrapper>
          <MaginfyingGlassImage />
        </ImageWrapper>
        <Text url={this.props.advancedSearchUrl} />
      </Wrapper>
    );
  }
}
