import * as React from 'react';
import { PureComponent } from 'react';
import Participants from './Participants';

import {
  AttributionWrapper,
  CardHeadingWrapper,
  ContentWrapper,
  ParticipantWrapper,
  Wrapper,
} from '../styled/Item';

import { Appearance, ContentRef, Participant } from '../types';
import { Placeholder } from '../styled/Placeholder';

export interface Props {
  icon: JSX.Element;
  children?: any;
  participants?: Participant[];
  appearance?: Appearance;
  contentRef?: ContentRef;
  placeholder?: string;
  showPlaceholder?: boolean;
  attribution?: string;
}

export default class Item extends PureComponent<Props, {}> {
  public static defaultProps: Partial<Props> = {
    appearance: 'inline',
  };

  private renderPlaceholder() {
    const { children, placeholder, showPlaceholder } = this.props;
    if (!showPlaceholder || !placeholder || children) {
      return null;
    }
    return <Placeholder contentEditable={false}>{placeholder}</Placeholder>;
  }

  renderParticipants() {
    const { appearance, participants = [] } = this.props;
    if (appearance === 'inline' || !participants.length) {
      return null;
    }
    return (
      <ParticipantWrapper>
        <Participants participants={participants} />
      </ParticipantWrapper>
    );
  }

  renderAttribution() {
    const { attribution } = this.props;

    if (!attribution) {
      return null;
    }

    return <AttributionWrapper>{attribution}</AttributionWrapper>;
  }

  renderCardAppearance() {
    const { appearance, contentRef, children, icon } = this.props;
    return (
      <Wrapper theme={{ appearance }}>
        <CardHeadingWrapper>
          {icon}
          {this.renderParticipants()}
          {this.renderPlaceholder()}
        </CardHeadingWrapper>
        <ContentWrapper innerRef={contentRef}>{children}</ContentWrapper>
        {this.renderAttribution()}
      </Wrapper>
    );
  }

  renderMessageAppearance() {
    const { appearance, contentRef, children, icon } = this.props;
    return (
      <Wrapper theme={{ appearance }}>
        {icon}
        {this.renderPlaceholder()}
        <ContentWrapper innerRef={contentRef}>{children}</ContentWrapper>
      </Wrapper>
    );
  }

  render() {
    const { appearance } = this.props;

    if (appearance === 'card') {
      return this.renderCardAppearance();
    }

    return this.renderMessageAppearance();
  }
}
