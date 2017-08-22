// @flow
import {
  akColorN800,
  akColorG200,
  akColorP100,
  akColorT200,
  akColorR100,
  akColorB100,
  akColorY200,
  akColorN0,
  akColorN500,
  akColorG500,
  akColorG100,
  akColorP500,
  akColorP75,
  akColorT100,
  akColorR75,
  akColorB75,
  akColorY100,
  akColorN30,
  akColorB500,
  akColorB400,
  akColorN50,
  akColorP50,
  akColorT75,
  akColorB50,
  akColorN700,
  akColorG75,
  akColorR50,
  akColorY75,
  akColorN20,
} from '@atlaskit/util-shared-styles';

type color = {|
  normal: {
    text: string,
    background: string,
  },
  hover: {
    text: string,
    background: string,
  }
|}

type tag = {|
  green: color,
  standard: color,
  blue: color,
  red: color,
  purple: color,
  grey: color,
  teal: color,
  yellow: color,
  greenLight: color,
  blueLight: color,
  redLight: color,
  purpleLight: color,
  greyLight: color,
  tealLight: color,
  yellowLight: color,
|}

const theme: { tag: tag } = {
  tag: {
    standard: {
      normal: {
        text: akColorN700,
        background: akColorN20,
      },
      hover: {
        text: akColorN700,
        background: akColorN30,
      },
    },
    green: {
      normal: {
        text: akColorN800,
        background: akColorG200,
      },
      hover: {
        text: akColorB400,
        background: akColorG100,
      },

    },
    purple: {
      normal: {
        text: akColorN800,
        background: akColorP100,
      },
      hover: {
        text: akColorB400,
        background: akColorP75,
      },
    },
    red: {
      normal: {
        text: akColorN800,
        background: akColorR100,
      },
      hover: {
        text: akColorB400,
        background: akColorR75,
      },
    },
    yellow: {
      normal: {
        text: akColorN800,
        background: akColorY200,
      },
      hover: {
        text: akColorB400,
        background: akColorY100,
      },
    },
    grey: {
      normal: {
        text: akColorN0,
        background: akColorN500,
      },
      hover: {
        text: akColorB400,
        background: akColorN50,
      },
    },
    teal: {
      normal: {
        text: akColorN800,
        background: akColorT200,
      },
      hover: {
        text: akColorB400,
        background: akColorT100,
      },

    },
    blue: {
      normal: {
        text: akColorN800,
        background: akColorB100,
      },
      hover: {
        text: akColorB400,
        background: akColorB75,
      },
    },
    tealLight: {
      normal: {
        text: akColorN500,
        background: akColorT100,
      },
      hover: {
        text: akColorB400,
        background: akColorT75,
      },
    },
    blueLight: {
      normal: {
        text: akColorB500,
        background: akColorB75,
      },
      hover: {
        text: akColorB400,
        background: akColorB50,
      },
    },
    greenLight: {
      normal: {
        text: akColorG500,
        background: akColorG100,
      },
      hover: {
        text: akColorB400,
        background: akColorG75,
      },
    },
    purpleLight: {
      normal: {
        text: akColorP500,
        background: akColorP75,
      },
      hover: {
        text: akColorB400,
        background: akColorP50,
      },
    },
    redLight: {
      normal: {
        text: akColorN500,
        background: akColorR75,
      },
      hover: {
        text: akColorB400,
        background: akColorR50,
      },
    },
    yellowLight: {
      normal: {
        text: akColorN500,
        background: akColorY100,
      },
      hover: {
        text: akColorB400,
        background: akColorY75,
      },
    },
    greyLight: {
      normal: {
        text: akColorN500,
        background: akColorN30,
      },
      hover: {
        text: akColorB400,
        background: akColorN20,
      },
    },
  },
};

export default theme;
