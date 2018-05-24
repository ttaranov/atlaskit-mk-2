// @flow
import { Appearance } from '@atlaskit/theme';
import React, { Component, type Node, type ComponentType } from 'react';

import Chrome from '../Chrome';
import Content from '../Content';
import RemoveButton from '../RemoveButton';

import Before from './styledBefore';
import Container from './styledContainer';
import * as theme from '../theme';

import type { AppearanceType } from '../types';

type Props = {
  /** Set whether tags should be rounded. */
  appearance: AppearanceType,
  /** The color theme to apply, setting both background and text color. */
  color:
    | 'standard'
    | 'green'
    | 'blue'
    | 'red'
    | 'purple'
    | 'grey'
    | 'teal'
    | 'yellow'
    | 'greenLight'
    | 'blueLight'
    | 'redLight'
    | 'purpleLight'
    | 'greyLight'
    | 'tealLight'
    | 'yellowLight'
    | {},
  /** Component to be rendered before the Tag. */
  elemBefore?: Node,
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
  /* A link component to be used instead of our standard anchor. The styling of
  our link item will be applied to the link that is passed in. */
  linkComponent?: ComponentType<*>,
};

type State = {
  isRemoving: boolean,
  isRemoved: boolean,
  markedForRemoval: boolean,
  isFocused: boolean,
};

export default class Tag extends Component<Props, State> {
  static defaultProps = {
    color: 'standard',
    appearance: 'default',
    elemBefore: null,
    onAfterRemoveAction: () => {},
    onBeforeRemoveAction: () => true,
  };

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
  };

  handleRemoveComplete = () => {
    if (this.props.onAfterRemoveAction) {
      this.props.onAfterRemoveAction(this.props.text);
    }
    this.setState({ isRemoving: false, isRemoved: true });
  };

  handleHoverChange = (hoverState: boolean) => {
    this.setState({ markedForRemoval: hoverState });
  };

  handleFocusChange = (focusState: boolean) => {
    this.setState({ isFocused: focusState });
  };

  render() {
    const { isFocused, isRemoved, isRemoving, markedForRemoval } = this.state;

    // Should we pass color?
    const {
      appearance,
      elemBefore,
      href,
      removeButtonText,
      text,
      color,
      linkComponent,
    } = this.props;

    const isRemovable = Boolean(removeButtonText);
    const isRounded = appearance === 'rounded';
    // How to pass styled to styleProps
    const styled = {
      isFocused,
      isRemovable,
      isRemoved,
      isRemoving,
      isRounded,
      markedForRemoval,
      // color: safeColor,
    };
    const onAnimationEnd = () => isRemoving && this.handleRemoveComplete();

    return (
      <Appearance props={appearance} theme={theme}>
        {styleProps => (
          <Container {...styleProps} onAnimationEnd={onAnimationEnd}>
            <Chrome
              {...styleProps}
              isLink={!!href}
              onFocusChange={this.handleFocusChange}
            >
              {elemBefore ? <Before>{elemBefore}</Before> : null}
              <Content
                linkComponent={linkComponent}
                {...styleProps}
                href={href}
              >
                {text}
              </Content>
              {isRemovable ? (
                <RemoveButton
                  {...styleProps}
                  onHoverChange={this.handleHoverChange}
                  onRemoveAction={this.handleRemoveRequest}
                  removeText={removeButtonText}
                />
              ) : null}
            </Chrome>
          </Container>
        )}
      </Appearance>
    );
  }
}
