import { Hasher } from './hasher';

import { SimpleHasher } from './simpleHasher';
import { WorkerHasher } from './workerHasher';

export const createHasher = () => {
  const numWorkers = 3;

  let hasher: Hasher;

  try {
    hasher = new WorkerHasher(numWorkers);
  } catch (error) {
    hasher = new SimpleHasher();
  }

  return hasher;
};
