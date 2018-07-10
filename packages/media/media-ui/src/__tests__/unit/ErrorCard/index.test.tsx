import * as React from 'react';
import { mount } from 'enzyme';
import Button from '@atlaskit/button';
import { ErrorCard } from '../../../ErrorCard';
import { ErrorImage } from '../../../ErrorCard/styled';

describe('ErrorCard', () => {
  it('should render the retry button when there is a retry fn', () => {
    const onRetry = jest.fn();
    const element = mount(
      <ErrorCard
        hasPreview={false}
        minWidth={100}
        maxWidth={400}
        onRetry={onRetry}
      />,
    );
    expect(element.find(Button).prop('onClick')).toEqual(onRetry);
  });

  it('should not render the retry button when there is no retry fn', () => {
    const element = mount(
      <ErrorCard hasPreview={false} minWidth={100} maxWidth={400} />,
    );
    expect(element.find(Button)).toHaveLength(0);
  });

  it('should have an image when hasPreview=true', () => {
    const element = mount(
      <ErrorCard hasPreview={true} minWidth={100} maxWidth={400} />,
    );
    expect(element.find(ErrorImage)).toHaveLength(1);
  });

  it('should not have an image when hasPreview=false', () => {
    const element = mount(
      <ErrorCard hasPreview={false} minWidth={100} maxWidth={400} />,
    );
    expect(element.find(ErrorImage)).toHaveLength(0);
  });
});
