// @flow
import tabbable from 'tabbable';
import focusin from 'focusin';

// undefined means the boundary itself should be focused
// false means the user has set autoFocus on an element inside the boundary
// true focuses the first focusable element insidethe boundary
// a function should return an element inside the boundary to focus.
export type AutoFocus = boolean | (() => HTMLElement) | void;
export type Boundary = HTMLElement;
export type TeardownOptions = { shouldRestoreFocus: boolean };
type LockOptions = { autoFocus: AutoFocus, boundary: Boundary };

export default class FocusLockRegistry {
  currentLock: Boundary | null = null;
  focusTarget: HTMLElement | null;
  isPolyfilled: boolean = false;
  originalTabindex: string; // numeric string
  storedElements: Array<HTMLElement> = [];

  // lazily polyfill focusin for firefox
  polyfillFocusIn() {
    if (this.isPolyfilled) return;

    focusin.polyfill();
    this.isPolyfilled = true;
  }

  // ==============================
  // Registry
  // ==============================

  addLock({ autoFocus, boundary }: LockOptions) {
    // NOTE: Only one element can be focused at a time.
    // Teardown all instances of FocusLock before another
    // initialises (mounts or becomes `enabled`).
    this.clearLock({ shouldRestoreFocus: false });

    // store the last activeElement
    this.storeFocus();

    this.currentLock = boundary;
    this.focusTarget = this.findFocusTarget(autoFocus);

    document.addEventListener('focusin', this.handleFocusIn);
    document.addEventListener('keydown', this.handleKeyDown);

    // ensure that "focusin" has something to focus
    if (boundary && autoFocus === undefined) {
      this.originalTabindex = boundary.getAttribute('tabindex') || '';

      // catch negative indexes
      const idx = parseInt(this.originalTabindex, 10);
      if (!idx || (idx && idx < 0)) boundary.setAttribute('tabindex', '0');
    }

    // false means the user has set autoFocus on an element inside the boundary.
    // In that case, nothing to do.
    if (autoFocus !== false) {
      // initial focus call
      this.handleFocus();
    }
  }

  clearLock(options: TeardownOptions) {
    document.removeEventListener('focusin', this.handleFocusIn);
    document.removeEventListener('keydown', this.handleKeyDown);

    // restore original tabindex if any
    if (this.currentLock && this.originalTabindex) {
      if (this.originalTabindex) {
        this.currentLock.setAttribute('tabindex', this.originalTabindex);
      } else {
        this.currentLock.removeAttribute('tabindex');
      }
    }

    if (options.shouldRestoreFocus) {
      this.restoreFocus();
    }

    this.currentLock = null;
  }

  register({ autoFocus, boundary }: LockOptions) {
    this.polyfillFocusIn();
    this.addLock({ autoFocus, boundary });
  }

  unregister(options: TeardownOptions) {
    this.clearLock(options);
  }

  // ==============================
  // Focus Store
  // ==============================

  storeFocus = () => {
    const activeEl = document.activeElement;

    if (activeEl) this.storedElements.push(activeEl);
  };

  clearStoredFocus = () => {
    this.storedElements = [];
  };

  restoreFocus = () => {
    if (!this.storedElements.length) return;

    try {
      const target = this.storedElements[this.storedElements.length - 1];

      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.error(err); // eslint-disable-line no-console
      }
    }

    this.storedElements.pop();
  };

  // ==============================
  // Handlers
  // ==============================

  handleFocus = () => {
    if (this.focusTarget) this.focusTarget.focus();
  };

  // catch focus if the target is outside the locked element
  handleFocusIn = (event: FocusEvent) => {
    const { target } = event;
    if (!(target instanceof HTMLElement)) return;

    const shouldFocus =
      this.currentLock &&
      this.currentLock !== target &&
      !this.currentLock.contains(target);

    if (shouldFocus) this.handleFocus();
  };

  // loop back to the first tabbable element from the last
  // Do not destructure methods like preventDefault from event.
  // Doing so changes the 'this' context from event to the handleKeyDown function.
  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const els = tabbable(this.currentLock);
    const first = els[0];
    const last = els[els.length - 1];

    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }
  };
  findFocusTarget(autoFocus: AutoFocus) {
    const hasFocusFunc = typeof autoFocus === 'function';
    const focusFirstAvailable = (autoFocus && !hasFocusFunc) || false;
    const defaultTarget = this.currentLock;

    // get the first tabbable element e.g. anchor, button, [tabIndex >= 0]
    if (focusFirstAvailable) {
      const els = tabbable(this.currentLock);
      return els[0];
    }

    // call the consumer's ref function to get a target
    if (typeof autoFocus === 'function') {
      const focusTarget = autoFocus();

      // check that the provided focusTarget is what we expect, warn otherwise
      if (!focusTarget || typeof focusTarget.focus !== 'function') {
        console.warn('Invalid `autoFocus` provided:', focusTarget); // eslint-disable-line no-console
        return defaultTarget;
      }

      return focusTarget;
    }

    // if nothing can be found, allow focus on the boundary element itself
    return defaultTarget;
  }
}
