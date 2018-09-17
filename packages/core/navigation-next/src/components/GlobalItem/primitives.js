// @flow

import React, { Fragment, Component } from 'react';
import { css } from 'emotion';
import Tooltip from '@atlaskit/tooltip';

import { styleReducerNoOp, withGlobalTheme } from '../../theme';
import type { GlobalItemPresentationProps } from './types';

class GlobalNavigationItemPrimitive extends Component<*> {
  static defaultProps = {
    isActive: false,
    isHover: false,
    isSelected: false,
    size: 'large',
    styles: styleReducerNoOp,
  };

  CachedCustomComponent = null;

  renderIconAndBadge = (
    badgeWrapper: {},
    presentationProps: GlobalItemPresentationProps,
  ) => {
    const { icon: Icon, badge: Badge, label, tooltip } = this.props;
    if (!Icon && !Badge) return null;
    return (
      <Fragment>
        {!!Icon && (
          <div css={{ pointerEvents: 'none' }}>
            <Icon label={label || tooltip} secondaryColor="inherit" />
          </div>
        )}
        {!!Badge && (
          <div css={badgeWrapper}>
            <Badge {...presentationProps} />
          </div>
        )}
      </Fragment>
    );
  };

  renderChildren = () => {
    const {
      isActive,
      isHover,
      isSelected,
      size,
      styles: styleReducer,
      theme,
      tooltip,
      href,
      onClick,
      target,
      component: CustomComponent,
      ...rest
    } = this.props;

    const { mode } = theme;
    const presentationProps = { isActive, isHover, isSelected, size };
    const defaultStyles = mode.globalItem(presentationProps);
    const styles = styleReducer(defaultStyles, presentationProps);
    let itemBase;

    if (CustomComponent) {
      if (typeof CustomComponent !== typeof this.CachedCustomComponent) {
        this.CachedCustomComponent = CustomComponent;
      }
      const CachedCustomComponent = this.CachedCustomComponent;

      itemBase = (
        <CachedCustomComponent
          {...rest}
          className={css({ '&&': styles.itemBase })}
        >
          {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
        </CachedCustomComponent>
      );
    } else if (href) {
      itemBase = (
        <a
          href={href}
          onClick={onClick}
          target={target}
          className={css({ '&&': styles.itemBase })}
        >
          {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
        </a>
      );
    } else if (onClick) {
      itemBase = (
        <button onClick={onClick} className={css({ '&&': styles.itemBase })}>
          {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
        </button>
      );
    } else {
      itemBase = (
        <span className={css({ '&&': styles.itemBase })} {...rest}>
          {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
        </span>
      );
    }

    return itemBase;
  };

  render() {
    const { isActive, isSelected, tooltip } = this.props;
    return (
      <Tooltip
        delay={0}
        content={isSelected || isActive ? null : tooltip}
        position="right"
        hideTooltipOnClick
      >
        {this.renderChildren()}
      </Tooltip>
    );
  }
}

export { GlobalNavigationItemPrimitive as BaseGlobalNavigationItemPrimitive };

export default withGlobalTheme(GlobalNavigationItemPrimitive);
