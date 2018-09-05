// @flow

import React, { Fragment, Component } from 'react';
import { css } from 'emotion';
import Tooltip from '@atlaskit/tooltip';

import { styleReducerNoOp, withGlobalTheme } from '../../theme';
import type {
  GlobalItemTooltipRenderer,
  GlobalItemPresentationProps,
} from './types';

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

  render() {
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
    this.CachedCustomComponent = this.CachedCustomComponent || CustomComponent;

    if (CustomComponent) {
      const CachedCustomComponent = this.CachedCustomComponent;
      return (
        <RenderTooltip tooltip={tooltip}>
          <CachedCustomComponent
            {...rest}
            className={css({ '&&': styles.itemBase })}
          >
            {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
          </CachedCustomComponent>
        </RenderTooltip>
      );
    }

    if (href) {
      return (
        <RenderTooltip tooltip={tooltip}>
          <a
            href={href}
            onClick={onClick}
            target={target}
            className={css({ '&&': styles.itemBase })}
          >
            {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
          </a>
        </RenderTooltip>
      );
    }

    if (onClick) {
      return (
        <RenderTooltip tooltip={tooltip}>
          <button onClick={onClick} className={css({ '&&': styles.itemBase })}>
            {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
          </button>
        </RenderTooltip>
      );
    }

    return (
      <RenderTooltip tooltip={tooltip}>
        <span className={css({ '&&': styles.itemBase })} {...rest}>
          {this.renderIconAndBadge(styles.badgeWrapper, presentationProps)}
        </span>
      </RenderTooltip>
    );
  }
}

const RenderTooltip = ({ tooltip, children }: GlobalItemTooltipRenderer) =>
  tooltip ? (
    <Tooltip content={tooltip} position="right" hideTooltipOnClick>
      {children}
    </Tooltip>
  ) : (
    children
  );

export default withGlobalTheme(GlobalNavigationItemPrimitive);
