import { replaceRaf } from 'raf-stub';

replaceRaf([global, typeof window !== 'undefined' ? window : {}]);
