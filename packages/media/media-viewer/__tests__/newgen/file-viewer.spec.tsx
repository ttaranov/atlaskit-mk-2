import * as React from 'react';
import { mount } from 'enzyme';
import { FileViewer, FileDetails } from '../../src/newgen/file-viewer';
import { DocumentViewer } from '../../src/newgen/document-viewer';
import { ErrorMessage } from '../../src/newgen/styled';

describe('<FileViewer />', () => {
  it('should display the document if viewer media type is document', () => {
    const fileDetails: FileDetails = {
      mediaType: 'doc',
    };
    const el = mount(<FileViewer fileDetails={fileDetails} />);
    expect(el.find(DocumentViewer)).toHaveLength(1);
    expect(el.find(ErrorMessage)).toHaveLength(0);
  });

  it('should show the unsupported message if media type is unknown', () => {
    const fileDetails: FileDetails = {
      mediaType: 'unknown',
    };
    const el = mount(<FileViewer fileDetails={fileDetails} />);
    expect(el.find(DocumentViewer)).toHaveLength(0);
    expect(el.find(ErrorMessage)).toHaveLength(1);
  });
});
