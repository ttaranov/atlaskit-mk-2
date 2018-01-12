// @flow

import React, { Component, type Node } from 'react';
import {
  AvatarSectionDiv,
  Container,
  ContentSectionDiv,
  Highlight,
  NestedCommentsDiv,
} from '../styled/LayoutStyles';

type Props = {
  /** The element to display as the Comment avatar - generally an Atlaskit Avatar */
  avatar?: Node,
  /** Nested comments to render */
  children?: Node,
  /** The main content of the Comment */
  content?: Node,
  /** Whether this comment should appear highlighted */
  highlighted?: boolean,
};

export default class Layout extends Component<Props> {
  render() {
    const { avatar, children, content, highlighted } = this.props;

    const AvatarSection = () =>
      avatar ? <AvatarSectionDiv>{avatar}</AvatarSectionDiv> : null;

    const NestedComments = () =>
      children ? <NestedCommentsDiv>{children}</NestedCommentsDiv> : null;

    return (
      <Container>
        <AvatarSection />
        <ContentSectionDiv>{content}</ContentSectionDiv>
        <NestedComments />
        {highlighted && <Highlight />}
      </Container>
    );
  }
}
