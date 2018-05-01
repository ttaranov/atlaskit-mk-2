import * as React from 'react';
import { mount } from 'enzyme';
import Navigation from '../../src/newgen/navigation';
import { Identifier } from '../../src/newgen/domain';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/chevron-left-circle';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/chevron-right-circle';

describe('Navigation', () => {
  const identifier: Identifier = {
    id: 'some-id',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file',
  };

  const identifier2: Identifier = {
    id: 'some-id-2',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file',
  };

  const identifier2Duplicated: Identifier = {
    id: 'some-id-2',
    occurrenceKey: 'some-other-occurrence-key',
    type: 'file',
  };

  const identifier3: Identifier = {
    id: 'some-id-3',
    occurrenceKey: 'some-custom-occurrence-key',
    type: 'file',
  };

  const items = [identifier, identifier2, identifier3, identifier2Duplicated];

  it('should show right arrow if there are items on the right', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier}
      />,
    );
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(1);
  });

  it('should show left arrow if there are items on the left', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier3}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(1);
  });

  it('should not show arrows if there is only one item', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={[identifier]}
        selectedItem={identifier}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(0);
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(0);
  });

  it('should handle items with the same id', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier2Duplicated}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(1);
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(0);
  });

  it('should show both arrows if there are items in both sides', () => {
    const el = mount(
      <Navigation
        onChange={() => {}}
        items={items}
        selectedItem={identifier2}
      />,
    );
    expect(el.find(ArrowLeftCircleIcon)).toHaveLength(1);
    expect(el.find(ArrowRightCircleIcon)).toHaveLength(1);
  });

  it('should call onChange callback when left arrow is clicked', () => {
    const onChange = jest.fn();
    const el = mount(
      <Navigation
        onChange={onChange}
        items={items}
        selectedItem={identifier2}
      />,
    );
    el
      .find(ArrowLeftCircleIcon)
      .first()
      .simulate('click');
    expect(onChange).toBeCalledWith(identifier);
  });

  it('should call onChange callback when right arrow is clicked', () => {
    const onChange = jest.fn();
    const el = mount(
      <Navigation
        onChange={onChange}
        items={items}
        selectedItem={identifier}
      />,
    );
    el
      .find(ArrowRightCircleIcon)
      .first()
      .simulate('click');
    expect(onChange).toBeCalledWith(identifier2);
  });
});
