// @flow
import React from 'react';
import Tag from '../src';

function handleBeforeRemove() {
  console.log('Oh you did not believe me did you !');
  return false;
}

function handleAfterRemove() {
  console.log('My last words!');
}

export default () => (
  <div>
    <p>Simple</p>
    <Tag text="Liquorice" removeButtonText="Remove me" />

    <p>With href: (view console)</p>
    <Tag
      href="http://www.atlassian.com"
      text="Gingerbread"
      removeButtonText="Nibble, nibble, gnaw who is nibbling at my little house?"
      onAfterRemoveAction={handleAfterRemove}
    />
    <Tag
      href="http://www.atlassian.com"
      text="Magicbread"
      removeButtonText="Nibble, nibble, gnaw who is nibbling at my little house?"
      onBeforeRemoveAction={handleBeforeRemove}
    />

    <p>remove-button: hover unlinked vs. linked</p>
    <Tag text="Fruitcake" removeButtonText="Brush your teeth!" />
    <Tag href="http://www.cupcakeipsum.com" text="Chupa chups" removeButtonText="Floss your teeth!" />
  </div>
);
