# Atlaskid

This service exposes Landkid on micros for use in the Atlaskit repo

# Developing Locally

# Deploying

This service runs on a docker image called `atlaskit/atlaskid` that lives on the Atlassian dockerhub `docker.atl-paas.net`;
Each release will have a different `tag` which will need to be manually bumped when doing a release. Find the current `tag` in
the `atlaskit-atlaskid.sd.yml` file (i.e `v1`) and increment it.

Now you will can update the docker image. Make sure you modify the tag below to match the new one in the `sd.yml` file.

```
docker build -t docker.atl-paas.net/atlaskit/atlaskid:v1 .
```

Now push this image to the Atlassian dockerhub

```
docker push docker.atl-paas.net/atlaskit/atlaskid:v1
```

Now you can deploy to micros. The service name is `atlaskit-atlaskid` (this is not stored anywhere but is required for deployment) and is
deployed to the `stg-west` environment (make sure this is included when running deployment and stash commands!);

```
micros service:deploy atlaskit-atlaskid -e stg-west
```

> You may need to login with `micros user:login` first

DDEV is deployed [here](https://atlaskit-atlaskid.ap-southeast-2.dev.public.atl-paas.net/).

PROD is deployed [here](https://atlaskit-atlaskid.us-west-1.staging.public.atl-paas.net/)

DDEV logs can be found [here](https://splunk.atlassian.io/en-US/app/search/search?q=search%20source%3DHyOo_YRSz%20m.t%3Dapplication%20env%3Dddev%20index%3Dobzg6zdvmn2c2ztbmjzgsyy&earliest=-15m&latest=now&display.page.search.mode=verbose&dispatch.sample_ratio=1&sid=1517375378.26745_4DCAA4A3-284A-4537-9FEC-85A2DF05C4ED)

PROD logs can be found [here](https://splunk.atlassian.io/en-GB/app/search/search?earliest=-15m&latest=now&q=search%20source%3DHyOo_YRSz%20m.t%3Dapplication%20env%3Dstg-west%20index%3Dobzg6zdvmn2c2ztbmjzgsyy&display.events.fields=%5B%22message%22%2C%20%22m.sv%22%5D&display.page.search.mode=verbose&dispatch.sample_ratio=1&sid=1517460620.41659_E7788A4C-2494-4763-81E0-36C703BBF35D)



```
# Deploy staging (prod)
docker build -t docker.atl-paas.net/atlaskit/atlaskid:v7 . && docker push docker.atl-paas.net/atlaskit/atlaskid:v7 && micros service:deploy atlaskit-atlaskid -e stg-west
```
