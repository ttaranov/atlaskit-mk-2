import { HttpError as RestClientHttpError } from '../../model/errors';

// tslint:disable-next-line no-any
export type CallbackArguments = any[];
// tslint:disable-next-line no-any
export type RequestData = any;

type ChildRenderProp = (
  renderArgs: {
    data: RequestData;
    loading: boolean;
    error: RestClientHttpError;
  },
  sendRequest: (...args: CallbackArguments) => Promise<void>,
) => React.ReactNode;

export interface RequestProps {
  /** Make request when Request component mounts */
  fireOnMount?: boolean;
  /** The request whose lifecycle this component reports on */
  request: (...args: CallbackArguments) => Promise<RequestData>;
  /** Child render function */
  children: ChildRenderProp;
  /** Default arguments to call `request` with */
  variables?: CallbackArguments;
}

export interface RequestState {
  /** True if the request is in flight */
  loading: boolean;
  /** Contains the error when the request fails. Undefined when there is no error. */
  error: RestClientHttpError;
  /** Contains the response data when the request was successful. Undefined initially and when there is an error. */
  data: RequestData;
}
