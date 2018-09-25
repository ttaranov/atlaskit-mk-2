import * as React from 'react';
import { Component } from 'react';
import {
  createStorybookContext,
  collectionNames,
} from '@atlaskit/media-test-helpers';
import { CardList } from '../src';
import {
  CardSwitcherWrapper,
  CardSwitcherRow,
  CardSwitcherBtn,
  CardSwitcherTitle,
} from '../example-helpers/styled';

const context = createStorybookContext();

interface CardSwitcherProps {
  delay?: number;
  dataURI?: string;
}

interface CardSwitcherState {
  collectionName: string;
}

class CardSwitcher extends Component<CardSwitcherProps, CardSwitcherState> {
  constructor(props: CardSwitcherProps) {
    super(props);
    this.state = { collectionName: this.collections[0] };
  }

  render() {
    const { toggle } = this;
    const { collectionName } = this.state;

    return (
      <CardSwitcherWrapper>
        <CardSwitcherRow>
          <div>NO infinite scroll</div>
          <CardSwitcherBtn onClick={toggle}>Toggle collection</CardSwitcherBtn>
          <CardSwitcherTitle>{collectionName}</CardSwitcherTitle>
          <CardList
            context={context}
            collectionName={collectionName}
            pageSize={30}
            cardAppearance={'small'}
          />
        </CardSwitcherRow>
        <CardSwitcherRow>
          <div>With infinite scroll</div>
          <CardSwitcherBtn onClick={toggle}>Toggle collection</CardSwitcherBtn>
          <CardSwitcherTitle>{collectionName}</CardSwitcherTitle>
          <CardList
            context={context}
            collectionName={collectionName}
            pageSize={20}
            height={320}
            useInfiniteScroll={true}
            cardAppearance={'small'}
          />
        </CardSwitcherRow>
      </CardSwitcherWrapper>
    );
  }

  private get collections() {
    return collectionNames;
  }

  toggle = () => {
    const index =
      this.collections.indexOf(this.state.collectionName) === 0 ? 1 : 0;

    this.setState({ collectionName: this.collections[index] });
  };
}

export default () => <CardSwitcher />;
