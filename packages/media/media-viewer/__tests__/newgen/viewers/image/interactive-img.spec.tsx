import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { InteractiveImg } from '../../../../src/newgen/viewers/image/interactive-img';
import { ZoomControls } from '../../../../src/newgen/zoomControls';
import { Img } from '../../../../src/newgen/styled';
import { ZoomLevel } from '../../../../src/newgen/domain/zoomLevel';
import { Camera, Rectangle } from '../../../../src/newgen/domain/camera';

function createFixture() {
  const onClose = jest.fn();
  const el = mount(<InteractiveImg src={''} onClose={onClose} />);
  const viewport = new Rectangle(400, 300);
  const originalImg = new Rectangle(800, 600);
  const camera = new Camera(viewport, originalImg);
  const zoomLevel = new ZoomLevel(1);

  el.setState({
    camera: {
      status: 'SUCCESSFUL',
      data: camera,
    },
    zoomLevel,
  });
  return { el, onClose, camera, zoomLevel };
}

describe('InteractiveImg', () => {
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

  it('sets the correct width and height on the Img element', () => {
    const { el, camera, zoomLevel } = createFixture();

    const styleProp = el.find(Img).prop('style');
    expect(styleProp).toEqual(camera.scaledImg(zoomLevel.value));
  });
});
