// TODO: Create a PR for herment, so we wouldn't need to have the library here — FIL-2022

export interface InternalStorage {
  storage: any;
  getItem: (key: string) => any;
  setItem: (key: string, value: any) => void;
  clear: () => void;
}

export interface Utilities {
  internalStorage: InternalStorage;
  getLocalStorage: () => Storage;
  getSessionStorage: () => Storage;
  getInternalStorage: () => InternalStorage;
  getStorage: () => Storage | InternalStorage;
  isCORSRequest: (url: string) => boolean;
  getCookieValue: (name: string) => any;
}

const utils: Utilities = {
  internalStorage: {
    storage: {},

    getItem(key: string): any {
      return this.storage[key];
    },

    setItem(key: string, value: any): void {
      this.storage[key] = value;
    },

    clear(): void {
      this.storage = {};
    },
  },

  getLocalStorage(): Storage {
    return window.localStorage;
  },

  getSessionStorage(): Storage {
    return window.sessionStorage;
  },

  getInternalStorage(): InternalStorage {
    return this.internalStorage;
  },

  getStorage(): any {
    try {
      const localStorage = this.getLocalStorage();
      if (localStorage) {
        return localStorage;
      }

      const sessionStorage = this.getSessionStorage();
      if (sessionStorage) {
        return sessionStorage;
      }
    } catch (err) {
      return this.getInternalStorage();
    }
  },

  isCORSRequest(url: string): boolean {
    const parser = document.createElement('a');
    parser.href = url;
    return parser.host !== window.location.host;
  },

  getCookieValue(name: string): any {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  },
};

export interface Herment {
  STORAGE_KEY_PREAMBLE: string;
  MAXEVENTS: number;
  PUBLISH_INTERVAL: number;
  SAVE_INTERVAL: number;

  isStarted: boolean;
  config: any;
  storage: any;

  initialSaveTimeout: number;
  publishInterval: number;
  saveInterval: number;

  getAtlPath: () => any;
  getServerName: () => string;
  getProductNameFromServerName: () => string;
  getSubdomain: (fullServerName: string) => string;

  generateRandomStorageKey: () => string;
  ajaxPost: (postUrl: string, postBody: any) => void;

  parseConfig: (options: any) => any;
  pushToServer: (events: any, ajaxCall: any) => void;

  start: () => void;
  stop: () => void;
  destroy: () => void;
}

class HermentImpl implements Herment {
  STORAGE_KEY_PREAMBLE: string = 'herment';
  MAXEVENTS: number = 100;
  PUBLISH_INTERVAL: number = 5000;
  SAVE_INTERVAL: number = 1000;
  isStarted: boolean = false;

  config: any;
  storage: any;

  initialSaveTimeout: number;
  publishInterval: number;
  saveInterval: number;

  constructor(options: any) {
    this.config = this.parseConfig(options);
    this.storage = utils.getStorage();

    window.addEventListener('unload', () => this.moveQueueToStorage());
  }

  /**
   * Retrieves the __atl_path cookie value
   */
  getAtlPath(): any {
    return utils.getCookieValue('__atl_path');
  }

  /**
   * Identifies the server name by the url and returns
   * Called in publish
   */
  getServerName(): string {
    return document.location.hostname;
  }

  /**
   * Computes server name based on the serverName
   * Called in publish
   */
  getProductNameFromServerName(localServerName?: string): string {
    if (localServerName !== undefined) {
      return localServerName
        .replace('.com', '')
        .replace('.net', '')
        .replace('.org', '')
        .replace('.au', '')
        .replace('.io', '');
    }

    return '-';
  }

  /**
   * Extracts sub-domain or '-'
   * Called in addEventsToArray
   */
  getSubdomain(fullServerName: string): string {
    const domain = fullServerName.match(
      /^([a-z0-9\.]*)[\-\.]{1}([a-z0-9]+)+\.([a-z]{2,6})$/i,
    );

    if (domain) {
      let parts = fullServerName.split('.');

      if (parts[parts.length - 1].length === 2) {
        parts = parts.slice(0, parts.length - 3);
      } else {
        parts = parts.slice(0, parts.length - 2);
      }

      if (parts.length !== 0) {
        return parts.join('.');
      }
    }

    return '-';
  }

  /**
   * Generate random number that's
   *  - unique
   *  - limited to 20 characters
   */
  generateRandomStorageKey(): string {
    const stringSliceIndex1 = 2;
    const stringSliceIndex2 = 12;

    const firstHalf = (Math.random() + '').slice(
      stringSliceIndex1,
      stringSliceIndex2,
    );
    const secondHalf = (Math.random() + '').slice(
      stringSliceIndex1,
      stringSliceIndex2,
    );
    return firstHalf.concat(secondHalf);
  }

  /**
   * ajax simple no-jquery post with fixed headers
   */
  ajaxPost(postUrl: string, postBody: any): void {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', postUrl, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*;');
    xhr.send(postBody);
  }

  parseConfig(options: any = {}): any {
    const castedWindow: any = window as any;
    const ajsQueue = castedWindow.AJS ? castedWindow.AJS.EventQueue : [];
    const queue = options.queue || ajsQueue;

    const gasScheme: string = options.analyticsscheme || 'https';
    const gasServer: string =
      options.analyticsserver || 'analytics.atlassian.com';
    const gasUrl: string = options.analyticsurl || '/analytics/events';

    const serverName: string = options.server || this.getServerName();
    const productName: string =
      options.product || this.getProductNameFromServerName(serverName);
    const subProductName: string =
      options.subproduct || this.getSubdomain(serverName) || '-';

    const version = options.version;
    const session = options.session;
    const sen = options.sen;
    const sourceIP = options.sourceIP;
    const atlPath = options.atlpath || this.getAtlPath();

    const ajax = options.ajax || this.ajaxPost;

    const maxevents: number = options.maxevents || this.MAXEVENTS;
    const storageKey: string =
      options.storage_key ||
      this.STORAGE_KEY_PREAMBLE +
        this.generateRandomStorageKey() +
        this.generateRandomStorageKey();
    const user: string = options.user || 'default';

    const publishInterval: number =
      options.publish_interval || this.PUBLISH_INTERVAL;
    const saveInterval: number = options.save_interval || this.SAVE_INTERVAL;

    return {
      queue,
      gasScheme,
      gasServer,
      gasUrl,
      serverName,
      productName,
      subProductName,
      version,
      session,
      sen,
      sourceIP,
      atlPath,
      post: ajax,
      maxevents,
      storageKey,
      user,
      publishInterval,
      saveInterval,
    };
  }

  /**
   * Does the actual ajax call to the server
   */
  pushToServer(events: any, ajaxCall: any): void {
    const { gasScheme, gasServer, gasUrl } = this.config;

    const ajax = ajaxCall || this.config.post;
    const postTo = gasScheme + '://' + gasServer + gasUrl;
    const postString = JSON.stringify({ events });

    ajax(postTo, postString);
  }

  /**
   * Supplementary function; Adds all events from a given array, to the destination one.
   * Adds a few common parameters to each of the events
   */
  addEventsToArray(inputEvents: any, resultingArray: any, state: any): void {
    if (
      !state ||
      !state.server ||
      !state.product ||
      !state.subproduct ||
      !state.user
    ) {
      return;
    }

    for (let i in inputEvents) {
      if (inputEvents.hasOwnProperty(i)) {
        const e = inputEvents[i];

        if (resultingArray.length >= this.config.maxevents) {
          return;
        }

        if (e.name && e.properties) {
          // check and update event contents
          const event = {
            name: e.name,
            properties: e.properties,
            serverTime: e.time || new Date().getTime(),
            server: state.server,
            user: state.user,
            product: state.product,
            subproduct: state.subproduct,
            version: state.version,
            session: state.session,
            sen: state.sen,
            sourceIP: state.sourceIP,
            atlPath: state.atlPath,
          };

          resultingArray.push(event);
        }
      }
    }
  }

  /**
   * Does trawl through the queue events and if finds any packages them up
   * and calls SenderNS.pushToServer for ajax post
   */
  publishFromQueueAndStorage(pushServer?: any): void {
    try {
      const pushEvents = pushServer || this.pushToServer.bind(this);
      const events: Array<any> = [];

      if (
        this.config.queue.length < 1 &&
        (typeof this.storage === 'undefined' || this.storage.length < 1)
      ) {
        return;
      }

      const state = {
        server: this.config.serverName,
        user: this.config.user,
        product: this.config.productName,
        subproduct: this.config.subProductName,
        version: this.config.version,
        session: this.config.session,
        sen: this.config.sen,
        sourceIP: this.config.sourceIP,
        atlPath: this.config.atlPath,
      };

      this.addEventsToArray(this.config.queue, events, state);

      const storedEvents = this.popEventsFromStorage();
      this.addEventsToArray(storedEvents, events, state);
      this.config.queue.length = 0;

      // POST events to the server
      if (events && events.length) {
        pushEvents(events);
      }
    } catch (e) {
      /*do nothing*/
    }
  }

  /**
   * Serialises events list to a string.
   */
  serialiseEventsToString(events: any): string {
    return JSON.stringify(events);
  }

  /**
   * De-serialises string to a JSON.
   */
  deserialiseEvents(eventsString: string): any {
    return JSON.parse(eventsString);
  }

  /**
   * Stores events from the parameter to the sessionStorage
   */
  storeEvents(events: any): void {
    if (!this.storage) {
      return;
    }

    try {
      if (this.storage[this.config.storageKey]) {
        const olderEvents =
          this.deserialiseEvents(this.storage[this.config.storageKey]) || [];

        if (olderEvents.length < this.config.maxevents) {
          olderEvents.push.apply(olderEvents, events);
        }

        events = olderEvents;
      }

      this.storage.setItem(
        this.config.storageKey,
        this.serialiseEventsToString(events),
      );
    } catch (e) {
      /*do nothing*/
    }
  }

  /**
   * Takes all events from the sessionStorage, removes them from sessionStorage and returns them
   * @returns {*} events Array
   */
  popEventsFromStorage(): Array<any> {
    if (!this.storage) {
      return [];
    }

    try {
      if (this.storage[this.config.storageKey]) {
        const events = this.deserialiseEvents(
          this.storage[this.config.storageKey],
        );
        this.storage[this.config.storageKey] = this.serialiseEventsToString([]);
        return events;
      }
    } catch (e) {
      /*do nothing*/
    }

    return [];
  }

  /**
   * Moves all of the events from the queue to the sessionStorage
   */
  moveQueueToStorage(): void {
    if (this.config.queue.length === 0 || !this.storage) {
      return;
    }

    this.storeEvents(this.config.queue);
    this.config.queue.length = 0;
  }

  /**
   * Called when this script is sourced. Creates a timer to call SenderNS.publishFromQueueAndStorage in intervals.
   * Also calls moveQueueToStorage each 1000ms to move any queued events to the storage, so to preserve any
   * events in the queue in case user navigates away
   */
  start(): void {
    this.isStarted = true;
    const arrayPush = Array.prototype.push;

    this.config.queue.push = (obj: any): void => {
      obj.time = new Date().getTime();
      arrayPush.call(this.config.queue, obj);
    };

    // first publish a second later
    this.initialSaveTimeout = setTimeout(
      this.publishFromQueueAndStorage.bind(this),
      this.config.saveInterval,
    );

    // Snapshot to storage every 1s and post to server every 5s
    this.publishInterval = setInterval(
      this.publishFromQueueAndStorage.bind(this),
      this.config.publishInterval,
    );
    this.saveInterval = setInterval(
      this.moveQueueToStorage.bind(this),
      this.config.saveInterval,
    );
  }

  /**
   * Publishes saved events and resets intervals
   */
  stop(): void {
    this.isStarted = false;

    // publish all saved events and stop intervals/timeouts
    this.publishFromQueueAndStorage();
    clearTimeout(this.initialSaveTimeout);
    clearInterval(this.saveInterval);
    clearInterval(this.publishInterval);
  }

  destroy(): void {
    this.stop();
  }
}

let hermentClient: any;

const herment = ((): any => {
  const init = (config: any): any => {
    if (!hermentClient) {
      hermentClient = new HermentImpl(config);
      return hermentClient;
    }

    hermentClient.stop();
    hermentClient.config = hermentClient.parseConfig(config);
  };

  return init;
})();

export default herment;
