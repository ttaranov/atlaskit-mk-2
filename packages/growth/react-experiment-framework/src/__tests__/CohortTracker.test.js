// @flow

import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import CohortTracker from '../CohortTracker';

configure({ adapter: new Adapter() });

describe('CohortTracker', () => {
  let mockExposureDetails;
  let mockOnExposure;

  beforeEach(() => {
    mockExposureDetails = {
      cohort: 'control',
      experimentKey: 'myExperimentKey',
      isEligible: true,
    };

    mockOnExposure = jest.fn();
  });

  it('should call onExposure when mounted', () => {
    shallow(
      <CohortTracker
        exposureDetails={mockExposureDetails}
        onExposure={mockOnExposure}
      />,
    );

    expect(mockOnExposure).toBeCalledWith(mockExposureDetails);
  });

  it('should not have a presence in the dom', () => {
    const wrapper = shallow(
      <CohortTracker
        exposureDetails={mockExposureDetails}
        onExposure={mockOnExposure}
      />,
    );

    expect(wrapper.isEmptyRender()).toBeTruthy();
  });
});
