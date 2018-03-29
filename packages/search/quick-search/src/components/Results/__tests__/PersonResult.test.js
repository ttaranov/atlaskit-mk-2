// @flow
import { mount } from 'enzyme';
import React from 'react';
import Avatar from '@atlaskit/avatar';
import PersonResult from '../PersonResult';

describe('Person Result', () => {
  let personResultWrapper;
  beforeEach(() => {
    personResultWrapper = mount(
      <PersonResult resultId="testPerson" type="person" name="test" />,
    );
  });

  it('should render an avatar if `avatarUrl` is provided', () => {
    personResultWrapper.setProps({ avatarUrl: 'not null' });
    expect(personResultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render an avatar if `avatarUrl` is not provided', () => {
    expect(personResultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render `name` prop', () => {
    const name = 'Charlie Atlas';
    personResultWrapper.setProps({ name });
    expect(personResultWrapper.text()).toEqual(expect.stringContaining(name));
  });

  it("should render mentionName prop prepended with an '@' (w/ default mentionPrefix)", () => {
    const mentionName = 'atlassian';
    personResultWrapper.setProps({ mentionName });
    expect(personResultWrapper.text()).toEqual(
      expect.stringContaining(`@${mentionName}`),
    );
  });

  it('should render mentionPrefix prepended to mentionName', () => {
    const mentionName = 'atlassian';
    const mentionPrefix = '[at]';
    personResultWrapper.setProps({ mentionName, mentionPrefix });
    expect(personResultWrapper.text()).toEqual(
      expect.stringContaining(`${mentionPrefix}${mentionName}`),
    );
  });

  it('should not render mentionPrefix if mentionName is not provided', () => {
    const mentionPrefix = '[at]';
    personResultWrapper.setProps({ mentionPrefix });
    expect(personResultWrapper.text()).not.toEqual(
      expect.stringContaining(mentionPrefix),
    );
  });

  it('should render presenceMessage if provided', () => {
    const presenceMessage = "Gone fishin'";
    personResultWrapper.setProps({ presenceMessage });
    expect(personResultWrapper.text()).toEqual(
      expect.stringContaining(presenceMessage),
    );
  });

  it('known presence states are still valid', () => {
    personResultWrapper.setProps({ presenceState: 'online' });
    expect(personResultWrapper.find('Presence').find('svg')).toHaveLength(1);
    personResultWrapper.setProps({ presenceState: 'offline' });
    expect(personResultWrapper.find('Presence').find('svg')).toHaveLength(1);
    personResultWrapper.setProps({ presenceState: 'busy' });
    expect(personResultWrapper.find('Presence').find('svg')).toHaveLength(1);
  });
});
