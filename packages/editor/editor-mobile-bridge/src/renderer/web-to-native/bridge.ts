import { TaskState } from '@atlaskit/task-decision';

export interface TaskDecisionBridge {
  updateTask(taskId: string, state: TaskState);
}

export interface LinkBridge {
  onLinkClick(url: string);
}

export default interface WebBridge extends LinkBridge, TaskDecisionBridge {}

declare global {
  interface Window {
    linkBridge?: LinkBridge;
    taskDecisionBridge?: TaskDecisionBridge;
    webkit?: any;
  }
}
