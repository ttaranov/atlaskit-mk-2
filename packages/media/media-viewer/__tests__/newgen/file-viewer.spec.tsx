import * as React from 'react';
import { mount } from 'enzyme';
import { FileDetails } from '../../src/newgen/domain';
import { FileViewer } from '../../src/newgen/file-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

describe('<FileViewer />', () => {
  it('should show the unsupported message if media type is unknown', () => {
    const fileDetails: FileDetails = {
      mediaType: 'unknown',
    };
    const el = mount(<FileViewer fileDetails={fileDetails} />);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });
});
