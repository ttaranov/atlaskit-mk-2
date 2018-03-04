export default [
  {
    path: 'avatar/src/components/Avatar.js',
    testPath: 'avatar/src/components/__tests__/Avatar.js',
    context: 'avatar',
    component: 'Avatar',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'blanket/src/Blanket.js',
    testPath: 'blanket/src/__tests__/blanket.js',
    context: 'blanket',
    component: 'Blanket',
    props: {
      onBlanketClicked: 'click'
    }
  },
  {
    path: 'button/src/components/Button.js',
    testPath: 'button/src/__tests__/testDefaultBehaviour.js',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click'
    }
  },
  {
    path: '__testfixtures__/addsTestsMultipleProps',
    testPath: '__testfixtures__/addsTestsMultipleProps',
    context: 'button',
    component: 'Button',
    props: {
      onClick: 'click',
      onChange: 'change',
    }
  },
  {
    path: '__testfixtures__',
    testPath: '__testfixtures__',
    context: 'button',
    component: 'Button',
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