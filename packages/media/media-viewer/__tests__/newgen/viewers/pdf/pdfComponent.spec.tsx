import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { PDFViewer } from '../../../../src/newgen/viewers/pdf/pdfComponent';
import { ZoomControls } from '../../../../src/newgen/zoomControls';

function createFixture() {
  const el = mount(<PDFViewer doc={null} />);
  return { el };
}

describe('PDFViewer', () => {
  it('supports zooming', async () => {
    const { el } = createFixture();

    expect(el.state('scale')).toEqual(1);
    expect(el.find(ZoomControls)).toHaveLength(1);
    el
      .find(ZoomControls)
      .find(Button)
      .first()
      .simulate('click');
    expect(el.state('scale')).toBeLessThan(1);
  });
});
