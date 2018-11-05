import Avatar from '@atlaskit/avatar';
import Tag from '@atlaskit/tag';
import { shallow } from 'enzyme';
import * as React from 'react';
import { MultiValue } from '../../../components/MultiValue';

describe('MultiValue', () => {
  const Container = props => <div {...props} />;
  const data = {
    label: 'Jace Beleren',
    user: {
      id: 'abc-123',
      name: 'Jace Beleren',
      nickname: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
    },
  };
  const onClick = jest.fn();
  const shallowMultiValue = (
    { components, ...props }: any = { components: {} },
  ) =>
    shallow(
      <MultiValue
        data={data}
        components={{ Container, ...components }}
        removeProps={{ onClick }}
        {...props}
      />,
    );

  afterEach(() => {
    onClick.mockClear();
  });

  it('should render the Container with a Tag', () => {
    const component = shallowMultiValue();
    expect(component.find(Container)).toHaveLength(1);
    const tag = component.find(Tag);
    expect(tag).toHaveLength(1);
    expect(tag.props()).toMatchObject({
      appearance: 'rounded',
      text: 'Jace Beleren',
      elemBefore: (
        <Avatar
          size="xsmall"
          src="http://avatars.atlassian.com/jace.png"
          label="Jace Beleren"
        />
      ),
      removeButtonText: 'remove',
    });
    expect(tag.prop('color')).toBeUndefined();
  });

  it('should use greyLight color when focused', () => {
    const component = shallowMultiValue({ isFocused: true });
    expect(component.find(Container)).toHaveLength(1);
    const tag = component.find(Tag);
    expect(tag).toHaveLength(1);
    expect(tag.props()).toMatchObject({
      appearance: 'rounded',
      text: 'Jace Beleren',
      elemBefore: (
        <Avatar
          size="xsmall"
          src="http://avatars.atlassian.com/jace.png"
          label="Jace Beleren"
        />
      ),
      removeButtonText: 'remove',
      color: 'greyLight',
    });
  });

  it('should call onClick onAfterRemoveAction', () => {
    const component = shallowMultiValue();
    component.find(Tag).simulate('afterRemoveAction');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not render remove button for fixed value', () => {
    const component = shallowMultiValue({
      data: { ...data, user: { ...data.user, fixed: true } },
    });
    expect(component.find(Tag).prop('removeButtonText')).toBeUndefined();
  });
});
