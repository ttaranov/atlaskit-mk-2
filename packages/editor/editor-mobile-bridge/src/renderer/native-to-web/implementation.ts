import RendererBridge from './bridge';
import { eventDispatcher } from '../dispatcher';
import { resolvePromise, rejectPromise } from '../../cross-platform-promise';
import { TaskState, ObjectKey } from '@atlaskit/task-decision';
import { TaskDecisionProviderImpl } from '../../providers/taskDecisionProvider';

export default class RendererBridgeImpl implements RendererBridge {
  taskDecisionProvider: TaskDecisionProviderImpl;
  containerAri: string;
  objectAri: string;

  /** Renderer bridge MVP to set the content */
  setContent(content: string) {
    if (eventDispatcher) {
      try {
        content = JSON.parse(content);
      } catch (e) {
        return;
      }
      eventDispatcher.emit('setRendererContent', { content });
    }
  }

  onPromiseResolved(uuid: string, payload: string) {
    resolvePromise(uuid, JSON.parse(payload));
  }

  onPromiseRejected(uuid: string) {
    rejectPromise(uuid);
  }

  onTaskUpdated(taskId: string, state: TaskState) {
    if (this.taskDecisionProvider) {
      const key: ObjectKey = {
        localId: taskId,
        objectAri: this.objectAri,
        containerAri: this.containerAri,
      };

      this.taskDecisionProvider.notifyUpdated(key, state);
    }
  }
}
