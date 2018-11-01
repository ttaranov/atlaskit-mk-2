**NOTE** Unless you are using the `iconsInfo` export, this change is not breaking.

- Rename `iconsInfo` to `metadata` to more accurately reflect its role

This change comes with rethinking what is exported from this object,
which no longer includes copies of the icons. If you need to rely on the
metadata to get the packages, each should be required by your own code.

The `icon-explorer` has an example of how to do this.