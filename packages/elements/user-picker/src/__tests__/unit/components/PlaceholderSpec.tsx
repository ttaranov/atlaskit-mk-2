import Avatar from '@atlaskit/avatar';
import { components } from '@atlaskit/select';
import { shallow } from 'enzyme';
import * as React from 'react';
import { Placeholder } from '../../../components/Placeholder';

describe('Placeholder', () => {
  const selectProps = {
    placeholder: 'Find a person...',
    appearance: 'normal',
  };
  const shallowPlaceholder = (props = {}) =>
    shallow(
      <Placeholder appearance="normal" selectProps={selectProps} {...props}>
        Find a person...
      </Placeholder>,
    );

  it('should render Placeholder', () => {
    const component = shallowPlaceholder();
    expect(component.find(components.Placeholder)).toHaveLength(1);
    expect(component.find(Avatar).props()).toMatchObject({
      size: 'small',
      name: 'Find a person...',
      isHover: false,
    });
  });

  it('should render Avatar as xsmall when the appearance is compact', () => {
    const component = shallowPlaceholder({
      selectProps: { ...selectProps, appearance: 'compact' },
    });
    expect(component.find(Avatar).props()).toMatchObject({
      size: 'xsmall',
    });
  });
});
