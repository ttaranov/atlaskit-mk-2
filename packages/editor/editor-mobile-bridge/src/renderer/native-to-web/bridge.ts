import { TaskState } from '@atlaskit/task-decision';

export interface TaskDecisionBridge {
  onTaskUpdated(localId: string, state: TaskState);
}

export interface PromiseBridge {
  onPromiseResolved(uuid: string, payload: string);
  onPromiseRejected(uuid: string);
}

export default interface RendererBridge
  extends TaskDecisionBridge,
    PromiseBridge {
  setContent(content: string);
}
