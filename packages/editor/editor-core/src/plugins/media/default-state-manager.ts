import { MediaState, MediaStateManager, MediaStateStatus } from './types';
import { EventDispatcher } from '../../event-dispatcher';

export default class DefaultMediaStateManager extends EventDispatcher
  implements MediaStateManager {
  private state = new Map<string, MediaState>();

  getState(id: string): MediaState | undefined {
    return this.state.get(id);
  }

  newState(id: string, file: any, status: MediaStateStatus) {
    const getState = this.state.get(id);
    return {
      ...getState,
      id,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      dimensions: file.dimensions!,
      status,
    };
  }

  updateState(id: string, newState: Partial<MediaState>) {
    const state = {
      ...(this.state.get(id) || {}),
      ...newState,
    } as MediaState;

    this.state.set(id, state);
    this.emit(id, state);
  }
}
