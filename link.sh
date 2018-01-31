#!/bin/bash
set -e

STRIDE_ROOT=/Users/iloire/code/webcore-next-AK-linked
ATLASKIT_ROOT=/Users/iloire/code/atlaskit-mk-2

# yarn run delete:build && bolt build

# for p in `ls $ATLASKIT_ROOT/packages/fabric/`; do
#     cd $ATLASKIT_ROOT/packages/fabric/$p
#     yarn link
#     cd $STRIDE_ROOT
#     yarn link @atlaskit/$p
# done


for p in `ls $ATLASKIT_ROOT/packages/elements/`; do
    cd $ATLASKIT_ROOT/packages/elements/$p
    yarn link
    cd $STRIDE_ROOT
    yarn link @atlaskit/$p
done
