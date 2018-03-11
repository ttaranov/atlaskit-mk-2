import { UserEventName } from './tracker';
import { UserEventProperties } from './tracker';

export interface UserEventJSONRepresentation {
  name: UserEventName;
  properties: UserEventProperties;
}

export class UserEvent {
  private name: UserEventName;
  private properties: UserEventProperties;
  private prefix: string;

  constructor(name: UserEventName, properties: UserEventProperties) {
    this.prefix = 'files.mediapicker-web.';
    this.name = this.prefix + name;
    this.properties = properties;
  }

  toJSON(): UserEventJSONRepresentation {
    return {
      name: this.name,
      properties: this.properties,
    };
  }
}

export class MediaPickerLoaded extends UserEvent {
  constructor() {
    super('library.loaded', {});
  }
}

export class MPBrowserLoaded extends UserEvent {
  constructor() {
    super('browser.loaded', {});
  }
}

export class MPDropzoneLoaded extends UserEvent {
  constructor() {
    super('dropzone.loaded', {});
  }
}

export class MPClipboardLoaded extends UserEvent {
  constructor() {
    super('cliboard.loaded', {});
  }
}

/* Popup */
export class MPPopupLoaded extends UserEvent {
  constructor() {
    super('popup.loaded', {});
  }
}

export class MPPopupShown extends UserEvent {
  constructor() {
    super('popup.shown', {});
  }
}

export class MPPopupHidden extends UserEvent {
  constructor() {
    super('popup.hidden', {});
  }
}

/* File operations */
export class MPFileUploadEnded extends UserEvent {
  constructor() {
    super('file.upload.ended', {});
  }
}

export class MPFileUploadStarted extends UserEvent {
  constructor() {
    super('file.upload.started', {});
  }
}

export class MPFileProcessingStarted extends UserEvent {
  constructor() {
    super('file.processing.started', {});
  }
}

export class ErrorException extends UserEvent {
  constructor(
    errorAlias: string,
    errorStack: string,
    errorDescription?: string,
  ) {
    const errorMessage = {
      alias: errorAlias,
      description: errorDescription,
      stacktrace: errorStack,
    };

    super('files.mediapicker-web.library.exception.fired', <any>errorMessage);
  }
}
