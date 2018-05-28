import { Hasher } from './hasher';

import { SimpleHasher } from './simpleHasher';
import { WorkerHasher } from './workerHasher';

let hasher: Hasher | null = null;

export const destroyHasher = () => (hasher = null);

export const createHasher = (): Hasher => {
  const numWorkers = 3;

  if (!hasher) {
    try {
      hasher = new WorkerHasher(numWorkers);
    } catch (error) {
      hasher = new SimpleHasher();
    }
  }

  return hasher;
};
