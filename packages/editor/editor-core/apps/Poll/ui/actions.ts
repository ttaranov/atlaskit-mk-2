let VOTES = [
  {
    userId: '23123123123',
    choiceId: '1',
  },
  {
    userId: '44453564564',
    choiceId: '2',
  },
];

const TIMEOUT = 300;

// fetching votes
export const initPoll = (props: { id: string }) => {
  // TODO: fetch poll by "id", create a new poll if "id" is undefined

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ votes: VOTES });
    }, TIMEOUT);
  });
};

export const vote = (props: { choiceId: string; userId: string }) => {
  return new Promise((resolve, reject) => {
    VOTES = [...VOTES, { ...props }];

    setTimeout(() => {
      resolve({ votes: VOTES });
    }, TIMEOUT);
  });
};
