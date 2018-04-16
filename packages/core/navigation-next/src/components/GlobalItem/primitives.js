// @flow

import React, { PureComponent, type ComponentType } from 'react';
import { css } from 'emotion';
import Tooltip from '@atlaskit/tooltip';

import { light, styleReducerNoOp, withTheme } from '../../theme';
import type {
  GlobalItemPrimitiveProps,
  GlobalItemRenderComponentProps,
} from './types';

const getItemBase = (
  itemProps: GlobalItemPrimitiveProps,
): ComponentType<GlobalItemRenderComponentProps> => {
  const { component: CustomComponent, ...providedItemProps } = itemProps;
  const { href, onClick, target } = providedItemProps;

  if (CustomComponent) {
    // The custom component gets passed all of the item's props
    return props => <CustomComponent {...providedItemProps} {...props} />;
  }

  if (href) {
    // We have to specifically destructure children here or else eslint
    // complains about the <a> not having content
    return ({ children, ...props }: GlobalItemRenderComponentProps) => (
      <a href={href} onClick={onClick} target={target} {...props}>
        {children}
      </a>
    );
  }

  if (onClick) {
    return props => <button {...props} onClick={onClick} />;
  }

  return props => <span {...props} />;
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

    const { mode, context } = theme;
    const presentationProps = { isActive, isHover, size };
    const defaultStyles = mode.globalItem(presentationProps)[context];
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
      <Tooltip content={tooltip} position="right">
        {item}
      </Tooltip>
    ) : (
      item
    );
  }
}

export default withTheme({ mode: light, context: 'expanded' })(
  GlobalNavigationItemPrimitive,
);
