export default [
  {
    path: 'avatar/src/components/Avatar',
    context: 'avatar',
    props: {
      onClick: 'click'
    }
  },
  {
    path: 'blanket/src/Blanket',
    context: 'blanket',
    props: {
      onBlanketClicked: 'click'
    }
  },
  {
    path: 'button/src/components/Button',
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
  }
];