import { expect } from 'chai';
import { mount } from 'enzyme';
import * as React from 'react';

import Editor from '../../src/editor';

describe('@atlaskit/editor-core/editor', () => {
  it('should be editable if disabled prop is not set', () => {
    const wrapper = mount(<Editor />);
    expect(wrapper.render().find('[contenteditable="true"]')).to.have.length(1);
    wrapper.unmount();
  });

  it('should not be editable if disabled prop is set', () => {
    const wrapper = mount(<Editor disabled={true} />);
    expect(wrapper.render().find('[contenteditable="false"]')).to.have.length(
      1,
    );
    wrapper.unmount();
  });

  it('should not allow editing if the disabled prop changes to true', () => {
    const wrapper = mount(<Editor />);
    wrapper.setProps({ disabled: true });
    expect(wrapper.render().find('[contenteditable="false"]')).to.have.length(
      1,
    );
    wrapper.unmount();
  });

  it('should allow editing if the disabled prop changes to false', () => {
    const wrapper = mount(<Editor disabled={true} />);
    wrapper.setProps({ disabled: false });
    expect(wrapper.render().find('[contenteditable="true"]')).to.have.length(1);
    wrapper.unmount();
  });
});
