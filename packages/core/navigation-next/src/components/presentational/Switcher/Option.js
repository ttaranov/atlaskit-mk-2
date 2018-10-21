// @flow

import React, {
  PureComponent,
  type ComponentType,
  type Node,
  type Ref,
} from 'react';
import { colors, fontSize, gridSize as gridSizeFn } from '@atlaskit/theme';
import Avatar from '@atlaskit/avatar';

const gridSize = gridSizeFn();

type ElementProps = {
  innerRef: Ref<*>,
  isFocused: boolean,
  isSelected: boolean,
};

const OptionElement = ({
  innerRef,
  isFocused,
  isSelected,
  ...props
}: ElementProps) => {
  return (
    <div
      ref={innerRef}
      css={{
        alignItems: 'center',
        border: 'none',
        backgroundColor: isFocused ? colors.N30 : 'transparent',
        boxSizing: 'border-box',
        color: 'inherit',
        cursor: 'default',
        display: 'flex',
        flexShrink: 0,
        fontSize: 'inherit',
        height: gridSize * 6,
        outline: 'none',
        paddingRight: gridSize,
        paddingLeft: gridSize,
        textAlign: 'left',
        textDecoration: 'none',
        width: '100%',

        '&:hover': {
          textDecoration: 'none',
        },
        '&:active': {
          backgroundColor: colors.B50,
        },
      }}
      {...props}
    />
  );
};
const ContentWrapper = (props: *) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      overflowX: 'hidden',
    }}
    {...props}
  />
);
const TextWrapper = (props: *) => (
  <div
    css={{
      flex: '1 1 auto',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      lineHeight: 16 / fontSize(),
    }}
    {...props}
  />
);
const SubTextWrapper = (props: *) => (
  <div
    css={{
      color: colors.N200,
      flex: '1 1 auto',
      fontSize: 12,
      lineHeight: 14 / 12,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    }}
    {...props}
  />
);
const ElementWrapper = ({ is, ...props }: { is: 'before' | 'after' }) => {
  const direction = { before: 'marginRight', after: 'marginLeft' };
  const margin = direction[is];

  return (
    <div
      css={{
        alignItems: 'center',
        display: 'flex',
        flexShrink: 0,
        [margin]: gridSize,
      }}
      {...props}
    />
  );
};

type PresentationProps = {
  isFocused: boolean,
  isSelected: boolean,
};
type DataType = {
  avatar?: string, // URL for the Avatar component
  component?: ComponentType<PresentationProps>,
  href?: string,
  subText?: string,
  target?: string, // NOTE: target will only be used if href is also set
  text: Node,
  to?: string, // href equivalent for ReactRouter.Link
};
type InnerProps = {
  'aria-selected': boolean,
  innerRef: Ref<*>,
  id: string,
  onClick: (*) => void,
  onMouseMove: (*) => void,
  onMouseOver: (*) => void,
  role: string,
  tabIndex: number,
};
type ItemProps = {
  data: DataType,
  innerProps: InnerProps,
  isFocused: boolean,
  isSelected: boolean,
  onClick?: (SyntheticEvent<MouseEvent>) => void,
};

export default class Option extends PureComponent<ItemProps> {
  render() {
    const { data, innerProps, isFocused, isSelected } = this.props;
    const { avatar, subText, text, ...dataProps } = data;
    const presentationProps = { isFocused, isSelected };

    return (
      <OptionElement {...presentationProps} {...dataProps} {...innerProps}>
        {!!avatar && (
          <ElementWrapper is="before">
            <Avatar
              borderColor="transparent"
              src={avatar}
              appearance="square"
            />
          </ElementWrapper>
        )}
        <ContentWrapper>
          <TextWrapper>{text}</TextWrapper>
          {!!subText && <SubTextWrapper>{subText}</SubTextWrapper>}
        </ContentWrapper>
      </OptionElement>
    );
  }
}
