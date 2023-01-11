# Sample project to demonstrate SMS Verification and user details editing

[![Netlify Status](https://api.netlify.com/api/v1/badges/df67c880-2fd6-4a74-a24f-b157f7d7553e/deploy-status)](https://app.netlify.com/sites/phonefind/deploys)

This is a sample project to demonstrate Firebase SMS Verification and Cloud Firestore access using Netlify functions. It is built using [Angular](https://angular.io/) and uses [Netlify Functions](https://www.netlify.com/docs/functions/) with [Firebase](https://firebase.google.com/) and a sprinkle of [Sass](https://sass-lang.com/).

To set up this project with Netlify, please make sure you have the following environment variables defined:
- `firebase`: Your Firebase config object, as a JSON string
- `firebase_admin`: Your Firebase Admin / service account config object, as a JSON string
- `firebase_db_url`: The name of your Cloud Firestore database (e.g. `phonefind-1337o`)

Then run the following to start a locally instanced version of the Functions and the Angular frontend:

```
netlify dev
```

If you wish to run just the Angular part of this code-base, you'll need to put your Firebase config object in the `src/environments/environment.ts` file as the `firebase` property.
On Netlify, this is done automatically by the included `Makefile`.

To run the project without the Netlify Functions, run:

```
ng serve
```
