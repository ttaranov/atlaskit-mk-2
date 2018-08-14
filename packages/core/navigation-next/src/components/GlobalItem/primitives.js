// @flow

import React, { PureComponent, type ComponentType } from 'react';
import { css } from 'emotion';
import Tooltip from '@atlaskit/tooltip';

import { styleReducerNoOp, withGlobalTheme } from '../../theme';
import type {
  GlobalItemPrimitiveProps,
  GlobalItemRenderComponentProps,
} from './types';

const getItemBase = (
  itemProps: GlobalItemPrimitiveProps,
): ComponentType<GlobalItemRenderComponentProps> => {
  const { component: CustomComponent, ...providedItemProps } = itemProps;
  const { href, onClick, target } = providedItemProps;
  let ItemBase;

  if (CustomComponent) {
    // The custom component gets passed all of the item's props
    ItemBase = props => <CustomComponent {...providedItemProps} {...props} />;
  } else if (href) {
    // We have to specifically destructure children here or else eslint
    // complains about the <a> not having content
    ItemBase = ({ children, ...props }: GlobalItemRenderComponentProps) => (
      <a {...props} href={href} onClick={onClick} target={target}>
        {children}
      </a>
    );
  } else if (onClick) {
    ItemBase = props => <button {...props} onClick={onClick} />;
  } else {
    ItemBase = props => <span {...props} />;
  }

  return ItemBase;
};

class GlobalNavigationItemPrimitive extends PureComponent<*> {
  static defaultProps = {
    isActive: false,
    isHover: false,
    size: 'large',
    styles: styleReducerNoOp,
  };

  ItemBase: ComponentType<GlobalItemRenderComponentProps> = getItemBase(
    this.props,
  );

  componentWillReceiveProps(nextProps: GlobalItemPrimitiveProps) {
    if (
      nextProps.component !== this.props.component ||
      nextProps.href !== this.props.href ||
      nextProps.onClick !== this.props.onClick ||
      nextProps.target !== this.props.target
    ) {
      this.ItemBase = getItemBase(nextProps);
    }
  }

  render() {
    const { ItemBase } = this;
    const {
      badge: Badge,
      icon: Icon,
      isActive,
      isHover,
      label,
      size,
      styles: styleReducer,
      theme,
      tooltip,
    } = this.props;

    const { mode } = theme;
    const presentationProps = { isActive, isHover, size };
    const defaultStyles = mode.globalItem(presentationProps);
    const styles = styleReducer(defaultStyles, presentationProps);

    const item = (
      <ItemBase className={css({ '&&': styles.itemBase })}>
        {/* pointer-events: none on the icon wrapper to avoid issues with SVGs swallowing clicks */}
        {!!Icon && (
          <div css={{ pointerEvents: 'none' }}>
            <Icon label={label || tooltip} secondaryColor="inherit" />
          </div>
        )}
        {!!Badge && (
          <div css={styles.badgeWrapper}>
            <Badge {...presentationProps} />
          </div>
        )}
      </ItemBase>
    );

    return tooltip ? (
      <Tooltip content={tooltip} position="right" hideTooltipOnClick>
        {item}
      </Tooltip>
    ) : (
      item
    );
  }
}

export default withGlobalTheme(GlobalNavigationItemPrimitive);
