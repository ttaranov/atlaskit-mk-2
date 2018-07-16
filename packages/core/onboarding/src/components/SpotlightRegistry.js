// @flow
import { Container } from 'unstated';

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
  activeElement: HTMLElement | null = null;

  // ==============================
  // ADD & REMOVE
  // ==============================

  add(name: string, node: HTMLElement) {
    const stored = Object.assign({}, this.state.stored);
    if (stored[name]) {
      console.warn(`SpotlightRegistry already has an entry for "${name}".`); // eslint-disable-line no-console
      return;
    }
    stored[name] = node;

    this.setState({ stored });
  }
  remove(name: string) {
    const stored = Object.assign({}, this.state.stored);
    if (!stored[name]) {
      console.warn(`SpotlightRegistry has no entry for "${name}".`); // eslint-disable-line no-console
      return;
    }
    delete stored[name];
    this.setState({ stored });
  }
  get(name: string) {
    return this.state.stored[name];
  }

  // ==============================
  // MOUNT & UNMOUNT
  // ==============================

  mount(node: HTMLElement) {
    if (this.state.mounted.length === 0) {
      this.activeElement = document.activeElement;
    }
    const mounted = this.state.mounted.slice(0);
    mounted.push(node);
    this.setState({ mounted });
  }
  unmount(node: HTMLElement) {
    const mounted = this.state.mounted.slice(0).filter(i => node !== i);
    if (mounted.length === 0) {
      setTimeout(() => {
        if (this.activeElement) {
          this.activeElement.focus();
          this.activeElement = null;
        }
      }, 0);
    }
    this.setState({ mounted });
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
