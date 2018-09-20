// @flow

import React, { Fragment } from 'react';
import { components } from 'react-select';

import { colors } from '@atlaskit/theme';
import SearchIcon from '@atlaskit/icon/glyph/editor/search';

// ==============================
// Styled Components
// ==============================

type MenuProps = { maxWidth: number, minWidth: number };

export const MenuDialog = ({ maxWidth, minWidth, ...props }: MenuProps) => {
  const shadow = colors.N40A;
  return (
    <div
      css={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        maxWidth,
        minWidth,
        zIndex: 2,
      }}
      {...props}
    />
  );
};

// ==============================
// Custom Components
// ==============================

const DropdownIndicator = () => (
  <div css={{ marginRight: 2, textAlign: 'center', width: 32 }}>
    <SearchIcon />
  </div>
);
const Control = ({ innerRef, innerProps, ...props }: *) => (
  <div ref={innerRef} css={{ padding: '8px 8px 4px' }}>
    <components.Control {...props} innerProps={innerProps} />
  </div>
);
export const DummyControl = (props: *) => (
  <div
    css={{
      border: 0,
      clip: 'rect(1px, 1px, 1px, 1px)',
      height: 1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      whiteSpace: 'nowrap',
      width: 1,
    }}
  >
    <components.Control {...props} />
  </div>
);
// NOTE `props` intentionally omitted from `Fragment`
// eslint-disable-next-line
const Menu = ({ key, children, ...props }: *) => (
  <Fragment key={key}>{children}</Fragment>
);
export const defaultComponents = { Control, DropdownIndicator, Menu };
