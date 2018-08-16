export const SET_UPFRONT_ID_DEFERRED = 'SET_UPFRONT_ID_DEFERRED';

export interface SetUpfrontIdDeferred {
  readonly type: 'SET_UPFRONT_ID_DEFERRED';
  readonly id: string;
  readonly resolver: Function;
  readonly rejecter: Function;
}

export function setUpfrontIdDeferred(
  id: string,
  resolver: Function,
  rejecter: Function,
): SetUpfrontIdDeferred {
  return {
    type: SET_UPFRONT_ID_DEFERRED,
    id,
    resolver,
    rejecter,
  };
}
