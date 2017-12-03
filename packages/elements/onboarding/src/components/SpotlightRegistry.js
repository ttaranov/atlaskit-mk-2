// @flow
export default class SpotlightRegistry {
  _store = {};
  _mounted = [];
  _eventListeners = {};

  notifyChange(name: string, ...args) {
    if (this._eventListeners[name]) {
      this._eventListeners[name].forEach(fn => {
        fn(...args);
      });
    }
  }
  addChangeListener(name, fn) {
    if (!this._eventListeners[name]) {
      this._eventListeners[name] = [];
    }

    this._eventListeners[name].push(fn);
  }
  removeChangeListener(name, fn) {
    if (this._eventListeners[name]) {
      this._eventListeners[name] = this._eventListeners[name].filter(
        i => fn !== i,
      );
    }
  }

  add(name: string, node) {
    if (this._store[name]) {
      console.warn(
        `SpotlightRegistry already has an entry for "${
          name
        }". Please try something else.`,
      ); // eslint-disable-line no-console
      return;
    }

    this._store[name] = node;
    this.notifyChange('add', name);
  }
  get(name) {
    return this._store[name];
  }
  remove(name) {
    if (this._store[name]) {
      delete this._store[name];
      this.notifyChange('remove', name);
    }
  }

  mount(name) {
    this._mounted.push(name);
    this.notifyChange('mount', name);
  }
  unmount(name) {
    this._mounted = this._mounted.filter(i => name !== i);
    this.notifyChange('unmount', name);
  }
}
