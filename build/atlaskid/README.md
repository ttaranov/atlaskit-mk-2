# Atlaskid

This service exposes Landkid on micros for use in the Atlaskit repo.

Landkid is our new service to help merge PRs to prevent all the known issues with merging lots of PRs at once and PRs being out of date when they are merged. It does this by putting merges into a queue and only running one at once and by running a 'Landkid' build when trying to merge.

This build will rebase your branch onto latest master and run what would essentially be a master build. If your build would have made master red, it will fail and the next builds will run!

Access to Atlaskid is controlled by the "Fabric Build" team. You can message them in their stride room to request access. Alternatively, you may have your builds merged by someone who has permission.

# FAQ

**I don't have access to merge?**

Nobody has access to merge anymore, all merges must go through Atlaskid. If you don't see a "land" button in your PRs you either:

* Don't have write permission in the repo (your BB account is not set up correctly)
* You don't have access to Atlaskid (your name is not in the "allowed_users" list [here](https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net/current-state/)).

Talk to the Fabric Build room if you need this.

**I hit "Land", now what?**

Your PR should now say that it is in the queue. You can see the current queue [here](https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net/current-state/).

**I hit "land" and my build ran but it didn't merge?**

If you can see three green builds but your PR has still not merged (and you don't see it in the current "running" build on Landkid) then something has gone wrong during the actual merge. This might be:

* Someone removed an approval at the time the bot tried to merge
* You may have had open tasks when the bot tried to merge
* You may have pushed changes before the bot was able to merge
* BB may not have fired the webhook required to tell landkid to merge
* Landkid may have restarted unexpectedly and dropped your build

All of these situations should be able to be fixed by hitting land again (after getting approvals, closing tasks, etc).

If this happens again, contact the "Fabric Build" room for them to investigate.

# Scripts

There are some helpers scripts that can be run here:

* `yarn get-state` - outputs the current state of landkid (queue, allowed to merge, lock state, etc)
* `yarn pause` - pauses any new builds from landking, but allows queues to empty (usually used if an important build is landing, or we are upgrading service)
* `yarn pause -- "Some sort of reason"` - pauses server also showing a custom reason for why builds are paused. Reason is visible in PR screen and in `/current-state`
* `yarn unpause` - unpauses builds
* `yarn fix-locked` - used to fix a specific issue that we've hit a few times where the `locked` flag is true but no builds are running.
  * This essentially just runs `unlock` and `next()`, two debugging functions we've left in so that we dont have to redeploy if things go wrong.
* `yarn release` - will deploy a new version of atlaskid to production.
  * **This should only be used if you know what you are doing**
  * This will bump the tag number, pause builds, wait for the queue to empty, build a new docker image, push image to docker repository and then deploy the app to micros
  * You will need access to the private docker repository and micros and be logged in to both to do this.
  * Once the release is done, there can sometimes a short period where the old instance will stay alive (up to an hour).
    To verify if there is an old version running you can run
    ```
    micros service:show atlaskit-atlaskid -e stg-west
    ```
    If you see one listed like this:
    ```
    other (deploying or awaiting cleanup):
        atlaskit-atlaskid--stg-west--v15--2018-06-08-21-03-utc--8u5hm5e74oq028i5 - (CREATE_COMPLETE)
    ```
    You can remove it immediately by running
    ```
    micros stack:delete atlaskit-atlaskid--stg-west--v15--2018-06-08-21-03-utc--8u5hm5e74oq028i5 -e stg-west -v
    ```
    In the future we might add this to the deploy script.
    **Edit**: It now looks like zombie stacks can be quite common and won't always show up in the "other" section
    If, after deployment you still see requests hitting the old server (you'll know because it will still be paused and have history) just run the delete command above but for the rollback stack (from the first command).

# atlaskit-atlaskid.sd.yml

Information about this config file is presented here because our release scripts override the comments each time we update it.

Important fields to know about:

```
scaling:
  min: 1
  max: 1
```

This section is important as it makes sure we only run our service on a single node (the default being 2, with automatic scaling if the load gets too high). Because we don't use a database at all and keep the temporary state in memory, it's vital we only have one node, or your requests will be distributed between them!

```
links:
  binary:
    name: docker.atl-paas.net/atlaskit/atlaskid
    tag: v9
```

This section is about the docker image we are publishing each time we release. Name and tag should be pretty self explanatory.

Our image is pushed to the atlassian private docker registry (docker.atl-paas.net).

The tag number is automatically bumped each time you run `release`.

## Coming soon:

Docs for testing in DDEV/locally before pushing to production.

I'll write more docs around this next time we are making a major change, so that I go through all the steps and dont forget anything.

# Helpful links

### DDEV

* deployed [here](https://atlaskit-atlaskid.ap-southeast-2.dev.public.atl-paas.net/).
* logs [here](https://splunk.paas-inf.net/en-US/app/search/search?q=search%20source%3DHyOo_YRSz%20m.t%3Dapplication%20env%3Dddev%20index%3Dobzg6zdvmn2c2ztbmjzgsyy&earliest=-15m&latest=now&display.page.search.mode=verbose&dispatch.sample_ratio=1&sid=1517375378.26745_4DCAA4A3-284A-4537-9FEC-85A2DF05C4ED)

### PROD

* deployed [here](https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net/)
* logs [here](https://splunk.paas-inf.net/en-GB/app/search/search?earliest=-15m&latest=now&q=search%20source%3DHyOo_YRSz%20m.t%3Dapplication%20env%3Dstg-west%20index%3Dobzg6zdvmn2c2ztbmjzgsyy&display.events.fields=%5B%22message%22%2C%20%22m.sv%22%5D&display.page.search.mode=verbose&dispatch.sample_ratio=1&sid=1517460620.41659_E7788A4C-2494-4763-81E0-36C703BBF35D)

### Report to show 500 errors from builds with their retrys

[Report to show 500 errors from builds with their retrys](https://splunk.paas-inf.net/en-GB/app/search/report?sid=1533094344.15292_4DCAA4A3-284A-4537-9FEC-85A2DF05C4ED&s=%2FservicesNS%2Flbatchelor%2Fsearch%2Fsaved%2Fsearches%2FLandkid%20Build%20Failures)

