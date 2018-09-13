import { MediaState, MediaStateManager } from './types';
import { EventDispatcher } from '../../event-dispatcher';

export default class DefaultMediaStateManager extends EventDispatcher
  implements MediaStateManager {
  private state = new Map<string, MediaState>();

  getState(id: string): MediaState | undefined {
    return this.state.get(id);
  }

  newState(id: string, newState: Partial<MediaState>) {
    const state = {
      ...(this.state.get(id) || {}),
      ...newState,
      id,
    } as MediaState;
    this.state.set(id, state);
    return state;
  }

  updateState(id: string, newState: Partial<MediaState>) {
    const state = this.newState(id, newState);
    this.emit(id, state);
    if (state.status === 'ready' || state.status === 'cancelled') {
      this.state.delete(id);
    }
    return state;
  }

  destroy() {
    this.state.clear();
    super.destroy();
  }
}
