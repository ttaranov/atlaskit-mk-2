/* tslint:disable:no-var-requires */
import { ResumableChunk } from 'resumablejs';

import { Hasher } from './hasher';
import * as Rusha from 'rusha';

interface HasherWorker {
  worker: Worker;
  activeJobs: number;
}

export class WorkerHasher implements Hasher {
  private workers: Array<HasherWorker> = [];
  private jobs: { [id: string]: ResumableChunk } = {};

  constructor(numOfWorkers: number) {
    for (let i = 0; i < numOfWorkers; ++i) {
      this.workers.push(this.createWorker());
    }
  }

  hash(chunk: any): void {
    this.calculateHashInWorker(chunk);
  }

  private createWorker(): HasherWorker {
    const worker = Rusha.createWorker();
    const hasherWorker = { worker, activeJobs: 0 };

    worker.addEventListener('message', (event: MessageEvent) => {
      this.handleWorkerMessage(event, hasherWorker);
    });

    return hasherWorker;
  }

  private handleWorkerMessage(
    event: MessageEvent,
    hasherWorker: HasherWorker,
  ): void {
    const id = event.data.id;

    const chunk = this.jobs[id];
    if (chunk) {
      delete this.jobs[id];
      hasherWorker.activeJobs--;

      if (event.data.error) {
        this.calculateHashInWorker(chunk);
      } else {
        (chunk as any).hash = event.data.hash;
        chunk.preprocessFinished();
      }
    }
  }

  private calculateHashInWorker(chunk: ResumableChunk): void {
    const { file } = chunk.fileObj;
    const chunkBlob = file.slice(chunk.startByte, chunk.endByte);

    const jobId = chunk.fileObj.fileName + chunk.fileObjSize + chunk.startByte;
    this.jobs[jobId] = chunk;

    const worker = this.getWorker();
    this.dispatch(jobId, worker, chunkBlob);
  }

  private dispatch(
    jobId: string,
    hasherWorker: HasherWorker,
    chunkBlob: Blob,
  ): void {
    hasherWorker.activeJobs++;
    const worker = hasherWorker.worker;

    /*
     * postMessage() with chunk blob in Safari results in the error
     * "Failed to load resource: The operation couldn’t be completed. (WebKitBlobResource error 1.)"
     *
     * To prevent it, we read the data from the blob using FileReader and pass it via postMessage to the worker.
     */
    if (
      navigator.userAgent.indexOf('Safari') > -1 &&
      navigator.userAgent.indexOf('Chrome') === -1
    ) {
      const rd = new FileReader();
      rd.onload = () => {
        worker.postMessage({ id: jobId, data: rd.result });
      };
      rd.readAsBinaryString(chunkBlob);
      return;
    }

    worker.postMessage({ id: jobId, data: chunkBlob });
  }

  private getWorker(): HasherWorker {
    // Pick the worker with least number of active jobs
    return this.workers.reduce((current, next) => {
      if (next.activeJobs < current.activeJobs) {
        return next;
      }

      return current;
    }, this.workers[0]);
  }
}
