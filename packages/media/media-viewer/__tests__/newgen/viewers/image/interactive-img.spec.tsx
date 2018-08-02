import * as React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import * as jsc from 'jsverify';
import Button from '@atlaskit/button';
import {
  InteractiveImg,
  zoomLevelAfterResize,
} from '../../../../src/newgen/viewers/image/interactive-img';
import { ZoomControls } from '../../../../src/newgen/zoomControls';
import { ImageWrapper, Img } from '../../../../src/newgen/styled';
import { ZoomLevel } from '../../../../src/newgen/domain/zoomLevel';
import {
  Camera,
  Rectangle,
  Vector2,
} from '../../../../src/newgen/domain/camera';

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

function clickZoomIn(el: ReactWrapper<any, any>) {
  el
    .find(ZoomControls)
    .find(Button)
    .last()
    .simulate('click');
}

function clickZoomOut(el: ReactWrapper<any, any>) {
  el
    .find(ZoomControls)
    .find(Button)
    .first()
    .simulate('click');
}

describe('InteractiveImg', () => {
  it('it allows zooming', async () => {
    const { el } = createFixture();
    expect(el.find(ZoomControls)).toHaveLength(1);

    expect(el.state('zoomLevel').value).toEqual(1);

    clickZoomOut(el);
    expect(el.state('zoomLevel').value).toBeLessThan(1);

    clickZoomIn(el);
    expect(el.state('zoomLevel').value).toEqual(1);
  });

  it('sets the correct width and height on the Img element', () => {
    const { el, camera, zoomLevel } = createFixture();
    const styleProp = el.find(Img).prop('style');
    expect(styleProp).toMatchObject(camera.scaledImg(zoomLevel.value));
  });

  it('sets the correct scrollLeft and scrollTop values on the ImageWrapper', () => {
    const { el, camera, zoomLevel } = createFixture();
    const imgWrapper = el.find(ImageWrapper).getDOMNode();

    const prevOffset = new Vector2(imgWrapper.scrollLeft, imgWrapper.scrollTop);
    const prevScale = zoomLevel.value;
    const nextScale = zoomLevel.zoomIn().value;

    clickZoomIn(el);

    const expectedOffset = camera.scaledOffset(
      prevOffset,
      prevScale,
      nextScale,
    );
    expect(imgWrapper.scrollLeft).toEqual(expectedOffset.x);
    expect(imgWrapper.scrollTop).toEqual(expectedOffset.y);
  });

  it('resizes a fitted image when the window is resized', () => {
    const { el, camera } = createFixture();
    const oldZoomLevel = new ZoomLevel(camera.scaleDownToFit);
    el.setState({ zoomLevel: oldZoomLevel });

    const newViewport = new Rectangle(100, 100);
    const newCamera = camera.resizedViewport(newViewport);
    const newWrapper = {
      clientWidth: newViewport.width,
      clientHeight: newViewport.height,
    };

    (el.instance() as any)['wrapper'] = newWrapper;
    window.dispatchEvent(new CustomEvent('resize'));

    const expectedZoomLevel = zoomLevelAfterResize(
      newCamera,
      camera,
      oldZoomLevel,
    );

    const {
      zoomLevel: actualZoomLevel,
      camera: { data: actualCamera },
    } = el.state();
    expect(actualCamera.viewport).toEqual(newViewport);
    expect(actualZoomLevel.value).toEqual(expectedZoomLevel.value);
  });
});

describe('zoomLevelAfterResize', () => {
  const sideLenGenerator = () => jsc.integer(1, 10000);

  jsc.property(
    'a fitted image will be resized to fit the new viewport',
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    (w1, h1, w2, h2) => {
      const originalImg = new Rectangle(800, 600);
      const oldViewport = new Rectangle(w1, h1);
      const newViewport = new Rectangle(w2, h2);

      const oldCamera = new Camera(oldViewport, originalImg);
      const newCamera = oldCamera.resizedViewport(newViewport);

      const oldZoomLevel = new ZoomLevel(oldCamera.scaleDownToFit);
      const newZoomLevel = zoomLevelAfterResize(
        newCamera,
        oldCamera,
        oldZoomLevel,
      );
      return newZoomLevel.value === newCamera.scaleDownToFit;
    },
  );

  jsc.property(
    'a non-fitted image will maintain its size when viewport is resized',
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    sideLenGenerator(),
    (w1, h1, w2, h2) => {
      const originalImg = new Rectangle(800, 600);
      const oldViewport = new Rectangle(w1, h1);
      const newViewport = new Rectangle(w2, h2);

      const oldCamera = new Camera(oldViewport, originalImg);
      const newCamera = oldCamera.resizedViewport(newViewport);

      const oldZoomLevel = new ZoomLevel(oldCamera.scaleDownToFit + 1);
      const newZoomLevel = zoomLevelAfterResize(
        newCamera,
        oldCamera,
        oldZoomLevel,
      );
      return newZoomLevel.value === oldZoomLevel.value;
    },
  );
});
