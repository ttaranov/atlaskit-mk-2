// @flow
import React from 'react';
import Avatar from '@atlaskit/avatar';
import { quickSearchResultTypes } from '../../src';
import { mountWithRootTheme } from '../_theme-util';

const { ObjectResult } = quickSearchResultTypes;

describe('Atlassian Object Result', () => {
  let resultWrapper;
  beforeEach(() => {
    resultWrapper = mountWithRootTheme(
      <ObjectResult
        containerName=""
        resultId="testId"
        type="object"
        name="test"
      />,
    );
  });

  it('should render an avatar if `avatarUrl` is provided', () => {
    resultWrapper.setProps({ avatarUrl: 'not null' });
    expect(resultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render an avatar if `avatarUrl` is not provided', () => {
    expect(resultWrapper.find(Avatar)).toHaveLength(1);
  });

  it('should render `name` prop', () => {
    const name = "Phillip Jacobs' Personal Space";
    resultWrapper.setProps({ name });
    expect(resultWrapper.text()).toEqual(expect.stringContaining(name));
  });

  it('should render lock icon on private room results', () => {
    resultWrapper.setProps({ isPrivate: true });
    expect(
      resultWrapper
        .find(Avatar)
        .at(0)
        .prop('status'),
    ).toBe('locked');
  });

  it('should pass null `status` prop to Avatar on non-private room results', () => {
    // No privacy prop supplied
    expect(
      resultWrapper
        .find(Avatar)
        .at(0)
        .prop('status'),
    ).toBe(null);
  });

  it('should render the `containerName` prop', () => {
    resultWrapper.setProps({ containerName: 'takeaway' });
    expect(resultWrapper.text()).toEqual(
      expect.stringContaining('in takeaway'),
    );
  });

  it('should render the `objectKey` prop', () => {
    resultWrapper.setProps({ objectKey: 'KFC-11' });
    expect(resultWrapper.text()).toEqual(expect.stringContaining('KFC-11'));
  });
});
