export const object = {
  '@type': 'Object',
  url: 'https://www.example.com/',
  name: 'Some object',
  summary: 'The object description',
  generator: {
    type: 'Application',
    name: 'My app',
    icon: 'https://www.example.com/icon.jpg',
  },
};

export const document = {
  ...object,
  '@type': 'Document',
  commentCount: 214,
};

export const spreadsheet = {
  ...document,
  '@type': 'Spreadsheet',
};
