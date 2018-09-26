// @flow

import React, { PureComponent, type ElementType, type Ref } from 'react';
import { css } from 'emotion';

import { styleReducerNoOp, withContentTheme } from '../../theme';
import type { ItemProps } from './types';

const isString = x => typeof x === 'string';

type SwitchProps = {
  as: ElementType,
  draggableProps: {},
  innerRef: Ref<*>,
};
const ComponentSwitch = ({
  as,
  draggableProps,
  innerRef,
  ...rest
}: SwitchProps) => {
  const isElement = isString(as);
  const props = isElement ? rest : { innerRef, draggableProps, ...rest };
  // only pass the actual `ref` to an element, it's the responsibility of the
  // component author to use `innerRef` where applicable
  const ref = isElement ? innerRef : null;
  const ElementOrComponent = as;

  return <ElementOrComponent ref={ref} {...draggableProps} {...props} />;
};

class ItemPrimitive extends PureComponent<ItemProps> {
  static defaultProps = {
    draggableProps: {},
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
      isDragging,
      draggableProps,
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
    const presentationProps = {
      isActive,
      isDragging,
      isHover,
      isSelected,
      spacing,
    };
    const defaultStyles = mode.item(presentationProps)[context];
    const styles = styleReducer(defaultStyles, presentationProps, theme);

    // base element switch

    let itemComponent = 'div';
    let itemProps = { draggableProps, innerRef };

    if (CustomComponent) {
      itemComponent = CustomComponent;
      itemProps = this.props;
    } else if (href) {
      itemComponent = 'a';
      itemProps = { href, onClick, target, draggableProps, innerRef };
    } else if (onClick) {
      itemComponent = 'button';
      itemProps = { onClick, draggableProps, innerRef };
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
