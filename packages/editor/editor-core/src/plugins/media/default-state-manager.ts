import { MediaState, MediaStateManager, MediaStateStatus } from './types';
import { EventDispatcher } from '../../event-dispatcher';
import { MediaFile } from '@atlaskit/media-picker';

export default class DefaultMediaStateManager extends EventDispatcher
  implements MediaStateManager {
  private state = new Map<string, MediaState>();

  getState(tempId: string): MediaState | undefined {
    return this.state.get(tempId);
  }

  newState(file: MediaFile, status: MediaStateStatus, publicId?: string) {
    const getState = this.state.get(`temporary:${file.id}`);
    const newPublicId = publicId ? { publicId } : {};
    return {
      ...getState,
      id: `temporary:${file.id}`,
      fileName: file.name,
      fileSize: file.size,
      fileMimeType: file.type,
      status,
      ...newPublicId,
    };
  }

  updateState(tempId: string, newState: Partial<MediaState>) {
    const state = {
      ...(this.state.get(tempId) || {}),
      ...newState,
    } as MediaState;

    this.state.set(tempId, state);
    this.emit(tempId, state);
  }
}
