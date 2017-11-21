# Versioning

> All components must follow [Semver](http://semver.org/). For new components they should start in what's called "dev releases" at 0.0.0. While a component is in dev releases, it is considered unstable and not bound by normal Semver rules for versions above the first major release (1.0.0).

> Although Semver leaves dev releases open to do anything you want, we will only make breaking changes in minor versions (i.e. 0.1.0). Features and non-breaking patches will still go into their normal versions. Basically, we still follow Semver in dev releases except that breaking changes go into minor releases.

For the sake of keeping things simple, refer to the [Semver spec](http://semver.org/) for anything this document does not cover.

## Dev releases

All components, whether they are being started fresh or being converted from another implementation, should start in dev releases. There's a few reasons for this.

### Shipping often

We move fast and want to ship often. We don't want our consumers to be twiddling their thumbs at perfection. While stability is important, it's also important that we iterate during the build phase and are able to ship functionally atomic pieces until it reaches a 1.0.

This not only gives consumers an insight to a component's API and functionality, it allows us to have a discussion about them and further harden them if necessary.

### Conveying stability

Versions do matter. If we release something at 1.0 and say we follow Semver, it tells consumers that this API is ready for prime time. If we realise we made some mistakes and have to reiterate them, it may cause some breaking changes. Using dev releases here gives us a grace period where we can harden a component while a consumer uses it. We will always have early adopters and later adopters. Let's leverage the former to help the latter.

*A version should specifically outlines the overall stability of the component and where it's at in its greater evolutionary lifecycle.*

### Striking a balance

We want as many contributions as possible and we want to make the process as simple as possible for both parties.

For contributors, they want to feel empowered to make a useful contribution. Their time is also very limited, so we must respect that and use it as best as possible. For reviewers, we want to empower contributors and, like them, our time is also very limited.

It's important to strike a balance here because the more contributions we get, the better it is for us because it takes the brunt of the initial weight off our shoulders. By contributing components into our repo as dev releases, it allows contributors a bit more leeway in terms of getting an initial iteration into Atlaskit. Even if it has some nits and some things that need work, using dev releases gives us time to polish those off before going 1.0.
