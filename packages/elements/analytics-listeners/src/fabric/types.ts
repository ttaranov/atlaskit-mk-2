import { GasPayload } from '@atlaskit/analytics-gas-types';
export type event = {
  payload: GasPayload;
  context: Array<{}>;
};
export type ListenerFunction = (event: event) => void;
