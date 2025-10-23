// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

import { config } from "config";

export const environment = {
  production: false,
  apiURL: config.apiUrl,
  googleConfig:{
    apiKey:"435857895043-69cc44aik669cm88r679but300il9apk.apps.googleusercontent.com",
    mapKey:"AIzaSyAZuOCJa7oj5Nms9-PyJVzoBGLAH4dQbmU"
  }
};
