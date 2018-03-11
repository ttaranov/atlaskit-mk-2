// @flow
import { type Node } from 'react';

export default class SpotlightRegistry {
  store = {};
  mounted = [];
  eventListeners = {};

  notifyChange(name: string, ...args: any) {
    if (this.eventListeners[name]) {
      this.eventListeners[name].forEach(fn => {
        fn(...args);
      });
    }
  }
  addChangeListener(name: string, fn: () => void) {
    if (!this.eventListeners[name]) {
      this.eventListeners[name] = [];
    }

    this.eventListeners[name].push(fn);
  }
  removeChangeListener(name: string, fn: () => void) {
    if (this.eventListeners[name]) {
      this.eventListeners[name] = this.eventListeners[name].filter(
        i => fn !== i,
      );
    }
  }

  add(name: string, node: Node) {
    if (this.store[name]) {
      // eslint-disable-next-line no-console
      console.warn(
        `SpotlightRegistry already has an entry for "${name}". Please try something else.`,
      ); // eslint-disable-line no-console
      return;
    }

    this.store[name] = node;
    this.notifyChange('add', name);
  }
  get(name: string) {
    return this.store[name];
  }
  remove(name: string) {
    if (this.store[name]) {
      delete this.store[name];
      this.notifyChange('remove', name);
    }
  }

  mount(name: string) {
    this.mounted.push(name);
    this.notifyChange('mount', name);
  }
  unmount(name: string) {
    this.mounted = this.mounted.filter(i => name !== i);
    this.notifyChange('unmount', name);
  }
}
