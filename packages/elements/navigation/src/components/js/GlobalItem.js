// @flow
import React, { PureComponent } from 'react';
import styled from 'styled-components';
import GlobalItemInner, { globalItemStyles } from '../styled/GlobalItemInner';
import DefaultLinkComponent from './DefaultLinkComponent';
import type { ReactElement, ReactClass, IconAppearance } from '../../types';

type Props = {|
  /** Standard aria-haspopup prop */
  'aria-haspopup'?: string, // eslint-disable-line react/no-unused-prop-types
  /** Element to be rendered inside the item. Should be an atlaskit icon. */
  children?: ReactElement,
  /** href to pass to linkComponent.  */
  href?: string,
  /** Causes the item to appear with a persistent selected background state. */
  isSelected?: boolean,
  /** Component to be used to create the link in the global item. A default
  component is used if none is provided. */
  linkComponent: ReactClass,
  /** Standard onClick event */
  onClick?: (event: Event) => {},
  onMouseDown: (event: MouseEvent) => {},
  /** ARIA role to apply to the global item. */
  role?: string,
  /** Set the size of the item's content.  */
  size?: 'small' | 'medium' | 'large',
  /** Appearance of item for custom styling (square or round) */
  appearance: IconAppearance,
|}

export default class GlobalItem extends PureComponent {
  static defaultProps = {
    linkComponent: DefaultLinkComponent,
    onMouseDown: () => {},
    size: 'small',
    appearance: 'round',
  };

  props: Props

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    const {
      href,
      linkComponent: Link,
      isSelected,
      size,
      'aria-haspopup': ariaHasPopup, // eslint-disable-line react/prop-types
      onClick,
      onMouseDown: providedMouseDown,
      role,
      appearance,
    } = this.props;

    const allyAndEventProps = {
      'aria-haspopup': ariaHasPopup,
      onClick,
      role,
      onKeyDown: this.handleKeyDown,
    };
    const ActualLink = styled(Link)`
      ${globalItemStyles}
      &:hover {
        color: inherit;
      }
    `;

    const onMouseDown = (e) => {
      providedMouseDown(e);
      e.preventDefault();
    };

    if (href) {
      return (
        <ActualLink
          href={href}
          size={size}
          onMouseDown={providedMouseDown}
          appearance={appearance}
          {...allyAndEventProps}
        >
          {this.props.children}
        </ActualLink>
      );
    }

    return (
      <GlobalItemInner
        type="button"
        isSelected={isSelected}
        onMouseDown={onMouseDown}
        size={size}
        appearance={appearance}
        {...allyAndEventProps}
      >
        {this.props.children}
      </GlobalItemInner>
    );
  }
}
