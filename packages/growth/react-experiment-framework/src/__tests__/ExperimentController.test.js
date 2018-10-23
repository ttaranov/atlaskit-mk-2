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
    const resolverPromise = getExperimentValueForReceiverCall(
      0,
    ).enrollmentResolver();
    expect(mockExperimentResolver).toBeCalled();

    // it should not call the resolver again and should return the same promise that the previous
    // call received because it is still in-progress
    expect(getExperimentValueForReceiverCall(0).enrollmentResolver()).toBe(
      resolverPromise,
    );
    expect(mockContextReceiver.mock.calls).toHaveLength(1);
    expect(mockExperimentResolver.mock.calls).toHaveLength(1);

    // once resolved async-ily
    return resolverPromise.then(() => {
      // third call has decided enrollment and has experiment details
      expect(mockContextReceiver.mock.calls).toHaveLength(2);
      expect(
        getExperimentValueForReceiverCall(1).isEnrollmentDecided,
      ).toBeTruthy();
      expect(getExperimentValueForReceiverCall(1).enrollmentDetails).toEqual(
        mockExperimentDetails,
      );
    });
  });
});
