// @flow
import { Container } from 'unstated';

// TODO replace this with "unstated" when react >= 16.3 for a simpler API,
// will be able to use `state` rather than internal change listeners

type State = {
  /* Stored nodes against keys when consumers use SpotlightTarget */
  stored: { [key: string]: HTMLElement },
  /* All mounted spotlights (whether with or without SpotlightTarget), used to display Blanket etc. */
  mounted: Array<HTMLElement>,
};

export default class SpotlightRegistry extends Container<State> {
  state = {
    stored: {},
    mounted: [],
  };

  // ==============================
  // ADD & REMOVE
  // ==============================

  add(name: string, node: HTMLElement) {
    if (this.state.stored[name]) {
      console.warn(`SpotlightRegistry already has an entry for "${name}".`); // eslint-disable-line no-console
      return;
    }
    const stored = Object.assign({}, this.state.stored);
    stored[name] = node;

    this.setState({ stored });
    console.log('registry add', name, this.state.stored);
  }
  remove(name: string) {
    const stored = Object.assign({}, this.state.stored);
    if (!stored[name]) {
      console.warn(`SpotlightRegistry has no entry for "${name}".`); // eslint-disable-line no-console
      return;
    }
    delete stored[name];
    this.setState({ stored });
    console.log('registry remove', name, this.state.stored);
  }
  get(name: string) {
    console.log('registry get', name, this.state.stored);
    return this.state.stored[name];
  }

  // ==============================
  // MOUNT & UNMOUNT
  // ==============================

  mount(node: HTMLElement) {
    const mounted = this.state.mounted.slice(0);
    mounted.push(node);
    this.setState({ mounted });
    console.log('registry mount', this.state.mounted);
  }
  unmount(node: HTMLElement) {
    const mounted = this.state.mounted.slice(0).filter(i => node !== i);
    this.setState({ mounted });
    console.log('registry unmount', this.state.mounted);
  }
  hasMounted() {
    return Boolean(this.state.mounted.length);
  }
  countMounted() {
    return this.state.mounted.length;
  }
}

export type RegistryType = {
  state: State,
  add: (name: string, node: HTMLElement) => void,
  remove: (name: string) => void,
  get: (name: string) => HTMLElement,
  mount: (node: HTMLElement) => void,
  unmount: (node: HTMLElement) => void,
  hasMounted: () => boolean,
  countMounted: () => number,
};
