// @flow
import { PureComponent } from 'react';
import DummyItem from './DummyItem';

/** ************************************************************************************************
  This file exists so that we have a component we can pass the @atlaskit/readme Props component
**************************************************************************************************/

type Props = {
  heading: string, // eslint-disable-line react/no-unused-prop-types
  items: Array<DummyItem>, // eslint-disable-line react/no-unused-prop-types
};

export default class DummyGroup extends PureComponent<Props, {}> {}
