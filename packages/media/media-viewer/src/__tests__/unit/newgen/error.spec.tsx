import * as React from 'react';
import { mount } from 'enzyme';
import { ErrorMessage, createError } from '../../../newgen/error';
import Button from '@atlaskit/button';

describe('Error Message', () => {
  it('should render the right error for retrieving metadata', () => {
    const el = mount(<ErrorMessage error={createError('metadataFailed')} />);
    expect(el.text()).toContain(
      'Something went wrong.It might just be a hiccup.',
    );
  });

  it('should render the right error for generating a preview', () => {
    const el = mount(<ErrorMessage error={createError('previewFailed')} />);
    expect(el.text()).toContain("We couldn't generate a preview for this file");
  });

  it('should render the right error when the id is not found', () => {
    const el = mount(<ErrorMessage error={createError('idNotFound')} />);
    expect(el.text()).toContain('The selected item was not found on the list');
  });

  it('should render the right error when the PDF artifact does not exist', () => {
    const el = mount(
      <ErrorMessage error={createError('noPDFArtifactsFound')} />,
    );
    expect(el.text()).toContain('No PDF artifacts found for this file');
  });

  it('should render the right error when the file type is unsupported', () => {
    const el = mount(<ErrorMessage error={createError('unsupported')} />);
    expect(el.text()).toContain("We can't preview this file type.");
  });

  it('should render a child component', () => {
    const el = mount(
      <ErrorMessage error={createError('unsupported')}>
        <Button label="Download" />
      </ErrorMessage>,
    );
    expect(el.find(Button)).toHaveLength(1);
  });
});
