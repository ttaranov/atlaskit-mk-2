// @flow

import React, { PureComponent, type ComponentType } from 'react';
import { css } from 'emotion';

import { styleReducerNoOp, withContentTheme } from '../../theme';
import type { ItemProps, ItemRenderComponentProps } from './types';

const getItemBase = (
  itemProps: ItemProps,
): ComponentType<ItemRenderComponentProps> => {
  const { component: CustomComponent, href, onClick, target } = itemProps;

  let ItemBase;

  if (CustomComponent) {
    // The custom component gets passed all of the item's props
    ItemBase = props => <CustomComponent {...itemProps} {...props} />;
  } else if (href) {
    // We have to specifically destructure children here or else eslint
    // complains about the <a> not having content
    ItemBase = ({ children, ...props }: ItemRenderComponentProps) => (
      <a href={href} onClick={onClick} target={target} {...props}>
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

class ItemPrimitive extends PureComponent<ItemProps> {
  static defaultProps = {
    isActive: false,
    isHover: false,
    isSelected: false,
    spacing: 'default',
    styles: styleReducerNoOp,
    text: '',
  };

  ItemBase: ComponentType<ItemRenderComponentProps> = getItemBase(this.props);

  componentWillReceiveProps(nextProps: ItemProps) {
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
      after: After,
      before: Before,
      styles: styleReducer,
      isActive,
      isHover,
      isSelected,
      spacing,
      subText,
      text,
      theme,
    } = this.props;

    const { mode, context } = theme;
    const presentationProps = { isActive, isHover, isSelected, spacing };
    const defaultStyles = mode.item(presentationProps)[context];
    const styles = styleReducer(defaultStyles, presentationProps);

    return (
      <ItemBase className={css({ '&&': styles.itemBase })}>
        {!!Before && (
          <div css={styles.beforeWrapper}>
            <Before {...presentationProps} />
          </div>
        )}
        <div css={styles.contentWrapper}>
          <div css={styles.textWrapper}>{text}</div>
          {!!subText && <div css={styles.subTextWrapper}>{subText}</div>}
        </div>
        {!!After && (
          <div css={styles.afterWrapper}>
            <After {...presentationProps} />
          </div>
        )}
      </ItemBase>
    );
  }
}

export default withContentTheme(ItemPrimitive);
