import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { InteractiveImg } from '../../../../src/newgen/viewers/image/interactive-img';
import { ZoomControls } from '../../../../src/newgen/zoomControls';
import { Rectangle } from '../../../../src/newgen/domain/rectangle';
import { Img } from '../../../../src/newgen/styled';
import { ZoomLevel } from '../../../../src/newgen/domain/zoomLevel';
import { computeProjection } from '../../../../src/newgen/domain/projection';

function createFixture() {
  const onClose = jest.fn();
  const el = mount(<InteractiveImg src={''} onClose={onClose} />);
  return { el, onClose };
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
    const { el } = createFixture();
    const viewport = new Rectangle(400, 300);
    const img = new Rectangle(800, 600);
    const zoomLevel = new ZoomLevel(1);

    el.setState({
      dimensions: {
        status: 'SUCCESSFUL',
        data: {
          viewport,
          img,
        },
      },
      zoomLevel,
    });
    const { width, height } = computeProjection(img, viewport, zoomLevel.value);
    const styleProp = el.find(Img).prop('style');
    expect(styleProp).toEqual({ width, height });
  });
});
