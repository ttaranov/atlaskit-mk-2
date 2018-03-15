import * as React from 'react';
import { mount } from 'enzyme';
import Blanket from '@atlaskit/blanket';
import { MediaViewer } from '../../src/newgen/media-viewer';

describe('<MediaViewer />', () => {
  it('should close Media Viewer on click', () => {
    const onClose = jest.fn();
    const el = mount(<MediaViewer onClose={onClose} />);
    el.find(Blanket).simulate('click');
    expect(onClose).toHaveBeenCalled();
  });
});
