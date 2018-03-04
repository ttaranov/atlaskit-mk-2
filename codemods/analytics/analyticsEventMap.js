export default [
  {
    path: 'avatar/src/components/Avatar.js',
    testPath: 'avatar/src/component/__tests__/Avatar.js',
    context: 'avatar',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'blanket/src/Blanket.js',
    context: 'blanket',
    props: {
      onBlanketClicked: 'click'
    }
  },
  {
    path: 'button/src/components/Button.js',
    context: 'button',
    props: {
      onClick: 'click'
    }
  },
  {
    path: '__testfixtures__',
    context: 'button',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'comment/src/components/Comment.js',
    context: 'comment',
    props: {
      onClick: 'click'
    }
  },  
];