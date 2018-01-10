// @flow
import React, { PureComponent } from 'react';
import type { ReactElement, IconAppearance } from '../../types';

type Props = {|
  children?: ReactElement,
  className?: string,
  href?: string,
  onClick?: () => mixed,
  onMouseDown?: () => mixed,
  onMouseEnter?: () => mixed,
  onMouseLeave?: () => mixed,
  tabIndex?: number,
  appearance?: IconAppearance,
|}

export default class DefaultLinkComponent extends PureComponent {
  props: Props

  render() {
    const {
      children,
      className,
      href,
      onClick,
      onMouseDown,
      onMouseEnter,
      onMouseLeave,
      tabIndex,
      appearance, // eslint-disable-line no-unused-vars
      ...otherProps
    } = this.props;

    return (href ? (
      <a
        className={className}
        href={href}
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        tabIndex={tabIndex}
        {...otherProps}
      >{children}</a>
    ) : children);
  }
}
