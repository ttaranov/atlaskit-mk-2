import { MediaState, MediaStateManager } from './types';
import { EventDispatcher } from '../../editor/event-dispatcher';

export default class DefaultMediaStateManager extends EventDispatcher
  implements MediaStateManager {
  private state = new Map<string, MediaState>();

  getState(tempId: string): MediaState | undefined {
    return this.state.get(tempId);
  }

  updateState(tempId: string, newState: MediaState) {
    const state = {
      ...(this.state.get(tempId) || {}),
      ...newState,
    };

    this.state.set(tempId, state);
    this.emit(tempId, state);
  }
}
