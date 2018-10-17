export const AsanaTask = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://app.asana.com/0/759475196256783/759474743020981',
  '@type': ['Object', 'atlassian:Task'],
  '@url': 'https://app.asana.com/0/759475196256783/759474743020981',
  assigned: '2018-07-27T11:15:06.815Z',
  assignedBy: {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  assignedTo: {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  attributedTo: {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  commentCount: 1,
  content: 'Some raw text with new lines',
  context: {
    '@type': 'Collection',
    name: 'NEXT UP',
  },
  dateCreated: '2018-07-27T11:14:57.392Z',
  endTime: '2018-07-31T00:00:00.000Z',
  generator: {
    '@type': 'Application',
    icon: 'https://asana.com/favicon.ico',
    name: 'Asana',
  },
  isCompleted: false,
  isDeleted: false,
  mediaType: 'text/plain',
  name: 'project-board-task-1',
  subscriber: {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
  subscriberCount: 1,
  summary: 'Some raw text with new lines',
  tags: [
    {
      '@type': 'Object',
      id: 'https://app.asana.com/0/759494272065666/list',
      name: 'tagged',
      url: 'https://app.asana.com/0/759494272065666/list',
    },
  ],
  taskStatus: {
    '@type': 'Object',
    name: 'Today',
    url: 'https://app.asana.com/0/759475196256783/list',
  },
  taskType: {
    '@type': 'Object',
    id: 'https://app.asana.com/0/759475196256783/759474743020981',
    name: 'project-board-task-1',
    url: 'https://app.asana.com/0/759475196256783/759474743020981',
  },
  updated: '2018-07-31T11:48:17.741Z',
  updatedBy: {
    '@type': 'Person',
    image:
      'https://s3.amazonaws.com/profile_photos/759476127806059.0DzzEW07pkfWviGTroc8_128x128.png',
    name: 'Test User',
  },
};

export const GitHubIssue = {
  '@context': {
    '@vocab': 'https://www.w3.org/ns/activitystreams#',
    atlassian: 'https://schema.atlassian.com/ns/vocabulary#',
    schema: 'http://schema.org/',
  },
  '@id': 'https://github.com/User/repo-name/issues/8',
  '@type': ['Object', 'atlassian:Task'],
  '@url': 'https://github.com/user/repo-name/issues/8?somefilter=true',
  assignedBy: {
    '@type': 'Person',
    image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
    name: 'User',
  },
  assignedTo: [
    {
      '@type': 'Person',
      image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
      name: 'User',
    },
    {
      '@type': 'Person',
      image: 'https://avatars0.githubusercontent.com/u/40266685?v=4',
      name: 'Partner',
    },
  ],
  attributedTo: {
    '@type': 'Person',
    image: 'https://avatars2.githubusercontent.com/u/15986691?v=4',
    name: 'User',
  },
  commentCount: 24,
  content: 'Issue descriptions bla bla',
  context: {
    '@type': 'atlassian:Project',
    name: 'User/repo-name',
  },
  dateCreated: '2018-07-10T15:00:32Z',
  generator: {
    '@type': 'Application',
    icon: 'https://git-scm.com/favicon.ico',
    name: 'GitHub',
  },
  isCompleted: false,
  isDeleted: false,
  mediaType: 'text/markdown',
  name: 'Some issue with icons',
  startTime: '2018-07-10T15:00:32Z',
  subscriber: [
    {
      '@type': 'Person',
      image: 'https://avatars0.githubusercontent.com/u/385?v=4',
      name: 'subscriber1',
    },
    {
      '@type': 'Person',
      image: 'https://avatars3.githubusercontent.com/u/2050?v=4',
      name: 'subscriber2',
    },
  ],
  subscriberCount: 1,
  tag: [
    {
      '@type': 'Object',
      id: 576144926,
      name: 'enhancement',
      url: 'https://github.com/user/repo-name/labels/enhancement',
    },
    {
      '@type': 'Object',
      id: 576144927,
      name: 'help wanted',
      url: 'https://github.com/user/repo-name/labels/help%20wanted',
    },
    {
      '@type': 'Object',
      id: 576144928,
      name: 'invalid',
      url: 'https://github.com/user/repo-name/labels/invalid',
    },
  ],
  taskStatus: {
    '@type': 'Link',
    href: 'https://github.com/user/repo-name/issues?q=is%3Aissue%20is%3Aopen',
    name: 'open',
  },
  taskType: {
    '@type': 'Link',
    href: 'https://github.com/user/repo-name/issues',
    name: 'Issue',
  },
  updated: '2018-07-30T16:15:03Z',
};
