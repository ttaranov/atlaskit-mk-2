import * as React from 'react';
import { Component } from 'react';
import {
  createStorybookContext,
  imageFileId,
  audioFileId,
} from '@atlaskit/media-test-helpers';
import { MediaStore } from '../src';
import { Card } from '@atlaskit/media-card';
// import * as uuid from 'uuid';

const context = createStorybookContext();
// const store = new MediaStore({
//   authProvider: context.config.authProvider,
// });

class Example extends Component {
  async componentDidMount() {
    // const response = await store.getItems([
    //   {
    //     id: imageFileId.id,
    //     collection: imageFileId.collectionName,
    //   },
    //   {
    //     // id: uuid(),
    //     id: audioFileId.id,
    //     collection: audioFileId.collectionName,
    //   },
    // ]);
    // response.data.items.forEach(item => {
    //   console.log(item.id, item.details);
    // });
  }

  renderCards = () => {
    const cards = [imageFileId, audioFileId].map(item => {
      return <Card key={item.id} context={context} identifier={item} />;
    });

    return <div>{cards}</div>;
  };
  render() {
    return (
      <div>
        <h1>Get Items</h1>
        {this.renderCards()}
      </div>
    );
  }
}

export default () => <Example />;
