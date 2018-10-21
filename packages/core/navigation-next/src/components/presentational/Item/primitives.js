// @flow

import React, { PureComponent, type ElementType, type Ref } from 'react';
import { css } from 'emotion';

import { styleReducerNoOp, withContentTheme } from '../../../theme';
import type { ItemProps } from './types';

const isString = x => typeof x === 'string';

type SwitchProps = {
  as: ElementType,
  innerRef: Ref<*>,
};
const ComponentSwitch = ({ as, innerRef, ...rest }: SwitchProps) => {
  const props = isString(as) ? rest : { innerRef, ...rest };
  const ElementOrComponent = as;
  return <ElementOrComponent ref={innerRef} {...props} />;
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
  render() {
    const {
      after: After,
      before: Before,
      styles: styleReducer,
      isActive,
      innerRef,
      isHover,
      isSelected,
      spacing,
      subText,
      text,
      theme,
      component: CustomComponent,
      href,
      onClick,
      target,
    } = this.props;

    const { mode, context } = theme;
    const presentationProps = { isActive, isHover, isSelected, spacing };
    const defaultStyles = mode.item(presentationProps)[context];
    const styles = styleReducer(defaultStyles, presentationProps, theme);

    // base element switch

    let itemComponent = 'div';
    let itemProps = { innerRef };

    if (CustomComponent) {
      itemComponent = CustomComponent;
      itemProps = this.props;
    } else if (href) {
      itemComponent = 'a';
      itemProps = { href, onClick, target, innerRef };
    } else if (onClick) {
      itemComponent = 'button';
      itemProps = { onClick, innerRef };
    }

    return (
      <ComponentSwitch
        as={itemComponent}
        className={css({ '&&': styles.itemBase })}
        {...itemProps}
      >
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
      </ComponentSwitch>
    );
  }
}

export default withContentTheme(ItemPrimitive);
