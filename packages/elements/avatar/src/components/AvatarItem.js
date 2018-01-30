// @flow
import React, { cloneElement, Component } from 'react';

import { propsOmittedFromClickData } from './constants';
import { omit, warn } from '../utils';
import {
  getBackgroundColor,
  Content,
  TextWithContent,
  PrimaryText,
  AdditionalContent,
  SecondaryText,
} from '../styled/AvatarItem';
import { getProps, getStyledAvatarItem } from '../helpers';
import { withPseudoState } from '../hoc';
import type {
  AvatarClickType,
  ChildrenType,
  ComponentType,
  ElementType,
} from '../types';

/* eslint-disable react/no-unused-prop-types */
type Props = {
  avatar: ElementType,
  /** Change background color */
  backgroundColor?: string,
  /** A custom component to use instead of the default span. */
  component?: ComponentType,
  /** Provides a url for avatars being used as a link. */
  href?: string,
  /** Change the style to indicate the item is active. */
  isActive?: boolean,
  /** Change the style to indicate the item is disabled. */
  isDisabled?: boolean,
  /** Change the style to indicate the item is focused. */
  isFocus?: boolean,
  /** Change the style to indicate the item is hovered. */
  isHover?: boolean,
  /** Change the style to indicate the item is selected. */
  isSelected?: boolean,
  /** Handler to be called on click. */
  onClick?: AvatarClickType,
  /** PrimaryText text */
  primaryText?: string,
  /** SecondaryText text */
  secondaryText?: string,
  /** Pass target down to the anchor, if href is provided. */
  target?: '_blank' | '_self' | '_top' | '_parent',
  /** Whether or not overflowing primary and secondary text is truncated */
  enableTextTruncate?: boolean,
  /** Indicate where to place the provided children. */
  childrenPlacement?:
    | 'content'
    | 'beforePrimaryText'
    | 'afterPrimaryText'
    | 'beforeSecondaryText'
    | 'afterSecondaryText',
  /**
   * Content to be displayed.
   * If no children are provided, the component falls back to displaying "primaryText"
   * and "secondaryText" properties.
   * If children are provided, their location depends on the value of "childrenPlacement".
   */
  children?: ChildrenType,
};

class AvatarItem extends Component<Props> {
  node: ?HTMLElement;

  static defaultProps = {
    enableTextTruncate: true,
    childrenPlacement: 'content',
  };

  // expose blur/focus to consumers via ref
  blur = () => {
    if (this.node) this.node.blur();
  };
  focus = () => {
    if (this.node) this.node.focus();
  };

  isClickable() {
    const { isDisabled, onClick } = this.props;

    return !isDisabled && typeof onClick === 'function';
  }

  // disallow click on disabled avatars
  guardedClick = (event: KeyboardEvent | MouseEvent) => {
    const { isDisabled, onClick } = this.props;

    if (isDisabled || typeof onClick !== 'function') return;

    const item: {} = omit(this.props, ...propsOmittedFromClickData);

    onClick({ item, event });
  };

  setNode = (ref: ?HTMLElement) => {
    this.node = ref;
  };

  render() {
    const { avatar } = this.props;

    // maintain the illusion of a mask around presence/status
    const borderColor = getBackgroundColor(this.props);

    // distill props from context, props, and state
    const enhancedProps = getProps(this);

    // provide element type based on props
    const StyledComponent: any = getStyledAvatarItem(this.props);

    return (
      <StyledComponent
        innerRef={this.setNode}
        {...enhancedProps}
        onClick={this.isClickable() ? this.guardedClick : undefined}
      >
        {avatar && cloneElement(avatar, { borderColor })}
        {this.getContent()}
      </StyledComponent>
    );
  }

  getContent() {
    const {
      enableTextTruncate,
      primaryText,
      secondaryText,
      childrenPlacement,
      children,
    } = this.props;

    if (React.Children.count(children) === 0) {
      return (
        <Content truncate={enableTextTruncate}>
          <PrimaryText truncate={enableTextTruncate}>{primaryText}</PrimaryText>
          <SecondaryText truncate={enableTextTruncate}>
            {secondaryText}
          </SecondaryText>
        </Content>
      );
    }

    if (childrenPlacement === 'content') {
      if (primaryText || secondaryText) {
        warn(
          '"primaryText" and "secondaryText" have no effect when children are provided and "childrenPlacement" is set to "content"',
        );
      }

      return <Content truncate={enableTextTruncate}>{children}</Content>;
    }

    return (
      <Content truncate={enableTextTruncate}>
        {this.getPrimaryContent()}
        {this.getSecondaryContent()}
      </Content>
    );
  }

  getPrimaryContent() {
    const {
      enableTextTruncate,
      primaryText,
      childrenPlacement,
      children,
    } = this.props;

    switch (childrenPlacement) {
      case 'beforePrimaryText': {
        return (
          <TextWithContent>
            <PrimaryText>
              <AdditionalContent position="pre">{children}</AdditionalContent>
            </PrimaryText>
            <PrimaryText truncate={enableTextTruncate}>
              {primaryText}
            </PrimaryText>
          </TextWithContent>
        );
      }
      case 'afterPrimaryText': {
        return (
          <TextWithContent>
            <PrimaryText truncate={enableTextTruncate}>
              {primaryText}
            </PrimaryText>
            <PrimaryText>
              <AdditionalContent position="post">{children}</AdditionalContent>
            </PrimaryText>
          </TextWithContent>
        );
      }
      default: {
        return (
          <PrimaryText truncate={enableTextTruncate}>{primaryText}</PrimaryText>
        );
      }
    }
  }

  getSecondaryContent() {
    const {
      enableTextTruncate,
      secondaryText,
      childrenPlacement,
      children,
    } = this.props;

    switch (childrenPlacement) {
      case 'beforeSecondaryText': {
        return (
          <TextWithContent>
            <SecondaryText>
              <AdditionalContent position="pre">{children}</AdditionalContent>
            </SecondaryText>
            <SecondaryText truncate={enableTextTruncate}>
              {secondaryText}
            </SecondaryText>
          </TextWithContent>
        );
      }
      case 'afterSecondaryText': {
        return (
          <TextWithContent>
            <SecondaryText truncate={enableTextTruncate}>
              {secondaryText}
            </SecondaryText>
            <SecondaryText>
              <AdditionalContent position="post">{children}</AdditionalContent>
            </SecondaryText>
          </TextWithContent>
        );
      }
      default: {
        return (
          <SecondaryText truncate={enableTextTruncate}>
            {secondaryText}
          </SecondaryText>
        );
      }
    }
  }
}

export default withPseudoState(AvatarItem);
