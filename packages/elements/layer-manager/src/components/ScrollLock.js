// @flow
import { Component } from 'react';

const STYLE_KEYS = [
  'boxSizing',
  'height',
  'overflow',
  'paddingRight',
  'position',
];
const LOCK_STYLES = {
  boxSizing: 'border-box', // account for possible declaration `width: 100%;` on body
  overflow: 'hidden',
  position: 'relative',
  height: '100%',
};

let activeScrollLocks = 0;
type Props = {};

type TargetStyle = { [key: string]: string | null };

export default class ScrollLock extends Component<Props> {
  originalStyles = {}; // eslint-disable-line react/sort-comp
  componentDidMount() {
    const target = document.body;
    const targetStyle = target && (target.style: TargetStyle);

    // store any styles already applied to the body
    STYLE_KEYS.forEach(key => {
      const val = targetStyle && targetStyle[key];
      this.originalStyles[key] = val;
    });

    // apply the target padding if this is the first scroll lock
    if (activeScrollLocks < 1) {
      const currentPadding = parseInt(this.originalStyles.paddingRight, 10);
      const clientWidth = document.body ? document.body.clientWidth : 0;
      const adjustedPadding =
        window.innerWidth - clientWidth + currentPadding || 0;

      Object.keys(LOCK_STYLES).forEach(key => {
        const val = LOCK_STYLES[key];
        if (targetStyle) {
          targetStyle[key] = val;
        }
      });

      if (targetStyle) {
        targetStyle.paddingRight = `${adjustedPadding}px`;
      }
    }

    // increment active scroll locks
    activeScrollLocks += 1;
  }
  componentWillUnmount() {
    const target = document.body;
    const targetStyle = target && (target.style: TargetStyle);

    // safely decrement active scroll locks
    activeScrollLocks = Math.max(activeScrollLocks - 1, 0);

    // reapply original body styles, if any
    if (activeScrollLocks < 1) {
      STYLE_KEYS.forEach(key => {
        const val = this.originalStyles[key];
        if (targetStyle) {
          targetStyle[key] = val;
        }
      });
    }
  }
  render() {
    return null;
  }
}
