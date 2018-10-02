import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';

import Editor from '../../src/editor';

describe('@atlaskit/editor-core/editor', () => {
  let place;
  beforeEach(() => {
    place = document.createElement('div');
    document.body.appendChild(place);
  });

  afterEach(() => {
    document.body.removeChild(place);
  });

  it('should be editable if disabled prop is not set', () => {
    const wrapper = mount(<Editor />, { attachTo: place });
    expect(
      document.querySelectorAll('[contenteditable="true"]'),
    ).to.have.length(1);
    wrapper.unmount();
  });

  it('should not be editable if disabled prop is set', () => {
    const wrapper = mount(<Editor disabled={true} />, { attachTo: place });
    expect(
      document.querySelectorAll('[contenteditable="false"]'),
    ).to.have.length(1);
    wrapper.unmount();
  });

  it('should not allow editing if the disabled prop changes to true', () => {
    const wrapper = mount(<Editor />, { attachTo: place });
    wrapper.setProps({ disabled: true });
    expect(
      document.querySelectorAll('[contenteditable="false"]'),
    ).to.have.length(1);
    wrapper.unmount();
  });

  it('should allow editing if the disabled prop changes to false', () => {
    const wrapper = mount(<Editor disabled={true} />, { attachTo: place });
    wrapper.setProps({ disabled: false });
    expect(
      document.querySelectorAll('[contenteditable="true"]'),
    ).to.have.length(1);
    wrapper.unmount();
  });
});
