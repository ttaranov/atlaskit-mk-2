- Simplify the icons build process

Icons no longer need a custom `build` step to be accurate on npm. This
has come about by renaming the `es5` folder to `cjs`. If you weren't reaching
into our package's internals, you shouldn't notice.
