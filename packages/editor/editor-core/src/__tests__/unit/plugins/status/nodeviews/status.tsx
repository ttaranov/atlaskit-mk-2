import * as React from 'react';
import { mount } from 'enzyme';
import { status, defaultSchema } from '@atlaskit/editor-test-helpers';
import { Status } from '@atlaskit/status';
import StatusNodeView from '../../../../../plugins/status/nodeviews/status';

describe('Status - NodeView', () => {
  it('should use status component', () => {
    const node = status({ text: 'In progress', color: 'blue', localId: '666' })(
      defaultSchema,
    );

    const wrapper = mount(<StatusNodeView node={node} />);
    expect(wrapper.find(Status).length).toBe(1);
    expect(wrapper.find(Status).prop('text')).toBe('In progress');
    expect(wrapper.find(Status).prop('color')).toBe('blue');
    expect(wrapper.find(Status).prop('localId')).toBe('666');
    wrapper.unmount();
  });
});
