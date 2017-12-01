const path = require('path');

module.exports = [
  { name: 'Avatar', src: path.join(__dirname, '../src/components/Avatar.jsx') },
  {
    name: 'AvatarGroup',
    src: path.join(__dirname, '../src/components/AvatarGroup.jsx'),
  },
  {
    name: 'AvatarItem',
    src: path.join(__dirname, '../src/components/AvatarItem.jsx'),
  },
  {
    name: 'Presence',
    src: path.join(__dirname, '../src/components/Presence.jsx'),
  },
  { name: 'Status', src: path.join(__dirname, '../src/components/Status.jsx') },
];
