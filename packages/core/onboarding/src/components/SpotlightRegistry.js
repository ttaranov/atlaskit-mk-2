// @flow
import { type Node } from 'react';

// TODO replace this with "unstated" when react >= 16.3 for a simpler API,
// will be able to use `state` rather than internal change listeners

export default class SpotlightRegistry {
  store = {};
  mounted = [];
  eventListeners = {};

  // ==============================
  // CHANGE LISTENERS
  // ==============================

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

  // ==============================
  // ADD & REMOVE
  // ==============================

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

  // ==============================
  // MOUNT & UNMOUNT
  // ==============================

  mount(node: HTMLElement) {
    this.mounted.push(node);
    this.notifyChange('mount', node);
  }
  unmount(node: HTMLElement) {
    this.mounted = this.mounted.filter(i => node !== i);
    this.notifyChange('unmount', node);
  }
  hasMounted() {
    return Boolean(this.mounted.length);
  }
  countMounted() {
    return this.mounted.length;
  }
}
