export type Outcome<Data, Err = Error> =
  | {
      status: 'PENDING';
    }
  | {
      status: 'SUCCESSFUL';
      data: Data;
    }
  | {
      status: 'FAILED';
      err: Err;
    };

export const Outcome = {
  successful<Data, Err>(data: Data): Outcome<Data, Err> {
    return { status: 'SUCCESSFUL', data };
  },

  pending<Data, Err>(): Outcome<Data, Err> {
    return { status: 'PENDING' };
  },

  failed<Data, Err>(err: Err): Outcome<Data, Err> {
    return { status: 'FAILED', err };
  },

  whenSuccessful<Data, Err>(
    outcome: Outcome<Data, Err>,
    successful: (data: Data) => void,
  ): void {
    if (outcome.status === 'SUCCESSFUL') {
      successful(outcome.data);
    }
  },

  whenPending<Data, Err>(
    outcome: Outcome<Data, Err>,
    pending: () => void,
  ): void {
    if (outcome.status === 'PENDING') {
      pending();
    }
  },

  whenFailed<Data, Err>(
    outcome: Outcome<Data, Err>,
    failed: (err: Err) => void,
  ): void {
    if (outcome.status === 'FAILED') {
      failed(outcome.err);
    }
  },

  match<Data, Err, Result>(
    outcome: Outcome<Data, Err>,
    {
      successful,
      pending,
      failed,
    }: {
      successful: (data: Data) => Result;
      pending: () => Result;
      failed: (err: Err) => Result;
    },
  ): Result {
    switch (outcome.status) {
      case 'SUCCESSFUL':
        return successful(outcome.data);
      case 'PENDING':
        return pending();
      case 'FAILED':
        return failed(outcome.err);
    }
  },

  mapSuccessful<Data, Err, MappedData>(
    outcome: Outcome<Data, Err>,
    map: (data: Data) => MappedData,
  ): Outcome<MappedData, Err> {
    if (outcome.status === 'SUCCESSFUL') {
      return Outcome.successful(map(outcome.data));
    } else {
      return outcome;
    }
  },

  mapFailed<Data, Err, MappedErr>(
    outcome: Outcome<Data, Err>,
    map: (err: Err) => MappedErr,
  ): Outcome<Data, MappedErr> {
    if (outcome.status === 'FAILED') {
      return Outcome.failed(map(outcome.err));
    } else {
      return outcome;
    }
  },
};
