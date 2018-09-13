import { Action } from 'redux';
import {
  GasCorePayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { HandlerResult } from '../..';

export type BasePayload = GasCorePayload | GasScreenEventPayload;
export type Payload = { action?: string } & BasePayload;

export const createVerificationForHandler = (
  handler: (action: Action) => HandlerResult,
) => {
  return (action: Action, payload: Payload[] | undefined) => {
    if (payload !== undefined) {
      expect(handler(action)).toMatchObject(payload);
    } else {
      expect(handler(action)).toBeUndefined();
    }
  };
};
