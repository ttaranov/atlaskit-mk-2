// @flow
import faker from 'faker';
import {
  type ObjectItemShape,
  type PersonItemShape,
  type ContainerItemShape,
} from './types';

function pickRandom<T>(array: Array<T>): T {
  const index = faker.random.number(array.length - 1);
  return array[index];
}

export function randomJiraIconUrl() {
  const urls = [
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype',
    'https://product-fabric.atlassian.net/secure/viewavatar?size=xsmall&avatarId=10303&avatarType=issuetype',
  ];

  return pickRandom(urls);
}

export function randomConfluenceIconUrl() {
  const urls = [
    'https://home.useast.atlassian.io/confluence-page-icon.svg',
    'https://home.useast.atlassian.io/confluence-blogpost-icon.svg',
  ];

  return pickRandom(urls);
}

function randomPresenceState() {
  const states = ['online', 'offline', 'busy'];
  return pickRandom(states);
}

export const getPersonAvatarUrl = (identity: string) =>
  `http://api.adorable.io/avatar/32/${identity}`;
export const getContainerAvatarUrl = (idx: number) =>
  `http://lorempixel.com/32/32/nature/${idx}`;

function randomProduct() {
  const products = ['jira', 'confluence'];
  return pickRandom(products);
}

function randomIssueKey() {
  const keys = ['ETH', 'XRP', 'ADA', 'TRON', 'DOGE'];
  return `${pickRandom(keys)}-${faker.random.number(1000)}`;
}

export function objectData(n: number): ObjectItemShape[] {
  const items = [];

  for (let i = 0; i < n; i++) {
    const provider = randomProduct();

    const iconUrl =
      provider === 'jira' ? randomJiraIconUrl() : randomConfluenceIconUrl();

    items.push({
      resultId: faker.random.uuid(),
      type: 'object',
      name: faker.company.catchPhrase(),
      containerName: faker.company.companyName(),
      avatarUrl: iconUrl,
      href: faker.internet.url(),
      objectKey: randomIssueKey(),
    });
  }

  return items;
}

export function containerData(n: number): ContainerItemShape[] {
  const items = [];

  for (let i = 0; i < n; i++) {
    items.push({
      resultId: faker.random.uuid(),
      type: 'container',
      name: faker.company.companyName(),
      avatarUrl: getContainerAvatarUrl(i),
    });
  }

  return items;
}

export function personData(n: number): PersonItemShape[] {
  const items = [];

  for (let i = 0; i < n; i++) {
    items.push({
      resultId: faker.random.uuid(),
      type: 'person',
      name: faker.name.findName(),
      avatarUrl: faker.image.avatar(),
      presenceState: randomPresenceState(),
    });
  }

  return items;
}
