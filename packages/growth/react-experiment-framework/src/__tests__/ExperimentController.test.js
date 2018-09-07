// @flow

import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import ExperimentController from '../ExperimentController';
import { ExperimentConsumer } from '../ExperimentContext';

configure({ adapter: new Adapter() });

describe('ExperimentController', () => {
  it('should provide context to a consumer', () => {
    const mockExperimentDetails = {
      cohort: 'variation',
      isEligible: true,
    };

    const mockExperimentResolver = jest
      .fn()
      .mockReturnValue(Promise.resolve(mockExperimentDetails));

    const mockExperimentEnrollmentConfig = {
      myExperimentKey: mockExperimentResolver,
    };

    const mockContextReceiver = jest.fn();

    mount(
      <ExperimentController
        experimentEnrollmentConfig={mockExperimentEnrollmentConfig}
      >
        <ExperimentConsumer>
          {context => mockContextReceiver(context)}
        </ExperimentConsumer>
      </ExperimentController>,
    );

    const getExperimentValueForReceiverCall = call =>
      mockContextReceiver.mock.calls[call][0].myExperimentKey;

    // first call has the initial resolver, and has not decided enrollment
    expect(mockContextReceiver.mock.calls).toHaveLength(1);
    expect(
      getExperimentValueForReceiverCall(0).isEnrollmentDecided,
    ).toBeFalsy();

    // call resolver
    getExperimentValueForReceiverCall(0).enrollmentResolver();
    expect(mockExperimentResolver).toBeCalled();

    // it should update context with cached resolver and still not have decided enrollment
    expect(mockContextReceiver.mock.calls).toHaveLength(2);
    expect(
      getExperimentValueForReceiverCall(1).isEnrollmentDecided,
    ).toBeFalsy();
    const cachedResolver = getExperimentValueForReceiverCall(1)
      .enrollmentResolver;
    expect(cachedResolver()).toEqual(cachedResolver());
    expect(mockExperimentResolver.mock.calls).toHaveLength(1);

    // once resolved async-ily
    return cachedResolver().then(() => {
      // third call has decided enrollment and has experiment details
      expect(mockContextReceiver.mock.calls).toHaveLength(3);
      expect(
        getExperimentValueForReceiverCall(2).isEnrollmentDecided,
      ).toBeTruthy();
      expect(getExperimentValueForReceiverCall(2).enrollmentDetails).toEqual(
        mockExperimentDetails,
      );
    });
  });
});
