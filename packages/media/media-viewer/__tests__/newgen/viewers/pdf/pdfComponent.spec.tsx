import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import {
  PDFViewer,
  pdfViewerClassName,
} from '../../../../src/newgen/viewers/pdf/pdfComponent';
import { ZoomControls } from '../../../../src/newgen/zoomControls';

function createFixture() {
  const onClose = jest.fn();
  const el = mount(<PDFViewer doc={null} onClose={onClose} />);
  return { el, onClose };
}

describe('PDFViewer', () => {
  it('supports zooming', async () => {
    const { el } = createFixture();

    expect(el.state('zoom')).toEqual(100);
    expect(el.find(ZoomControls)).toHaveLength(1);
    el
      .find(ZoomControls)
      .find(Button)
      .first()
      .simulate('click');
    expect(el.state('zoom')).toBeLessThan(100);
  });

  it('MSW-700: clicking on background of PDFViewer does not close it', () => {
    const { el, onClose } = createFixture();
    el.find(`.${pdfViewerClassName}`).simulate('click');

    expect(onClose).toHaveBeenCalled();
  });
});
