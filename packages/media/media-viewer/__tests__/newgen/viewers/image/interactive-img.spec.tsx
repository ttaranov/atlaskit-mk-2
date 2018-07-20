import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { InteractiveImg } from '../../../../src/newgen/viewers/image/interactive-img';
import { ZoomControls } from '../../../../src/newgen/zoomControls';

function createFixture() {
  const onClose = jest.fn();
  const el = mount(<InteractiveImg src={''} onClose={onClose} />);
  return { el, onClose };
}

describe('ImageViewer', () => {
  it('it allows zooming', async () => {
    const { el } = createFixture();

    expect(el.state('zoomLevel').value).toEqual(1);
    expect(el.find(ZoomControls)).toHaveLength(1);
    el
      .find(ZoomControls)
      .find(Button)
      .first()
      .simulate('click');
    expect(el.state('zoomLevel').value).toBeLessThan(1);
    el
      .find(ZoomControls)
      .find(Button)
      .last()
      .simulate('click');
    expect(el.state('zoomLevel').value).toEqual(1);
  });
});
