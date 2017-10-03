// @flow
import React from 'react';

import Chrome from './Chrome';
import Content from './Content';
import Remove from './Remove';

import Before from '../styled/Before';
import Container from '../styled/Container';
import type { appearanceType, tagColor, ReactElement } from '../types';

const colorList = [
  'standard',
  'green',
  'blue',
  'red',
  'purple',
  'grey',
  'teal',
  'yellow',
  'greenLight',
  'blueLight',
  'redLight',
  'purpleLight',
  'greyLight',
  'tealLight',
  'yellowLight',
];

type Props = {
  /** Set whether tags should be rounded. */
  appearance?: appearanceType,
  /** The color theme to apply, setting both background and text color. */
  color?: tagColor,
  /** Component to be rendered before the Tag. */
  elemBefore?: ReactElement,
  /** Text to be displayed in the tag. */
  text: string,
  /** uri or path. If provided, the tag will be a link.  */
  href?: string,
  /** Text display as the aria-label for remove text. Setting this makes the
  tag removable. */
  removeButtonText?: string,
  /** Handler to be called before the tag is removed. If it does not return a
  truthy value, the tag will not be removed. */
  onBeforeRemoveAction?: () => boolean,
  /** Handler to be called after tag is removed. Called with the string 'Post
  Removal Hook'. */
  onAfterRemoveAction?: (text: string) => mixed,
};

type State = {
  isRemoving: bool,
  isRemoved: bool,
  markedForRemoval: bool,
  isFocused: bool,
}

export default class Tag extends React.PureComponent<Props, State> {
  static defaultProps = {
    color: 'standard',
    appearance: 'default',
    elemBefore: null,
    onAfterRemoveAction: () => {},
    onBeforeRemoveAction: () => true,
  }

  state = {
    isRemoving: false,
    isRemoved: false,
    markedForRemoval: false,
    isFocused: false,
  };

  handleRemoveRequest = () => {
    if (this.props.onBeforeRemoveAction && this.props.onBeforeRemoveAction()) {
      this.setState({ isRemoving: true, isRemoved: false });
    }
  }

  handleRemoveComplete = () => {
    if (this.props.onAfterRemoveAction) {
      this.props.onAfterRemoveAction(this.props.text);
    }
    this.setState({ isRemoving: false, isRemoved: true });
  }

  handleHoverChange = (hoverState: boolean) => {
    this.setState({ markedForRemoval: hoverState });
  }

  handleFocusChange = (focusState: boolean) => {
    this.setState({ isFocused: focusState });
  }

  render() {
    const { isFocused, isRemoved, isRemoving, markedForRemoval } = this.state;
    const { appearance, elemBefore, href, removeButtonText, text, color } = this.props;

    const safeColor = colorList.includes(color) ? color : 'standard';

    const isRemovable = Boolean(removeButtonText);
    const isRounded = appearance === 'rounded';
    const styled = {
      isFocused,
      isRemovable,
      isRemoved,
      isRemoving,
      isRounded,
      markedForRemoval,
      color: safeColor,
    };
    const onAnimationEnd = () => isRemoving && this.handleRemoveComplete();

    return (
      <Container {...styled} onAnimationEnd={onAnimationEnd}>
        <Chrome {...styled} isLink={!!href} onFocusChange={this.handleFocusChange}>
          {elemBefore ? (
            <Before>{elemBefore}</Before>
          ) : null}
          <Content {...styled} href={href}>
            {text}
          </Content>
          {isRemovable ? (
            <Remove
              {...styled}
              onHoverChange={this.handleHoverChange}
              onRemoveAction={this.handleRemoveRequest}
              removeText={removeButtonText}
            />
          ) : null}
        </Chrome>
      </Container>
    );
  }
}
