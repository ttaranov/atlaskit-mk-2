// @flow

import React from 'react';
import { mount } from 'enzyme';
import ArrowLeft from '@atlaskit/icon/glyph/arrow-left';

import DrawerPrimitive from '../../primitives';

const DrawerContent = () => <code>Drawer contents</code>;

describe('Drawer primitive', () => {
  const commonProps = {
    width: 'wide',
    in: true,
    shouldUnmountOnExit: false,
  };

  it('should render given icon in large size if exists', () => {
    const props = { ...commonProps, icon: () => <span>Icon</span> };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );
    expect(wrapper.find(props.icon).props().size).toBe('large');
  });

  it('should render arrow left if icon prop does NOT exist', () => {
    const props = { ...commonProps };
    const wrapper = mount(
      <DrawerPrimitive {...props}>
        <DrawerContent />
      </DrawerPrimitive>,
    );

    expect(wrapper.find(ArrowLeft).length).toBe(1);
  });
});
