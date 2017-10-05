// @flow
import type { Directory, File } from './types';

function dir(id: string, children: Array<File | Directory>): Directory {
  return { type: 'dir', id, children };
}

function file(id: string, exports: () => Promise<mixed>, contents: () => Promise<string>): File {
  return { type: 'file', id, exports, contents };
}

export default dir('atlaskit-mk2', [
  dir('docs', [
    file('getting-started.md', () => import('../../docs/getting-started.md'), () => import('!!raw-loader!../../docs/getting-started.md')),
    dir('guides', [
      file('component-design.md', () => import('../../docs/guides/01-component-design.md'), () => import('!!raw-loader!../../docs/guides/01-component-design.md')),
      file('naming-props.md', () => import('../../docs/guides/02-naming-props.md'), () => import('!!raw-loader!../../docs/guides/02-naming-props.md')),
    ]),
  ]),
  dir('packages', [
    dir('elements', [
      dir('badge', [
        file('package.json', () => import('../../packages/elements/badge/package.json'), () => import('!!raw-loader!../../packages/elements/badge/package.json')),
        file('CHANGELOG.md', () => import('../../packages/elements/badge/CHANGELOG.md'), () => import('!!raw-loader!../../packages/elements/badge/CHANGELOG.md')),
        dir('docs', [
          file('intro', () => import('../../packages/elements/badge/docs/0-intro.js'), () => import('!!raw-loader!../../packages/elements/badge/docs/0-intro.js')),
        ]),
        dir('examples', [
          file('0-basic.js', () => import('../../packages/elements/badge/examples/0-basic'), () => import('!!raw-loader!../../packages/elements/badge/examples/0-basic')),
          file('1-max.js', () => import('../../packages/elements/badge/examples/1-max.js'), () => import('!!raw-loader!../../packages/elements/badge/examples/1-max.js')),
          file('2-onValueUpdated.js', () => import('../../packages/elements/badge/examples/2-onValueUpdated.js'), () => import('!!raw-loader!../../packages/elements/badge/examples/2-onValueUpdated.js')),
        ]),
      ]),
      dir('lozenge', [
        file('package.json', () => import('../../packages/elements/lozenge/package.json'), () => import('!!raw-loader!../../packages/elements/lozenge/package.json')),
        // file('CHANGELOG.md', () => import('../../packages/elements/lozenge/CHANGELOG.md'), () => import('!!raw-loader!../../packages/elements/lozenge/CHANGELOG.md')),
        dir('docs',[
          file('0-intro.js', () => import('../../packages/elements/lozenge/docs/0-intro.js'), () => import('!!raw-loader!../../packages/elements/lozenge/docs/0-intro.js')),
        ]),
        dir('examples', [
          file('0-basic.js', () => import('../../packages/elements/lozenge/examples/0-basic.js'), () => import('!!raw-loader!../../packages/elements/lozenge/examples/0-basic.js')),
          file('1-truncation.js', () => import('../../packages/elements/lozenge/examples/1-truncation.js'), () => import('!!raw-loader!../../packages/elements/lozenge/examples/1-truncation.js')),
          file('2-baselineAlignment.js', () => import('../../packages/elements/lozenge/examples/2-baselineAlignment.js'), () => import('!!raw-loader!../../packages/elements/lozenge/examples/2-baselineAlignment.js')),
        ]),
      ]),
      dir('tag', [
        file('package.json', () => import('../../packages/elements/tag/package.json'), () => import('!!raw-loader!../../packages/elements/tag/package.json')),
        file('CHANGELOG.md', () => import('../../packages/elements/tag/CHANGELOG.md'), () => import('!!raw-loader!../../packages/elements/tag/CHANGELOG.md')),
        dir('docs',[
          file('0-intro.js', () => import('../../packages/elements/tag/docs/0-intro.js'), () => import('!!raw-loader!../../packages/elements/tag/docs/0-intro.js')),
        ]),
        dir('examples', [
          file('0-basic.js', () => import('../../packages/elements/tag/examples/0-basic.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/0-basic.js')),
          file('1-colors.js', () => import('../../packages/elements/tag/examples/1-colors.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/1-colors.js')),
          file('2-textSimple.js', () => import('../../packages/elements/tag/examples/2-textSimple.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/2-textSimple.js')),
          file('3-textMaxLength.js', () => import('../../packages/elements/tag/examples/3-textMaxLength.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/3-textMaxLength.js')),
          file('4-baselineAlignment.js', () => import('../../packages/elements/tag/examples/4-baselineAlignment.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/4-baselineAlignment.js')),
          file('5-href.js', () => import('../../packages/elements/tag/examples/5-href.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/5-href.js')),
          file('6-removeButtonText.js', () => import('../../packages/elements/tag/examples/6-removeButtonText.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/6-removeButtonText.js')),
          file('7-elemBefore.js', () => import('../../packages/elements/tag/examples/7-elemBefore.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/7-elemBefore.js')),
          file('8-edgeCases.js', () => import('../../packages/elements/tag/examples/8-edgeCases.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/8-edgeCases.js')),
          file('9-overview.js', () => import('../../packages/elements/tag/examples/9-overview.js'), () => import('!!raw-loader!../../packages/elements/tag/examples/9-overview.js')),
        ]),
      ]),
      dir('tag-group', [
        file('package.json', () => import('../../packages/elements/tag-group/package.json'), () => import('!!raw-loader!../../packages/elements/tag-group/package.json')),
        file('CHANGELOG.md', () => import('../../packages/elements/tag-group/CHANGELOG.md'), () => import('!!raw-loader!../../packages/elements/tag-group/CHANGELOG.md')),
        dir('docs', [
          file('0-intro.js', () => import('../../packages/elements/tag-group/docs/0-intro.js'), () => import('!!raw-loader!../../packages/elements/tag-group/docs/0-intro.js')),
        ]),
        dir('examples',[
          file('0-basic.js', () => import('../../packages/elements/tag-group/examples/0-basic.js'), () => import('!!raw-loader!../../packages/elements/tag-group/examples/0-basic.js')),
          file('1-overflow.js', () => import('../../packages/elements/tag-group/examples/1-overflow.js'), () => import('!!raw-loader!../../packages/elements/tag-group/examples/1-overflow.js')),
          file('2-rounded.js', () => import('../../packages/elements/tag-group/examples/2-rounded.js'), () => import('!!raw-loader!../../packages/elements/tag-group/examples/2-rounded.js')),
          file('3-animation.js', () => import('../../packages/elements/tag-group/examples/3-animation.js'), () => import('!!raw-loader!../../packages/elements/tag-group/examples/3-animation.js')),
        ]),
      ]),
    ]),
  ]),
  dir('patterns', [
    file('package.json', () => import('../../patterns/package.json'), () => import('!!raw-loader!../../patterns/package.json')),
    dir('examples', [
      file('01-test.js', () => import('../../patterns/examples/01-test.js'), () => import('!!raw-loader!../../patterns/examples/01-test.js')),
    ])
  ])
]);
