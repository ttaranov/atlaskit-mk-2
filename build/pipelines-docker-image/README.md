# Pipelines Docker Image

This docker image is used to set up Atlaskit builds in CI. It's primarily been put in place so that
we aren't reinstalling yarn every single build because it's become quite flakey (returning 520 errors from cloudflare).

We've kept it as light as possible by just extending from the `node:8.4.0` image, just as we used to
