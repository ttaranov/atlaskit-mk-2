// @flow
import {
  akColorN0,
  akColorN20,
  akColorN800,
  akColorB50,
  akColorB100,
} from '@atlaskit/util-shared-styles';

export default {
  thumb: {
    background: {
      normal: akColorN0,
      focus: akColorN0,
    },
    border: {
      normal: akColorN800,
      focus: akColorB100,
    },
  },
  track: {
    background: {
      normal: akColorN20,
      focus: akColorB50,
    },
  },
};
