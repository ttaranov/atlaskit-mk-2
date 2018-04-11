// @flow

import React from 'react';
import Context from './Context';

type Props = {
  children: Function,
  themes: {},
};

export default (props: Props) => {
  const themesObj = props.themes || {};
  return (
    <Context.Consumer>
      {theme =>
        props.children({
          ...(themesObj.default || {}),
          ...themesObj[theme.mode],
        })
      }
    </Context.Consumer>
  );
};
