# Landkid

This changelog is manually curated.

We don't publish this package, so we'll be doing versions based on the docker image

## v7 (2018-03-5 )

Uses landkid version 0.0.20

* Introduces `unlock` and `next` endpoints
  * `api/unlock` and `api/next` respectively
* Introduces `pausedReason` functionality
  * `api/pause` can now accept a `pausedReason` string which will appear in the state and on the
   front end.
  * `curl -H "Content-Type: application/json" -X POST https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net/api/pause -d '{"reason":"Upgrade in progress"}'`
* Added `elementsTeam` and `searchAndSmartsTeam` to allowed users
