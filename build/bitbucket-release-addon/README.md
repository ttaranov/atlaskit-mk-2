# AK-MK-2 Releases Addon

This addon creates a panel in Bitbucket PRs that shows which packages will be released.

## Develop

The main files to be aware of are:

```
src/index.ejs
  - Main entry point for the html that is rendered in the addon (shows the loading state)
src/index.js
  - Main entry point for the JS that runs in the addon
static/atlassian-connect.json
  - The addon descriptor with information about the addon itself
```

When dev'ing, the two main things that need to be changed are

* `atlassian-connect.json.baseUrl` being set to point to your local machine (see below)
* `atlassian-connect.json.modules.webpanels.conditionals.params.value` needs to point to whichever repo you are testing in (see below)

### Running locally

To run the addon locally simply run

```
yarn dev
```

which will spin up a local webpack server on port 8080

If you open that you should see an error message about not being able to load commits (you're not in Bitbucket silly).

### Prepping for Installation

The addon can be used in any repo that has changeset commits. A simple way to get set up is to clone the repo you normally use and install in there for testing.

First you'll need to expose your local server to the internet. For this, run:

```sh
yarn ngrok http 8080 -host-header="localhost:8080"
```

This will give you a http and https address you can access from the internet (try this yourself).

Next, you'll need to put the https address into the `atlassian-connect.json` file as your `baseUrl`.

Now, you will need to get the uuid of the repo you are running in.

To do this, simply open the repo and paste this snippet into your console:

```js
JSON.parse($('[data-current-repo]')[0].getAttribute('data-current-repo')).uuid
```

> **Note** This trick wont work on any pages that have been moved to the new UI. You can use an older page (most settings pages)
> or you can `curl` the Bitbucket API.

```bash
curl -s "https://api.bitbucket.org/2.0/repositories/atlassian-marketplace/marketplace-frontend" | jq '.uuid'
# Note, you'll need an app password if your repo is private
```

Now put this value into the `atlassian-connect.json` field for "conditions". This prevents your addon from accidentally showing in other repos that might not be expecting it.

> Technically, you can just remove this field to get things working locally. It's reccomended to not do that, because if you push to production and accidentally forget to put it back in, you'll display the addon for ALL repos it's owned by, where as pushing with the wrong uuid will simply cause it to not show for anyone.

Now you're ready to install!

### Installing the addon locally

To install addons, go to your Bitbucket settings and click `Manage Integrations` (or go to https://bitbucket.org/account/user/<your_username>/addon-management) and click "Install add-on from URL.

Here you need to paste your ngrok url with the `/atlassian-connect.json` on the end (i.e https://5f7fdc4f.ngrok.io/atlassian-connect.json).

You should now be able to open a PR in that repo and see the addon running.

The webpack dev server will automatically rebuild any changes you make to any of the files.

If you need to make changes to the `atlassian-connect.json` file, you'll need to reinstall the addon (go to the addon management page, click the addon name and click "update").

That's it!

> There is a known CORS issue when running locally which will look something like
> `GET https://localhost:8080/sockjs-node/info?t=1512353501214 net::ERR_CONNECTION_CLOSED`
> This can be safely ignored.

## Testing deployment

A useful test if you are worried about a deployment is to build the addon locally using

```
yarn build
```

then starting a local http server from the `dist/` dir (whatever you have installed globally is fine)

```
http-server dist/
```

If this runs on port 8080 as well, you should be able to access that over ngrok and you can test that the deployed code will work as expected
(install as usual and confirm that everything works as expecte).

## Deploying

This addon is deployed to netlify (https://app.netlify.com/sites/ak-mk-2-releases-addon/overview) and deployments are currently done manually.

To deploy you'll need to build the site statically:

```
yarn build
```

This will create the `dist/` directory.

Before deploying **double** check the following:

* Your baseUrl is set back to https://app.netlify.com/sites/ak-mk-2-releases-addon/overview in `dist/atlassian-connect.json`
* Your uuid is set back to the uuid of ak-mk-2 (`{6380b4e9-6ac5-4dd4-a8e0-65f09cabe4c8}`)
  * And also the atlassian/marketplace-frontend repo now (`{5e4d9c6e-5761-4c81-91b8-1e111f014b64}`)
* Make sure the uuid has the brackets around it!
* Seriously, double check that you haven't removed the conditions field. This will be catastrophically embarressing if we miss it

Now, simply login to Netlify (https://www.netlify.com/) as the `Design Platform` user (credentials in LastPass), click the `ak-mk-2-releases-addon` site, go to "deploys", go to the dist directory in finder and drag it into the dropzone.

That's it!
